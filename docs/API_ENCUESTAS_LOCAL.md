# Encuestas públicas y respuesta desde la cuenta

Integración local del 24 de octubre de 2026 en `codex/integracion-api`. Lectura
pública en `/encuestas` y `/encuestas/:id`; envío privado con la sesión común.
El trabajo se conserva en esta rama, sin push, fusión con main ni despliegue.

## Preparación y publicación

1. La API debe tener 001–010, como en la entrega de afiliaciones. **No hay SQL nuevo**
   ni scaffolding para encuestas. Detener/recompilar/iniciar Presentation para
   cargar los endpoints públicos nuevos.
2. Conservar `.env.development.local` con `VITE_API_BASE_URL=http://localhost:5275`
   y `FrontendUrl=http://localhost:5173` en la configuración efectiva de la API.
   La configuración privada permanece fuera de Git.
3. Desde LLASantaFe, ejecutar:

   ```powershell
   npm run dev -- --host localhost --port 5173 --strictPort
   ```

4. En Swagger, ingresar con Admin/SuperAdmin. Crear un borrador en `POST /api/Encuesta`
   usando `LLASantaFeApi/docs/ejemplos/encuesta-v1.json`. Completar `descripcion` con
   el motivo real de la consulta: ese texto aparece antes de las preguntas.
5. Guardar el ID y publicar con `POST /api/Encuesta/{id}/publicar` y
   `{"revision":1}`. Usar la revisión actual si antes se editó el borrador.
   No enviar `activa` ni intentar editar preguntas después de publicar.

La creación, edición de borradores, publicación, cierre y lectura de resultados
mantienen sus endpoints administrativos existentes. Esta entrega incorpora la
lectura y la respuesta del público, sin añadir otro editor de encuestas.

## Prueba desde React

1. Sin sesión, abrir `http://localhost:5173/encuestas` desde el nuevo enlace del
   navbar, disponible también en el menú móvil. Solo se listan encuestas publicadas,
   activas, no dadas de baja y dentro de sus fechas de recepción.
2. Abrir una encuesta: aparecen título, motivo, cantidad de preguntas, fecha de
   cierre si existe y todas sus preguntas/opciones. No hay controles para responder
   ni POST anónimo. Se ofrece ingresar o crear una cuenta.
3. Usar **Ingresar y responder** con una cuenta activa/verificada. Se vuelve a la
   misma encuesta. Antes de habilitar el formulario, se comprueba si esa cuenta ya
   respondió. El rol Usuario no puede crear/publicar/cerrar ni leer resultados ajenos.
4. Dejar una obligatoria vacía, confirmar y enviar: se indican las preguntas a
   completar, conservando lo escrito y sin enviar un POST inválido.
5. Completar el ejemplo con `facilidad=3.5`, sección Noticias, dos dispositivos y
   un comentario. Confirmar expresamente y enviar. El comprobante muestra ID y
   fecha de la respuesta; la interfaz enfoca la confirmación y deja de ofrecer
   controles para enviar otra respuesta.
6. Volver al listado y a la misma encuesta: muestra el comprobante. El indicador
   de respuestas conocidas se conserva en memoria durante esa sesión, sin consultar
   una respuesta privada por cada tarjeta.
7. Con otra cuenta, probar solo las dos obligatorias: las opcionales vacías se
   omiten del JSON. Para probar cero, definir `min:0` en el borrador antes de
   publicar; el ejemplo original usa `min:1`. Cero no se interpreta como vacío.
8. Cerrar desde Swagger con la revisión actual. La encuesta deja de estar disponible
   para nuevas respuestas; una cuenta que respondió conserva acceso a su comprobante
   por la URL conocida. Si no hay sesión, esa URL ofrece ingresar para consultarlo.
   La caché pública puede conservar metadatos hasta 30 segundos; el INSERT siempre
   vuelve a comprobar el estado real en PostgreSQL.

Recargar la página descarta el JWT en memoria y requiere login de nuevo para
responder/leer el comprobante. El contenido de las preguntas sigue siendo público
mientras la encuesta esté disponible. La unicidad es por cuenta y encuesta, no una
verificación de identidad física ni una garantía de anonimato.

## Contrato de preguntas y datos

| Tipo v1 | Control | Dato guardado |
| --- | --- | --- |
| `opcion_unica` | Radios | Un ID de opción, con su mayúscula/minúscula original. |
| `opcion_multiple` | Checkboxes | Array de IDs distintos. |
| `numero` | Campo numérico, `step=any` | Número JSON dentro de min/max cuando existan. |
| `texto` | Textarea | Texto Unicode dentro de maxLongitud, por defecto 2000. |

El esquema decide el control y sus restricciones. `tipo` de la encuesta es una
etiqueta del documento; no define el tipo estadístico de cada pregunta. V1 no tiene
unidad, moneda ni regla de «solo enteros»: la interfaz no inventa esas condiciones.
Si la unidad o el significado de una escala importa, explicarlo en el enunciado.

- Se conserva el orden de las preguntas/opciones y sus IDs. No se envían etiquetas
  en lugar de IDs ni `usuarioId`, rol, IP o fechas desde React.
- Opcionales sin completar se omiten; no se convierten en cero, null o arrays vacíos.
  Se exige al menos una respuesta válida aunque todas las preguntas sean opcionales.
- El cliente compara el decimal introducido con el número que serializará JavaScript
  y rechaza valores que cambiarían silenciosamente al enviarse o no caben en decimal
  de .NET. La API vuelve a validar tipos, opciones, límites y tamaño serializado.
- No se redondean resultados ni se calculan estadísticas en esta entrega. Los cuatro
  tipos llegan al jsonb de respuestas con su representación correspondiente.
