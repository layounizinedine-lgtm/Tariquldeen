# Fortschritt Inhalte (zum Weitermachen)

Werkzeuge:
- `python3 scripts/quellen.py find 10906 "<Name>"` → Biografie im Siyar (turath.io, Buch 10906) finden
- `python3 scripts/quellen.py read 10906 <page_id> <n> <maxzeichen>` → lesen
- `python3 scripts/quellen.py save <id> 10906 <page_id> <n>` → Seiten wörtlich nach `content/quellen/<id>.json`
- Biografie schreiben: `content/bios_*.py` (Helper `content/bio.py`), dann `npm run build:katalog && npm run check:data`
- Regeln: nur Berichte, die adh-Dhahabi als gesichert/sahih/hasan nennt oder als Tatsache berichtet; kein "qila", keine Isra'iliyyat; jeder Satz mit Seite; Zitate wörtlich (Builder prüft das).

## Status
| id | Quelle (page_id) | Stand |
|---|---|---|
| abu-bakr | Siyar 10906: 1155–1164 | ✅ B1 + 4 Zitate |

## Offen (Reihenfolge)
umar, uthman, ali (Band „Rashidun“), talha 1449, zubayr 1467, abdurrahman-ibn-awf 1494, sad 1518, abu-ubayda 1431, said-ibn-zayd 1550,
bilal 1773, musab 1571, khadija 2089, aisha 2115, hamza 1597, khalid 1792, salman 1931, jafar 1632, fatima 2098, abu-hurayra 2558,
ibn-abbas (?), muadh 1869, abu-dharr 2026, said-ibn-musayyib 3370, uways 3172, hasan-basri 3716, umar-ibn-abdulaziz 3886, ibn-sirin (?),
ata 3850, urwa 3574, zaynulabidin 3539, tawus (?), sufyan-thawri (?), sufyan-uyayna 5580, ahmad 7116, ahmad-mihna, salih-ibn-ahmad 8018,
abdullah-ibn-ahmad 8635, abu-dawud 8322, athram 8112, marrudhi 8292, harb-kirmani (?), ishaq-ibn-hani (?),
NEU: shafii 6254, malik (?), abu-hanifa 4640 (neuer Bereich „Imame“)
Danach: Prüfdurchgang Harakat/Inhalte der ganzen App.
