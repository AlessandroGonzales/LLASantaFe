# La Libertad Avanza Santa Fe: informe de continuidad

**Corte del informe: 5 de octubre de 2026.** Este documento resume el objetivo, las decisiones del cliente, el trabajo registrado en la conversación y el estado observado del repositorio. Los cambios locales descritos al final no deben confundirse con el último commit ni con una versión publicada.

## 1. Objetivo del proyecto

Construir y publicar la primera etapa digital de La Libertad Avanza Santa Fe: una web institucional en React que presente la identidad del espacio, sus propuestas, noticias, historia, representantes y vías de participación para habitantes de toda la provincia y del país.

El trabajo debe ayudar a que el partido comunique con formalidad y claridad, y sirva de puerta de entrada a afiliaciones, propuestas ciudadanas, sedes y reclamos. Al usuario le importa especialmente que el resultado sea confiable, accesible desde distintos tamaños y generaciones de dispositivos, rápido y fácil de encontrar mediante SEO.

Esta etapa es el sitio público en Vercel. El usuario planea desarrollar más adelante una aplicación con PostgreSQL, un backend general y despliegue en Azure. Esos componentes futuros no forman parte de esta versión. La pequeña función en Vercel y Apps Script que actualmente se prevé para recibir formularios es un puente de almacenamiento, no el backend futuro.

## 2. Guía de colaboración que hay que respetar

- No rediseñar componentes por iniciativa propia. El usuario rechazó cambios estéticos generales y luego estableció explícitamente: mejorar rendimiento, optimización, SEO, accesibilidad, experiencia y ortografía, pero no cambiar la estética, salvo cuando pida diseño en un componente concreto.
- El usuario sí autorizó rediseños puntuales en NoticiasDetalle, SeccionPropuestas, NosotrosHistoria y Sumate. Eso no autoriza a llevar esos tratamientos al resto del sitio.
- Mantener el enfoque minimalista: poco contenido, sin adornos innecesarios. Conservar composición, paleta, imágenes y estilo existentes al hacer trabajo técnico.
- Todo texto e imagen debe seguir siendo legible en móvil, escritorio y teléfonos modestos. No optimizar solo para pantallas grandes.
- Al trabajar en formularios, preservar su funcionamiento; no enviar datos reales en pruebas. Proteger datos personales y nunca exponer secretos en React, logs o Git.
- Trabajar componente por componente, explicar el cambio en español y validar proporcionalmente. No hacer commit, push, publicación ni cambios en servicios externos sin una instrucción para esa acción.
- Si hay cambios locales sin comprometer, son propiedad del usuario o de quien los hizo: inspeccionarlos, conservarlos y no ejecutar reset, checkout destructivo ni borrado para limpiar el árbol.

## 3. Estructura y tecnología

- React 19, Vite y Tailwind CSS 4; enrutamiento con React Router; animaciones con Framer Motion y `LazyMotion`.
- Aplicación de una sola página. `src/App.jsx` contiene las rutas, incluye Navbar/Footer y carga varias páginas con `React.lazy` y `Suspense`.
- Datos de noticias, propuestas, representantes e historia viven en `src/data/`; fotografías y videos en `src/assets/`.
- Despliegue previsto/informado por el usuario: Vercel. El repositorio también tiene funciones `api/forms.js` para la recepción segura de formularios.
- Sitio en español argentino (`lang="es-AR"`). Hay Open Graph, Twitter Cards, JSON-LD del sitio, sitemap y robots.txt, además de metadata dinámica en algunas páginas.
- No se encontró `AGENTS.md` en el repositorio al preparar este informe. El README sigue siendo en gran medida el README genérico de Vite; los documentos operativos útiles son los de `docs/`.

## 4. Páginas y componentes

La portada (`/`) reúne Hero, carrusel de noticias, previews de propuestas, historia, diputados, representantes, presidentes comunales y Propone. Navbar y Footer son globales.

