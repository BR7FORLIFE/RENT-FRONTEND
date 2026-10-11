---
name: rent-design-tokens
description: Colores, tipografía, espaciado, radios y tonos de estado del sistema visual de RENT. Úsala al escribir o modificar estilos de cualquier pantalla o componente.
---

# Tokens de diseño de RENT

Fuente de verdad: `themes/themes.ts` (`Palette`, `Radius`, `Spacing`, `Tone`, `ToneStyles`). Importa de ahí en lugar de escribir hex nuevos. Los hex que aún existen en pantallas antiguas son los mismos valores slate/azul; al tocar una pantalla, migra a `Palette`.

## Color
| Uso | Token |
|---|---|
| Fondo de pantalla / tarjeta | `background`, `surface` (#FFFFFF) |
| Fondo atenuado, estado pressed | `surfaceMuted` (#F8FAFC) |
| Borde de tarjeta | `border` (#E2E8F0); divisores internos `borderSoft` (#F1F5F9) |
| Texto principal / secundario / apagado / tenue | `textPrimary` #111827, `textSecondary` #475569, `textMuted` #64748B, `textFaint` #94A3B8 |
| Acento (acciones, selección) | `accent` #2563EB, `accentStrong` #1D4ED8, `accentSoft` #EFF6FF, `accentBorder` #BFDBFE |
| Estados | `success*`, `warning*`, `danger*` (solo para estado real, nunca decorativo) |

Un solo acento (azul). Estados con tono suave (fondo claro + texto oscuro del mismo matiz). Sin degradados, neón ni sombras grandes.

## Tipografía (fuente: arimo, ya cargada en `app/_layout.tsx`)
- Título de página: 22 / 800 / letterSpacing -0.3 (`RentDescription`).
- Título de sección: 16 / 700.
- Cuerpo: 13–14. Texto secundario: 12–13 `textMuted`. Etiquetas: 11 `textFaint`.
- Cifras importantes (renta, montos): 20 / 700.
- Máximo 4 tamaños distintos por pantalla.

## Espaciado y forma
- Margen horizontal de pantalla: **20**. Gap entre tarjetas: 12. Gap interno de tarjeta: 12–16, padding 16.
- Radios: tarjetas 16, botones/inputs 12, chips 7–8, badges/filtros pill (999).
- Sombra solo en botones y overlays (shadowOpacity ≤ 0.12). Las tarjetas se separan con borde, no con sombra.

## Tonos de estado (`ToneStyles`)
`neutral` (inactivo/finalizado), `accent` (en progreso/informativo), `success` (activo/acordado), `warning` (pendiente), `danger` (rechazado/cancelado/error). Úsalos a través de `StatusBadge`.

## Feedback
Pressed: `transform: [{ scale: 0.98–0.99 }]` y fondo `surfaceMuted`. Sin animaciones decorativas.
