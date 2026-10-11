---
name: rent-ui-components
description: Catálogo de componentes UI reutilizables de RENT (botones, badges, avatar, pestañas, filas de info, estados vacío/error/carga). Úsala antes de crear cualquier componente visual nuevo.
---

# Catálogo de componentes de RENT

Regla: reutiliza o extiende antes de crear. No crear `NewButton`, `CustomHeader`, `AnotherEmptyList`.

| Necesidad | Componente | Ruta |
|---|---|---|
| Botón de formulario | `ButtonForm` (`variant="primary"` para la acción principal; `isPending` para loading) | `components/buttons/button.tsx` |
| Filtro / chip seleccionable | `FilterButton` | `components/buttons/button.tsx` |
| Pestañas para cambiar de sección en una pantalla | `SegmentedTabs` (genérico, tipado por `value`) | `components/ui/segmented-tabs.tsx` |
| Estado con punto de color | `StatusBadge` (`tone`: neutral/accent/success/warning/danger) | `components/ui/status-badge.tsx` |
| Avatar con iniciales | `Avatar` (`name`, `size`) | `components/ui/avatar.tsx` |
| Etiqueta/valor en línea o en bloque | `InfoRow`, `InfoBlock` | `components/ui/info-row.tsx` |
| Encabezado de sección (marca + nombre) | `RentHeader` | `components/header.tsx` |
| Título + descripción de página | `RentDescription` | `components/info.tsx` |
| Lista vacía | `EmptyList` | `components/info.tsx` |
| Error principal | `PrincipalError` | `components/error.tsx` |
| Carga a pantalla completa | `SplashScreen`, fondo `SplashWaveBackground` | `components/splash-screen.tsx` |
| Búsqueda | `SearchInput` | `components/inputs/input.tsx` |
| Tarjeta de miembro | `PropertyMemberCard`, `MemberCard` | `features/property-registration/components/property-members/property-member-card.tsx` |
| Tarjetas de contrato / borrador | `ContractPreviewCard`, `ContractDraftCard` | `features/contract/components/contract-preview-card.tsx` |

## Formateo (solo presentación)
- Contratos: `features/contract/services/format.ts` → `formatMoney`, `formatDate`, `CONTRACT_STATUS` (etiqueta + tono por estado).
- Miembros/roles: `features/property-registration/services/format.ts` → `formatEnumLabel` (`AGENTE_INMOBILIARIO` → "Agente inmobiliario"), `memberStatusInfo`.
- Los valores enum del backend NO se modifican; solo se formatean al mostrarlos.

## Iconos
Solo SVG de `assets/icons/` (se importan como componentes: `import X from "…/x.svg"`). No añadir librerías de iconos.

## Si falta algo
Añádelo en `components/ui/` (genérico) o en `features/<feature>/components/` (de dominio), con `StyleSheet.create` y tokens de `themes/themes.ts`.