| Ruta | Página o contenido |
| --- | --- |
| `/` | Portada y previews |
| `/propuestas` | Propuestas con filtros por alcance y categoría |
| `/propuesta/:id` | Detalle de propuesta |
| `/noticia/:id` | Detalle editorial, imágenes y opciones para compartir |
| `/sumate` | Afiliación/participación y formulario Sumate |
| `/nosotros` | Historia visual y línea de tiempo |
| `/diputados` | Listado y perfil de diputados |
| `/representantes` | Listado, filtro por ciudad y perfil de concejales |
| `/presidentes-comunales` | Listado y perfiles; actualmente el conjunto de datos versionado muestra un presidente comunal |
| `/propone` | Formulario para propuestas y documentos adjuntos |
| `/sedes` | Sedes/contactos |
| `/reclamos` | Directorio de plataformas; por ahora Rosario enlaza a `llareclamosrosario.com` |

Las tarjetas y páginas de la sección de representantes se han ido ampliando para reflejar nuevos cargos y ciudades. La cantidad y consistencia de los datos en el árbol local actual necesita revisarse como se indica en la sección 10.

## 5. Trabajo realizado según las conversaciones

### SEO, rendimiento, accesibilidad y contenido

- Hubo una etapa amplia de accesibilidad y rendimiento, con trabajo en App, Navbar, Hero, formularios, noticias y previews. También se han corregido textos y detalles tipográficos en varias entregas.
- NoticiasDetalle se organizó como una página editorial, con contenido, imagen y compartir. Hay metadata dinámica, URL canónica, datos estructurados de artículo y manejo de noticias no encontradas.
- Se trabajó el rendimiento de previews de diputados, representantes y Nosotros, incluyendo movimiento reducido, carga diferida y mejoras de accesibilidad.
- Se añadieron páginas y navegación para presidentes comunales y Reclamos.
- Sitemap y robots existen, pero el contenido actual es incompleto/antiguo; la ficha SEO de la sección de pendientes es la fuente a revisar antes de publicar.

### Diseño autorizado expresamente

- **SeccionPropuestas:** recibió un rediseño visual cinematográfico/minimalista con tratamiento de imágenes, filtros por tema y alcance y metadata.
- **NosotrosHistoria:** recibió una reorganización visual narrativa de la línea de tiempo; `src/data/historiaData.js` conserva los datos.
- **Sumate:** se reorganizó para explicar por qué unirse y cómo participar, manteniendo campos y flujo del formulario. Tiene CSS modular.
- **NoticiasDetalle:** recibió tratamiento visual/editorial específico.

Las versiones locales del 5 de octubre vuelven a incluir modificaciones sustanciales en `SeccionPropuestas`, `Sumate` y estilos de historia. Revisarlas antes de atribuirlas, validarlas o publicarlas.

### Formularios y privacidad

- Sumate recopila nombre, DNI, WhatsApp, localidad, intención de fiscalizar y consentimiento.
- Propone recopila datos de contacto, profesión, motivo y mensaje, y admite un documento adjunto. El usuario pidió permitir documentos además de PDF; el código contempla PDF y varios formatos ofimáticos/de texto, con límite de 2 MiB.
- Hay validación compartida en `shared/forms.js`, endpoint `api/forms.js`, lógica de servidor en `server/forms-handler.js`, inspección de adjuntos en `server/attachments.js`, widget Cloudflare Turnstile en `src/lib/turnstile.js` y hook de envío en `src/hooks/useSecureSubmission.js`.
- Las defensas implementadas en código incluyen honeypot, comprobación de origen, Turnstile verificado en servidor (host/acción/token), límites persistentes vía Upstash Redis, límite del cuerpo, normalización/validación de campos, revisión del contenido real del adjunto y firma HMAC entre la función de Vercel y Apps Script. Ante errores de configuración el envío falla cerrado.
- `google-apps-script/Code.gs` prepara las pestañas **Sumate** y **Propuestas**, escribe bajo la cuenta oficial `oficial@llasantafe.com.ar`, restringe archivos, rechaza peticiones sin firma y deduplica reintentos. No requiere Gmail API ni implementa envío de correos.
- Para Propone, además del renglón de Sheets y el documento, el código genera una ficha TXT privada con todos los campos y agrega los datos/enlace a la descripción del archivo en Drive. Se añadió `restoreExistingProposalDetails()` para recuperar fichas de registros históricos ya presentes en Sheets por lotes de hasta 25.
- El usuario reportó una prueba real en la que Sumate generó su fila y Propone guardó solo el PDF. Por lo tanto, no dar por resuelto el problema en producción solo porque el código actual y las pruebas simuladas contemplen los campos. Confirmar que `Propuestas` contiene la fila, que Apps Script tiene desplegada la versión corregida y, si hay filas históricas, seguir `docs/FORMULARIOS_WORKSPACE.md`. Si los datos nunca llegaron a Sheets y solo queda el PDF, no inventarlos: no son reconstruibles con certeza.
- La guía `docs/FORMULARIOS_WORKSPACE.md` contiene el procedimiento de Workspace, despliegue de Apps Script, Turnstile, Redis, variables de Vercel, pruebas de staging, privacidad y recuperación. Señala expresamente que el estado del servicio externo debe confirmarse.

