// Inneholder QR-koden nøyaktig det brukeren skrev, også med æøå, € og emoji?
// Genererer koder i appen, laster dem ned og leser dem tilbake med jsQR.
//
// Kjør (fra repo-roten):
//   cd tests
//   npm install
//   npx playwright install chromium   # første gang
//   npm test
// Avhengighetene ligger bare i tests/ – appen selv har fortsatt ingen.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'http://qr-kraft.test';
const JSQR = require.resolve('jsqr/dist/jsQR.js');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon' };

// Serverer repoet fra disk og blokkerer alt eksternt (Tailwind, fonter, Umami).
async function open(page) {
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) return route.abort();
    const file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) return route.fulfill({ status: 404 });
    return route.fulfill({ body: fs.readFileSync(file), contentType: TYPES[path.extname(file)] || 'application/octet-stream' });
  });
  await page.goto(ORIGIN + '/index.html');
  await page.waitForSelector('#qr-preview canvas');
  await page.addScriptTag({ path: JSQR });
  await page.evaluate(() => {
    // Leser et bilde (data-URL) med jsQR. Legger på hvit marg fordi eksporten mangler stillesone (egen sak).
    window.decodeQr = async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const pad = 64;
      const c = document.createElement('canvas');
      c.width = img.naturalWidth + 2 * pad;
      c.height = img.naturalHeight + 2 * pad;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, pad, pad);
      const r = jsQR(ctx.getImageData(0, 0, c.width, c.height).data, c.width, c.height);
      return r ? r.data : null;
    };
  });
  // «Klassisk Sort» så lesbarheten ikke avhenger av fargetemaet (egen sak).
  await page.click('.preset-btn[data-preset="sort"]');
}

// Laster ned PNG slik brukeren gjør, og leser innholdet.
async function decodeDownloadedPng(page) {
  await page.waitForTimeout(300); // la debounce i app.js oppdatere tilstanden
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#btn-download-png')]);
  const png = fs.readFileSync(await dl.path());
  return page.evaluate((src) => window.decodeQr(src), 'data:image/png;base64,' + png.toString('base64'));
}

test('URL med æøå leses tilbake nøyaktig', async ({ page }) => {
  await open(page);
  await page.fill('#input-url', 'https://example.no/blåbær?q=ærø');
  expect(await decodeDownloadedPng(page)).toBe('https://example.no/blåbær?q=ærø');
});

test('WiFi med æøå i SSID og ø i passordet leses tilbake nøyaktig', async ({ page }) => {
  await open(page);
  await page.click('.tab-btn[data-tab="wifi"]');
  await page.fill('#wifi-ssid', 'Hjemme-nettverk æøå');
  await page.fill('#wifi-password', 'Søtpotet-2026');
  expect(await decodeDownloadedPng(page)).toBe('WIFI:T:WPA;S:Hjemme-nettverk æøå;P:Søtpotet-2026;;');
});

test('vCard med navnet Bjørn Åsen leses tilbake nøyaktig', async ({ page }) => {
  await open(page);
  await page.click('.tab-btn[data-tab="vcard"]');
  await page.fill('#vcard-firstname', 'Bjørn');
  await page.fill('#vcard-lastname', 'Åsen');
  expect(await decodeDownloadedPng(page)).toBe(
    ['BEGIN:VCARD', 'VERSION:3.0', 'N:Åsen;Bjørn;;;', 'FN:Bjørn Åsen', 'END:VCARD'].join('\n'),
  );
});

// Direkte mot QREngine (filen som også synkes til ranheimkraft.no), uten app.js sin https://-prefiks.
async function decodeFromEngine(page, data) {
  return page.evaluate(async (data) => {
    const holder = document.createElement('div');
    holder.id = 'engine-test';
    document.body.appendChild(holder);
    const engine = new QREngine('engine-test');
    engine.state.data = data;
    engine.state.colorType = 'solid';
    engine.state.solidColor = '#000000';
    engine.state.cornersSquareCustom = false;
    engine.state.cornersDotCustom = false;
    const options = engine.buildOptions(512);
    holder.remove();
    const blob = await new QRCodeStyling(options).getRawData('png');
    const src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    return { decoded: await window.decodeQr(src), passedToLibrary: options.data };
  }, data);
}

test('tekst med € og emoji leses tilbake nøyaktig', async ({ page }) => {
  await open(page);
  for (const text of ['Pris 100 € 🙂', 'Hei 🐻 fra Ranheim', 'https://example.jp/東京']) {
    expect((await decodeFromEngine(page, text)).decoded).toBe(text);
  }
});

test('ASCII-innhold sendes uendret til biblioteket (samme kode som før)', async ({ page }) => {
  await open(page);
  const text = 'WIFI:T:WPA;S:Ranheim\\;Gjest;P:hemmelig123;;';
  const r = await decodeFromEngine(page, text);
  expect(r.passedToLibrary).toBe(text);
  expect(r.decoded).toBe(text);
});
