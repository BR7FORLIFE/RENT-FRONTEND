---
name: rent-screen-patterns
description: Patrones de maquetación de pantallas RENT (estructura, estados loading/error/vacío, listas, secciones con pestañas, detalle). Úsala al crear o rediseñar una pantalla.
---

# Patrones de pantalla RENT

## Estructura base
```tsx
<SafeAreaView style={{ flex: 1, backgroundColor: Palette.background }}>
  <SplashWaveBackground />          // opcional, decorativo (zIndex -1)
  <RentHeader sectionName="CONTRATOS" />
  {/* título de página / contexto */}
  {/* SegmentedTabs si hay varias secciones */}
  <View style={{ flex: 1 }}>{/* contenido */}</View>
</SafeAreaView>
```
La ruta en `app/` solo importa la pantalla de `features/*/screens/`.

## Estados obligatorios
1. `isLoading` → `<SplashScreen />`
2. `isError` → `<PrincipalError error="mensaje claro y accionable" />` (nunca `return null`)
3. Lista vacía → `<EmptyList title description />` vía `ListEmptyComponent`

## Listas
- `FlatList` con `keyExtractor` por id, `showsVerticalScrollIndicator={false}`.
- `contentContainerStyle`: `{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 32, gap: 12 }`.
- El contenedor de la lista usa `flex: 1`; **nunca** alturas en porcentaje (`"50%"`, `"60%"`) ni `.map()` en `ScrollView` para datos que crecen.
- Encabezado de sección dentro de la lista con `ListHeaderComponent` (título 16/700 + descripción 13 `textMuted`).

## Secciones dentro de una misma pantalla
Usa `SegmentedTabs` bajo el título; el estado de sección es un `useState` con unión de strings. No usar menús flotantes (FAB) ni desplegables para navegar entre secciones. Ejemplo: `features/contract/screens/contract-list-details.tsx`.

## Tarjetas
Fondo `surface`, borde `border`, radio 16, padding 16, gap 12–16. Cabecera: título/cifra a la izquierda, `StatusBadge` a la derecha. Pie con divisor `borderSoft` para fechas o metadatos. Toda tarjeta tappable usa `Pressable` con feedback pressed.

## Acciones
- Una acción primaria por pantalla: `ButtonForm variant="primary"`; las secundarias con la variante por defecto.
- Acción async: pasar `isPending` (muestra spinner y bloquea doble envío).
- Mutaciones: `useMutation` + invalidar `queryKey` relacionadas.

## Checklist rápida
Safe area · loading/error/vacío · tokens de `Palette` · textos largos con `numberOfLines` · pressed/disabled · permisos respetados · sin lógica de negocio en el componente visual.