## 6. Hero y videos

El usuario describió un video que empieza en el Monumento a la Bandera, recorre la multitud y termina en la imagen de Javier Milei, Karina Milei y Romina Diez. Pidió rostros fieles, realismo y que el video final dure como máximo 10 segundos. Después pidió una pieza independiente para móviles y transiciones para revelar el contenido. En la solicitud original el contenido aparecía aproximadamente a los 8 segundos en escritorio y a los 4 en móvil; posteriormente el código compartido utilizó un umbral general de 4 segundos. También pidió que cada variante se reproduzca una sola vez por sesión y que móvil no descargue el video de escritorio.

El commit `20025fe` y los activos del repo registran una integración con `hero-intro.mp4` para escritorio y `hero-intro-mobile-vertical.mp4` para móvil, posters `hero-desktop.webp`/`hero-mobile.webp` y una función de reproducción (`src/utils/heroVideoPlayback.js`). Esos archivos pesan aproximadamente 4,95 MB / 13,87 s (escritorio) y 4,46 MB / 14,73 s (vertical): las duraciones **superan el máximo de 10 segundos solicitado**, de modo que hay que confirmar cuál es la pieza final aprobada y qué se encuentra en Vercel. También existen otros renders MP4/WebM que no necesariamente usa el Hero.

La documentación `artifacts/hero-video/LEEME.md` aclara que el render dentro de `artifacts/` fue un montaje de las tres fotografías con encuadres y fundidos; no fue generado con Runway y no es una toma de video realista continua. Esto es distinto de los clips `hero-intro*` conectados por el código versionado. No afirmar que la versión generativa solicitada se produjo con Runway sin comprobar el material concreto.

El trabajo de reproducción única usa `src/utils/heroIntroSession.js` con `sessionStorage` y respaldo en memoria, y resuelve una URL según el ancho inicial. La preferencia original fue no reiniciar al volver al Home ni descargar simultáneamente dos videos.

**Al corte, el Hero local tiene cambios recientes sin comprometer que afectan estas decisiones y parecen incompletos:** se eliminó el import del video de escritorio, pero se llama `selectHeroVideoSource` con solo `{ mobile: heroVideoMobile }`, que devuelve `undefined` en escritorio; el párrafo de propósito está vacío; el umbral local de aparición es 2 segundos, no el valor previamente probado/acordado; se quitaron los controles de pausar/saltar; y hay clases sospechosas como `max-w-5x1`, `md:mt-69` y `md:text-ms`. Los videos vertical y de escritorio deben volverse a elegir y probar contra la petición original antes de publicar. No se validó el build ni la versión del 5 de octubre.

## 7. Rendimiento reciente: diputados y concejales

La última tarea concluida antes de este informe optimizó `SeccionDiputados` y `SeccionRepresentantes` sin cambiar la estructura visual principal:

