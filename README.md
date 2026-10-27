# QR Kraft ⚡

Et gratis, reklamefritt, modulært og lynraskt QR-kode-verktøy med avansert styling og SVG/Canvas-vektorstøtte. Bygget 100 % klientside med personvern i fokus for direkte integrasjon på **[ranheimkraft.no](https://ranheimkraft.no)**.

---

## 🌟 Funksjoner

### 1. Innholdstyper (Faner)
* **🔗 Nettside / Fri Tekst:** Genererer direkte koder for nettadresser eller ren tekst, med automatisk `https://`-validering.
* **📶 Gratis WiFi-skilt:** Formatert for automatisk tilkobling på både iOS og Android (`WIFI:T:WPA;S:SSID;P:Passord;;`). Inkluderer støtte for WPA/WPA2/WPA3, WEP, åpne nettverk og skjulte nettverk (Hidden SSID).
* **📇 Digitalt Visittkort (vCard 3.0):** Standardisert `BEGIN:VCARD` som lar mottakeren lagre navn, tlf, e-post, tittel og firma direkte i kontaktlisten med ett trykk.

### 2. Avansert Utforming & Fargepalett
* **Fargetype:**
  * **Ensfarget (Solid):** Valgfri farge med heksadesimal støtte.
  * **Gradient (Fargeovergang):** Velg mellom **Lineær** og **Radial** gradient, med startfarge, sluttfarge og rotasjonsvinkel ($0^\circ$ til $360^\circ$).
* **Bakgrunn:** Egendefinert bakgrunnsfarge eller **100 % Transparent bakgrunn** (støttes i både PNG og SVG).
* **Prikkformer (Dots Style):** `extra-rounded`, `rounded`, `dots`, `classy`, `classy-rounded`, `square`.
* **Hjørne-øyne (Corner Squares & Corner Dots):** Separat kontroll over form på ytterrammen og indre prikk, samt valgfri egen farge.
* **5 Hurtigtemaer (Presets):**
  * *Ranheim BlåGradient* (Cyan til Ranheim-blå)
  * *Klassisk Sort* (Minimalistisk)
  * *Mørk Gull* (Luksuriøs rav/bronse)
  * *Havblå* (Frisk turkis til dyp marine)
  * *Skoggrønn* (Smaragd til dyp gran)

### 3. Bilde & Logo i Midten
* **Level H Feilkorrigering:** 30 % feilkorrigering garanterer lesbarhet selv med sentrert logo.
* **Form-beskjæring (Canvas):** Valg mellom *Original form*, *Avrundede hjørner* eller *Sirkulær/rund crop*.
* **Skalering & Padding:** Justerbar logostørrelse ($15\,\%$ til $28\,\%$) og marg ($0$ til $15\text{ px}$).
* **Bakgrunnsrensing:** Fjerner automatisk moduler bak logoen (`hideBackgroundDots: true`).

### 4. Eksport & Mobiloptimalisering
* **Oppløsning:** Velg mellom $1024 \times 1024\text{ px}$ (web) og $2048 \times 2048\text{ px}$ (høyoppløst trykk).
* **Formater:**
  * **PNG:** Universelt bildeformat med transparens.
  * **SVG:** Ren skalerbar vektor for plakater og grafisk trykk.
  * **WEBP:** Lynraskt komprimert format.
* **Responsivt & Touch-optimalisert:** Egen sticky nedlastingsknapp på mobil (iOS & Android).

### 5. 6-Måneders Bruksmodell & Ranheim Kraft Vipps
* Statiske koder (WiFi og vCard) lagrer data direkte i pikselmatrisen og er 100 % offline.
* Verktøyet beregner automatisk en 6-måneders gratisperiode og oppfordrer til frivillig Vipps-støtte til Ranheim Kraft (Boks **`3153MT`**) dersom koden er i aktiv drift utover dette.

---

## 📁 Filstruktur

```text
QR Kraft/
├── .gitignore               # Sikkerhetsregler: ignorerer .env, node_modules, temp-filer
├── README.md                # Denne dokumentasjonen
├── index.html               # Hovedapplikasjon (stand-alone og embedding-klar)
└── assets/
    ├── css/
    │   └── style.css        # Skreddersydd styling, sliders, glassmorphism
    ├── js/
    │   ├── app.js           # UI-hendelser, fanebytte, presets, inputs
    │   ├── qr-engine.js     # qr-code-styling wrapper, logo-crop & eksport
    │   └── vipps-widget.js  # Ranheim Kraft Vipps-boks (3153MT)
    ├── vendor/
    │   └── qr-code-styling.js # Frakoblet/lokal sikkerhetskopi av biblioteket
    ├── logo.png             # Ranheim-maskot (våken)
    ├── logosove.png         # Ranheim-maskot (sover ved hover)
    └── polarICON.ico        # Favicon
```

---

## 🚀 Kjøre lokalt

Verktøyet krever ingen byggeverktøy eller backend-server. Du kan åpne `index.html` direkte i en nettleser, eller starte en lokal webserver:

```bash
# Med Python:
python -m http.server 8000

# Eller åpne direkte i nettleser:
start index.html
```

---

## 🔗 Integrasjon med `ranheimkraft.no`

### Alternativ A: Som dedikert underside (`ranheimkraft.no/qr.html`)
1. Kopier `index.html` til `ranheimkraft.no/qr.html`.
2. Kopier innholdet i `assets/` (eller pek på felles ressurser).
3. Legg til menylenke i navigasjonsbaren på `ranheimkraft.no`:
   ```html
   <a href="qr.html" class="hover:text-white transition">QR Kraft</a>
   ```

### Alternativ B: Innebygd via `<iframe>`
```html
<iframe 
  src="https://ranheimkraft.no/qr.html" 
  class="w-full h-[900px] border-0 rounded-2xl" 
  loading="lazy" 
  title="QR Kraft Generator">
</iframe>
```

---

## 🔒 Personvern & Sikkerhet
* **Ingen eksterne serverkall:** All databehandling, bildebeskjæring og QR-matriseberegning skjer lokalt i nettleseren via Web APIs (Canvas, SVG, FileReader).
* **Ingen sporing av innhold:** Verken WiFi-passord, kontaktinformasjon eller URL-er sendes over nettverket.