- Configuraciones incompatibles, propiedades desconocidas, preguntas/opciones
  duplicadas, NUL o Unicode incompleto impiden responder. Los IDs especiales no
  modifican prototipos ni se utilizan como HTML/IDs DOM sin tratar.
- No se interpreta HTML en títulos, motivos, preguntas, opciones o respuestas.

## Consumo, privacidad y fallos

- `GET /api/Encuesta/publicas?limite=12&cursor=...` y
  `GET /api/Encuesta/publicas/{id}` son anónimos. Solo entregan metadatos/preguntas
  públicas; no exponen autor, revisión administrativa, respondida, respuestas,
  contactos o conteos de participación. Configuraciones heredadas no compatibles
  no se publican como JSON arbitrario.
- Lista: 12 por página, máximo 20; resúmenes de descripción de hasta 240 caracteres
  en PostgreSQL, sin cargar configuraciones o relaciones de respuestas. El detalle
  entrega el motivo completo y las preguntas solo cuando se abre.
- Caché de salida de 30 segundos dentro del presupuesto existente de 4 MiB y límite
  de cuerpo. Se separa por Origin, cursor/límite normalizados, fecha argentina y
  revisión de caché. Publicar/cerrar invalida su familia; no se añaden workers.
- Authorization/cookies excluyen una petición de la caché pública. React omite el
  JWT en las lecturas públicas incluso con sesión y solo conserva los campos del
  contrato público en la caché compartida.
- Cliente: caché de hasta 32 entradas, TTL de 30 segundos para datos públicos;
  lecturas concurrentes compartidas y cancelación al quedar sin consumidores.
  Comprobantes privados en memoria por sesión, borrados al cerrar/cambiar de cuenta.
- Solo al abrir una encuesta con sesión se consulta su comprobante. No hay consultas
  por campo, por tarjeta, por render ni polling. El envío no vuelve a cargar el perfil.
- Timeout/red/409/5xx: conservar respuestas y consultar una vez el comprobante.
  Un 200 confirma el registro; 404 no demuestra que un envío anterior haya terminado.
  La pantalla pide comprobar y solo permite un reenvío manual explícito. No se
  reintenta el POST automáticamente. 429 respeta Retry-After con un temporizador.
- La API y la restricción única de PostgreSQL son la autorización y unicidad reales;
  la interfaz no reemplaza esos controles. Se mantienen límites de cuerpo, frecuencia,
  concurrencia, cancelación y no-store para comprobantes/envíos.
- La portada y el contenido editorial siguen locales en React/Vercel. Las consultas
  a este módulo ocurren al entrar en Encuestas. Los rewrites actuales de Vercel ya
  cubren `/encuestas/:id`; Preview requiere la API HTTPS y su CORS correspondientes.

## Verificación

Build Release .NET sin errores/advertencias; **975 comprobaciones HTTP/PostgreSQL**
temporales y **78 de consumo/caché**, incluidos publicación/fechas/cierre, privacidad,
caché y comprobantes. Se conserva la
regresión de cuenta, afiliación, solicitudes, noticias y notificaciones. El archivo
del backend `scripts/verify-encuesta-publica-cases.ps1` cubre la lectura anónima.

23 pruebas nuevas de contrato/cliente y 57 de cuenta/afiliación/encuesta correctas.
La suite React completa ejecutó 130 pruebas: 127 correctas y los mismos tres fallos previos de perfiles,
documentados en INTEGRACION_API_RAMA.md; deben cerrarse antes de fusionar.

Navegador contra .NET/PostgreSQL aislados: lectura sin sesión sin controles de
envío, login y retorno, obligatorias, cero, 3.5, categorías, selección múltiple,
Unicode, opcionales omitidas, comprobante/enfoque de confirmación, indicador en
listado, recarga sin JWT persistido y comprobante privado después del cierre.
Se comprobó en DB el tipo number, arrays, IDs, Unicode y una sola fila por envío.

Build Vite y ESLint de los archivos modificados correctos. Permanece la advertencia
anterior de importación estática/dinámica de Framer Motion.
Sin correos reales, cambios en la base habitual o despliegues. La revisión final
de secretos de ambos repositorios terminó sin hallazgos. API, Vite y PostgreSQL
temporales quedaron detenidos; las instancias habituales no se alteraron.
Solicitud Ciudadana ya tiene su integración de texto y seguimiento en
[API_SOLICITUD_CIUDADANA_LOCAL.md](API_SOLICITUD_CIUDADANA_LOCAL.md). PDF/Azure sigue pendiente.

## Revisión de cierre: 25 de octubre

Se volvió a comprobar el recorrido público → login con retorno → respuesta →
comprobante contra .NET/PostgreSQL aislados, con dos cuentas distintas. Cero y
3.5 se guardaron como números JSON, las categorías como IDs y la selección múltiple
como array; las opcionales vacías se omitieron. Cada cuenta dejó una sola fila.

Se ajustó la presentación de la validación: al editar una pregunta se retira su
aviso anterior; los errores de otras preguntas permanecen. El envío vuelve a validar
todas las respuestas. Corregir un campo no oculta errores de red ni modifica datos.

La integración de cuenta, afiliación, encuestas, solicitudes y formularios históricos
aprueba 100 pruebas Node. La suite completa ejecuta 153: 150 correctas y los mismos
tres fallos previos de perfiles/imágenes, pendientes antes de fusionar. Build Vite,
ESLint de los cambios y revisión de secretos correctos. La regresión existente de
backend aprobó 975 comprobaciones. No hay migraciones ni dependencias nuevas.
