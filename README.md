# Forma Atelier

Statische Nederlandstalige studiosite. Geen backend, database, tracking of externe scripts.

## Structuur
- index.html: inhoud en CSP.
- assets/css/site.css: CSS-lagen reset, base, layout, components en mobile.
- assets/js/main.js: menu, animatiebediening en lokale projectbrief.
- tests/check_site.py: structuur- en linkcontrole.

## Ontwikkelen
Python 3.12: `python -m http.server 8000`, daarna http://localhost:8000.
Controle: `python tests/check_site.py`.
Deze branch verandert de Pages-publicatie vanaf main niet.

## Grenzen
De CSP via HTML-meta is geen volledige set HTTP-beveiligingsheaders en kan frame-ancestors niet instellen. Assets zijn lokaal; inline scripts en netwerkverzoeken door scripts zijn geblokkeerd. Geen beveiligingsaudit of volledige browsertest uitgevoerd. De illustratie is CSS, geen WebGL. Projectvoorbeelden zijn concepten. Projectbrieven worden alleen lokaal gedownload. Contactadres, prijzen en wettelijke bedrijfsgegevens moeten nog door de eigenaar worden aangeleverd.
Nooit secrets of persoonsgegevens in frontendcode of deze openbare repository plaatsen. Een .gitignore voorkomt geen lek van al gecommitteerde bestanden.