- paginación de 6 diputados y 8 concejales;
- filtro municipal aplicado a todo el conjunto, con página reiniciada al filtrar;
- solo se montan las tarjetas de la página visible;
- imágenes WebP derivadas por `scripts/optimize-profile-images.mjs`, con `srcset`/`sizes`; la imagen de modal se pide al abrirlo; originales intactos;
- las versiones grandes para tarjeta de los 26 retratos presentes entonces pasaron de 8.576.512 a 1.815.312 bytes (78,8 % menos en conjunto);
- se redujo trabajo de animaciones y capas GPU, se añadió preferencia de movimiento reducido y se mejoró teclado, Escape y foco del perfil;
- en tarjetas de concejales, orden **nombre → ciudad → perfil**. Las tarjetas de diputados no muestran ciudad.

Se verificó esa versión en navegador con la compilación de producción a 320, 390 px y escritorio. El 29 de septiembre pasaron 62 pruebas y la compilación; esa verificación es anterior a los cambios locales del 5 de octubre.

## 8. SEO, dominio y publicación

- El HTML inicial (`index.html`) y las metadata dinámicas usan `https://www.lalibertadavanzasantafe.com`.
- El sitemap actual solo enumera portada, Nosotros y Presidentes Comunales, con `lastmod` agosto de 2026. No lista todas las páginas públicas y hay que revisarlo.
- `robots.txt` apunta al mismo dominio `.com` y tiene reglas que parecen heredadas de ejemplo (`/admin/`, `/login/`, `/privado/`).
- El usuario ha informado que el sitio está en Vercel, se compró dominio y se configuró Google Search Console. No se verificó ahora la consola, Vercel ni DNS.
- El correo de Workspace es `oficial@llasantafe.com.ar`; eso **no demuestra** que el dominio canónico del sitio sea `.com.ar`. Confirmar cuál dominio sirve la web y si existe redirección entre `www`, raíz y `.com.ar`. Luego alinear canonical, Open Graph, JSON-LD, sitemap, robots, orígenes permitidos de la API y hosts de Turnstile. La guía de formularios advierte sobre esta discrepancia.
- Vercel reescribe solicitudes al SPA y define la función de formularios. Aunque exista un rewrite general, `src/App.jsx` no tiene actualmente una ruta `*` con una página 404 propia. El usuario dejó la página 404 para una etapa posterior; continúa pendiente.
- Vite tiene `rollup-plugin-visualizer` configurado con `open: true`, lo que puede abrir una pestaña al ejecutar build. Considerarlo en el flujo de validación, sin cambiar configuración ajena sin necesidad.

## 9. Git y pruebas: punto de partida de esta entrega

- Rama local: `main`; en el momento de la inspección, `HEAD` era `5af605d` (`videos test`, 29-09-2026), igual a `origin/main`.
- Al iniciar el informe, `git status --short` mostraba 50 rutas modificadas o nuevas. Hay cambios grandes en Hero, datos de representantes/noticias/diputados, SeccionPropuestas, Sumate, previews y estilos, además de imágenes nuevas. No se sabe quién introdujo cada cambio ni si todos están terminados. No limpiarlos ni descartarlos.
- El informe mismo agrega `docs/INFORME_CONTINUIDAD_PROYECTO.md`; queda local y sin commit.
- Los cambios de la última sesión de septiembre habían pasado build, lint de los archivos trabajados y 62 pruebas. **La copia de trabajo actual no ha sido revalidada después de los cambios de octubre.** No afirmar que la app actual compile, que los formularios externos estén configurados o que Vercel esté desplegando este contenido.
- Conjunto de pruebas en `tests/`: formularios, Apps Script, videos Hero, sesión del Hero y paginación/imágenes de perfiles. Las pruebas externas son simuladas; no sustituyen la prueba autorizada de staging en Google/Turnstile/Redis.

## 10. Hallazgos del árbol local del 5 de octubre que requieren conciliación

