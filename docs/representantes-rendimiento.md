# Listados de diputados y concejales

## Qué se optimizó

- Diputados: 6 tarjetas por página. Concejales: 8 tarjetas por página.
- El filtro de ciudad busca en todos los concejales y restablece la página 1.
- Solo se montan las tarjetas de la página actual, sin mantener páginas ocultas.
- Se mantienen las cuadrículas, encuadres, colores y efectos de entrada/hover.
- Se eliminan las mediciones de `layout` y las capas GPU permanentes de todas las fotos.
- Se usa `m` con el `LazyMotion` existente y se respeta la preferencia de movimiento reducido en las tarjetas.
- Nombre → ciudad → perfil en concejales; diputados no muestran ciudad en sus tarjetas.
- Los botones de tarjeta funcionan con teclado. Los modales contienen el foco, cierran con Escape y restauran el foco y el scroll.

## Imágenes

Los originales permanecen intactos. Los archivos derivados están en `src/assets/profiles`.
Las tarjetas usan WebP de hasta 960 píxeles de ancho; cuando aporta una reducción relevante, también hay una versión de 480 píxeles seleccionada mediante `srcset` y `sizes`.
La foto de mayor tamaño solo se solicita al abrir el perfil. No se precargan fotos de otras páginas.

Medición de los 26 retratos actuales (suma de archivos, no una descarga inicial):

- Originales: 8.576.512 bytes.
- Versiones mayores para tarjetas: 1.815.312 bytes, una reducción del 78,8 %.

En la prueba local de producción a 390 píxeles, la primera página de concejales solicitó únicamente sus ocho retratos optimizados y el logo. Al abrir Lautaro se solicitó su versión de modal, sin descargar los demás perfiles.

## Al actualizar fotografías

1. Actualizar los datos y la imagen original como hasta ahora.
2. Con FFmpeg y ffprobe disponibles, ejecutar `node scripts/optimize-profile-images.mjs`.
3. Incluir los derivados y `src/data/profileImages.js` en el mismo commit.
4. Ejecutar `node --test tests/*.test.js` y la compilación habitual.

El generador no modifica los originales. Si falta una imagen en el manifiesto, el componente usa la original como respaldo; las pruebas detectan los perfiles que aún no tienen una entrada optimizada.

## Verificación

- Pruebas de límites, última página, filtros, preservación de todos los perfiles, archivos y presupuesto de imágenes en `tests/profile-pagination.test.js`.
- Verificación manual de paginación, filtro desde la última página, perfiles, teclado y ausencia de desbordamiento horizontal a 320, 390 y escritorio.
- Las mediciones locales no equivalen a una prueba en cada modelo de teléfono: conviene comprobar también un dispositivo de gama baja real antes de publicar.
