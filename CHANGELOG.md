# Endringslogg

Alle merkbare endringer i prosjektet dokumenteres her.

Formatet følger [Keep a Changelog](https://keepachangelog.com/no/1.1.0/), og prosjektet bruker [semantisk versjonering](https://semver.org/lang/no/).

## [Unreleased]

### Fikset
- QR-koder med æ, ø, å, € eller emoji inneholder nå riktig tekst. Teksten kodes som UTF-8; før ble æøå lagret som Latin-1 (mange skannere leste tom tekst), og € og emoji ble ødelagt. Gjelder URL, WiFi og vCard. Koder med bare ASCII er uendret.

### Lagt til
- Regresjonstest i `tests/` som genererer koder i appen og leser dem tilbake med jsQR.
