# Sicilia Region Bottle Image Audit

**Reference:** Frappato Santa Teresa (`STresa_Frappato-resized-304x640.png`) — bottle without background, max 308x700.

## Changes Applied

| Wine | Producer | Change | New URL |
|------|----------|--------|---------|
| ETNA BIANCO | BENANTI* | Added `&width=308` to Shopify URL | grancaffelaquila.com/...&width=308 |
| GRILLO | GORGHI TONDI* | Replaced wrong Santa Teresa image with correct Gorghi Tondi Kheirè | gorghitondi.it/.../Kheire-2048x2048.png |
| ETNA ROSATO | GRACI* | Replaced oversized 1024x1536 with wine.com 308x700 | assets.wine.com/.../w_308,h_700,c_fit/... |
| ETNA BIANCO | TORNATORE | Added `&width=308` | grancaffelaquila.com/...&width=308 |
| CERASUOLO DI VITTORIA | LE FONTANE* | Replaced wrong Benanti Etna bottle with Le Fontane Cerasuolo | lefontanewinery.it/.../2_cerasuolo.png |
| PERRICONE | BAGLIO INGARDIA* | Replaced wrong certificazioni.jpg with Perricone bottle | shoplightspeed.com/.../308x394x1/... |
| LIPERI | OSSIDANA* | Replaced wrong Feudi del Pisciotto with correct Liperi Ossidana | grancaffelaquila.com/.../CopyofIMG_4708...&width=308 |
| ETNA ROSSO | TORNATORE | Changed wine.com from w_1920 to w_308,h_700 | wine.com/.../w_308,h_700,c_fit/... |
| ETNA ROSSO | IDDA* | Added bottle (was null) | static.millesima.com/.../J3344_2020NM_c.png |

## Unchanged (already conformant or no resize support)

- **FRAPATTO** SAN TRESA* — Already 304x640 ✓
- **ZIBIBBO LIGHEA** DONNAFUGATA — Producer site, bottle shot
- **CHARDONNAY** PLANETA* — Producer site
- **LA SEGRETA** PLANETA* — CDN
- **NERO D'AVOLA** PISCIOTTO — Total Wine
- **ETNA ROSSO** BENANTI* — Producer site
- **NERO D'AVOLA** TONNINO* — Serendipity Wines

## Notes

- Gorghi Tondi Kheirè (2048x2048) — official producer image; UI scales with `object-fit: contain`.
- Le Fontane Cerasuolo path uses 2025/03; if 404, try 2024/12.
- Perricone shoplightspeed format: `308x394x1` (within 308×700).