1. `src/data/representantes.jsx` tiene ahora 23 entradas (IDs del 1 al 23, desordenados), pero la prueba y la optimización concluida cubrían 19. Hay un ID repetido (`18`) y falta el `10`; con la clave `id` usada en React esto genera claves duplicadas. Normalizar IDs de forma estable antes de publicar, conservando datos/personas.
2. Se incorporaron fotos de representantes (`francovolpe.webp`, `ana.webp`, `ani.webp`, `pabloesteban.webp`), pero el manifiesto `src/data/profileImages.js` tiene todavía 26 retratos y no incluye esas cuatro fotos nuevas. `ProfileImage` puede volver al original para esas tarjetas y las pruebas de cobertura del manifiesto deben correrse después de regenerarlo. Confirmar también cuál de los otros activos nuevos pertenece a noticias/historia antes de tocarlos.
3. Hay ediciones a datos de diputados y noticias, historia, estilos y distintos componentes que no son parte de los commits. Inspeccionar sus diffs y preservar textos, imágenes y cambios del usuario.
4. El Hero local omite la fuente de escritorio y el copy de propósito. Es el riesgo funcional más visible del árbol actual; validar todos los breakpoints, una sola descarga por viewport, una sola reproducción por sesión, umbral correcto, fallback de póster y que el contenido siempre aparezca.
5. La documentación del sitemap, el dominio y formularios requiere verificación operativa, no solo corrección de código. No cambiar dominio por inferencia.

## 11. Próximos pasos recomendados

1. Antes de editar, revisar con el usuario o con contexto confiable qué cambios del árbol de octubre desea conservar; no resetear ni mezclar automáticamente cambios grandes.
2. Estabilizar Hero: restaurar la fuente desktop si corresponde, resolver fuente responsive sin descargar ambas, recuperar el texto de propósito y fijar el segundo exacto de aparición por variante. Verificar accesibilidad, sesión y dispositivos pequeños.
3. Actualizar generador/manifiesto de imágenes para el conjunto actual y corregir IDs duplicados, manteniendo cada perfil y ciudad. Verificar relación entre datos, perfiles y rutas.
4. Confirmar con el usuario el dominio público canónico y revisar Search Console, Vercel, Apps Script, Turnstile y Redis. Para Propone, confirmar fila y ficha en la hoja/carpeta correctas y desplegar Apps Script actualizado si hiciera falta.
5. Retomar el SEO técnico: sitemap completo, fechas coherentes, robots, metadata prerenderizada o estrategia de renderizado y 404 cuando el usuario abra esa pieza. Verificar con URL inspection luego de publicar.
6. Continuar por componentes, con mejoras técnicas únicamente salvo autorización estética expresa; después probar versión móvil real y escritorio, y realizar build/lint/pruebas sobre el conjunto final antes del commit/deploy.

## 12. Referencias rápidas

- `src/App.jsx`: rutas y composición de portada.
- `src/components/Hero.jsx`, `src/utils/heroVideoPlayback.js`, `src/utils/heroIntroSession.js`: video, temporización y repetición.
- `src/components/NoticiasDetalle.jsx`, `src/data/noticiasData.jsx`: noticias y metadata de artículo.
- `src/components/SeccionPropuestas.jsx`, `src/data/propuestasData.jsx`: sección de propuestas.
- `src/components/NosotrosHistoria.jsx`, `src/data/historiaData.js`: narrativa e imágenes históricas.
- `src/components/Sumate.jsx`, `src/components/SeccionPropone.jsx`, `src/hooks/useSecureSubmission.js`: formularios públicos.
- `api/forms.js`, `server/`, `shared/forms.js`, `google-apps-script/Code.gs`: protección y persistencia provisional.
- `docs/FORMULARIOS_WORKSPACE.md`: configuración externa, pruebas y recuperación de Propone.
- `src/components/SeccionDiputados.jsx`, `src/components/SeccionRepresentantes.jsx`, `src/data/profileImages.js`, `scripts/optimize-profile-images.mjs`: perfiles y derivados.
- `public/sitemap.xml`, `public/robots.txt`, `index.html`: indexación y señales globales.
