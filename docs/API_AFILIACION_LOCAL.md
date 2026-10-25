# Afiliación desde React y administración mínima

Implementación local del 24 de octubre de 2026, en `codex/integracion-api`.
No hay push, fusión con main ni cambios en Vercel. Esta entrega reemplaza el envío
del formulario `/sumate` por el flujo autenticado de .NET en esta rama. Otros
formularios siguen con su destino actual. No se importan ni borran históricos de
Google Sheets/Drive y no se envía una solicitud a los dos destinos a la vez.
El handler legado devuelve 410 `form_retired` para `kind=sumate` en esta rama,
sin validar CAPTCHA ni escribir en Sheets. Conserva su límite de intentos y los
otros formularios; las fixtures de contrato histórico optan por permitirlo solo
en pruebas. No cambia el handler desplegado desde la rama main actual.

## Preparación obligatoria

1. Detener Presentation y aplicar **una sola vez**, después de 001–009, el script
   `C:\Users\jaman\LLASantaFeApi\database\010_afiliacion_formulario.sql` en la base
   habitual desde pgAdmin/DBeaver. La base habitual no fue modificada por las pruebas.
2. Recompilar/iniciar Presentation en Development. El origen local sigue siendo
   `http://localhost:5275`; `FrontendUrl=http://localhost:5173` se hereda de
   appsettings.json si el archivo privado no lo sobrescribe.
3. Ejecutar React desde LLASantaFe:

   ```powershell
   npm run dev -- --host localhost --port 5173 --strictPort
   ```

   `.env.development.local` conserva `VITE_API_BASE_URL=http://localhost:5275` y
   está excluido de Git. No requiere nuevas dependencias ni scaffolding.

## Prueba como usuario

1. Abrir `http://localhost:5173/sumate#sumate-formulario` sin sesión: se ofrece
   ingresar o registrarse. El formulario público no envía solicitudes anónimas.
2. Ingresar con una cuenta activa/verificada sin solicitud previa. Se vuelve al
   formulario. Nombre/apellido y email provienen de la cuenta y no se pueden
   suplantar en este envío; pueden revisarse desde Mi cuenta.
3. Teléfono y localidad aparecen completos si existen. Para una cuenta sin esos
   datos, ingresarlos y elegir departamento/localidad del catálogo. Completar DNI
   de 7–8 números, sin puntos. Fiscalización es opcional y comienza desmarcada.
4. Confirmar expresamente el inicio del trámite y el contacto. Enviar una vez.
   La pantalla muestra el ID y estado pendiente; volver a entrar muestra esa misma
   solicitud, sin otro POST. No se promete una aprobación ni un correo de alta:
   el aviso automático existente corresponde a la aprobación.
5. Comprobar Mi cuenta: teléfono/localidad se guardaron en el perfil dentro de la
   misma transacción. No se copian nombre/email/contacto a otra tabla ni se cambia
   la contraseña, el rol o el estado de cuenta.
6. Usar **Actualizar estado** cuando se quiera conocer una resolución. No hay polling.
   Una aprobación se muestra como registrada en la aplicación; el equipo indica los
   pasos formales. Un rechazo muestra el motivo público, sin notas internas.

La solicitud es única por cuenta, incluso después de aprobar o rechazar. Para probar
ambas resoluciones, usar dos cuentas diferentes. Dar de baja la cuenta no cancela
una afiliación ni elimina el histórico. La reactivación continúa fuera de alcance.

## Prueba como administrador

1. Ingresar con una cuenta existente cuyo rol real sea **Admin** o **SuperAdmin**.
   Desde Mi cuenta aparece **Administrar afiliaciones**, o abrir
   `http://localhost:5173/administracion/afiliaciones`.
2. Sin sesión se requiere login. Una cuenta Usuario ve acceso restringido y no
   carga listados/contactos. La API vuelve a validar JWT, vigencia y rol en cada
   operación; ocultar el enlace no es la autorización.
3. Probar los filtros Pendientes, En revisión, Aprobadas y Rechazadas. Hay 20 filas
   por página y navegación Anterior/Siguiente por cursor. En revisión conserva el
   estado del backend; esta entrega no añade una edición arbitraria de estados.
4. Seleccionar una solicitud. Solo entonces se cargan DNI declarado, contacto,
   localidad actual, interés en fiscalizar, verificación del email y resolución.
   Los contactos son los del perfil actual. Los registros previos a 010 muestran
   «Sin registro histórico» en los datos que nunca se recopilaron.
5. Aprobar: nota interna opcional (máximo 2000 caracteres), confirmación expresa y
   botón Confirmar aprobación. El backend conserva auditoría y encola un único
   aviso Gmail. No supone que el correo ya llegó ni cambia el rol del afiliado.
6. Rechazar otra solicitud: motivo público de 10–2000 caracteres, confirmación
   expresa y Confirmar rechazo. El usuario puede leer el motivo; la nota interna
   no se reutiliza como motivo. Las resoluciones son definitivas.
7. Verificar listas y contadores actualizados. Los agregados no se repiten por
   fila ni por cada página. Las solicitudes aprobadas siguen contadas aunque se
   dé de baja la cuenta, conforme al contrato anterior.

No hay alta pública de administradores ni cambios de rol desde React. Esta entrega
no crea ni eleva una cuenta real automáticamente.

## Datos, consumo y fallos

- POST envía exclusivamente `confirmacion`, `dni`, `telefono`, `ciudadId` y
  `quiereFiscalizar`. Identidad/rol/autor/fechas/estado no se aceptan del formulario.
  DNI declarado no equivale a identidad validada; la revisión sigue siendo humana.
- 010 añade solamente DNI y fiscalización a la solicitud. Conserva los históricos
  con valores nulos, comprueba el formato y bloquea la sustitución de esos datos.
  No añade DbContext, worker, imágenes, contadores manuales ni un índice redundante.
- Teléfono/localidad se guardan junto al INSERT en una operación atómica. Un
  duplicado/fallo revierte también la actualización del perfil. No hay PATCH
  previo que pueda quedar aplicado a medias.
- La consulta propia se comparte en memoria por sesión. La sesión, sus datos y
  tareas se limpian/cancelan al cerrar, vencer o cambiar de cuenta. Los datos de
  afiliación no se guardan en storage/cookies/URLs ni se exponen en listados públicos.
- Ante timeout/red/409 de creación se consulta el estado propio para recuperar el
  resultado; nunca se reenvía el POST automáticamente. Los campos se conservan si
  hay que resolver un error de lectura. Si ya existe una solicitud se muestra esa.
- Ante una resolución incierta se lee su detalle. Si no se puede confirmar, se
  bloquea otra resolución hasta comprobar el estado. 429 respeta Retry-After con
  un temporizador local, sin consultas automáticas.
- Los listados administrativos usan el índice existente `(estado,id)`, UUID en
  orden ascendente y cursor; no se anuncian como orden cronológico ni instantánea.
  Se cargan contactos solo al abrir el detalle. Las respuestas privadas usan no-store.
- Sin API/origen disponible no se inventan ciudades ni estados y no hay fallback
  silencioso a Google Sheets. El contenido editorial público continúa local.

## Verificación realizada

- El usuario confirmó el funcionamiento en su entorno: puede consultar las
  solicitudes como administrador y aprobarlas o rechazarlas. Esta entrega queda
  como punto de continuación antes de integrar encuestas desde React.
- Build Release .NET: 0 errores y 0 advertencias. Regresión aislada con esquema
  original + 001–010: **926 comprobaciones HTTP/PostgreSQL**, incluidas 80 nuevas
  de formulario, contacto atómico, duplicados, privacidad y los cuatro estados.
- **72 comprobaciones** de consumo, límites, worker y caché sin DB ni correo real.
- **34 pruebas de cuenta/afiliación del cliente** correctas, incluidas 15 nuevas.
  Suite completa React: 107 pruebas, 104 correctas; continúan los mismos tres
  fallos previos de perfiles descritos en INTEGRACION_API_RAMA.md.
- Build Vite y ESLint de los archivos de esta entrega correctos. Permanece la
  advertencia anterior de importación estática/dinámica de Framer Motion.
- Navegador contra .NET/PostgreSQL aislados: login y retorno, datos precargados,
  completado de teléfono/localidad ausentes, fiscalización true/false, alta única,
  bandeja, aprobación, rechazo, contadores y estados propios. La nota interna no
  apareció en la vista del solicitante. Consola del panel sin errores.
- Las pruebas usan cuentas ficticias y Gmail deshabilitado. No modifican la base
  habitual, no envían correos reales ni publican en Vercel. La revisión de secretos
  de ambos repositorios terminó sin hallazgos; API, Vite y PostgreSQL temporales
  quedaron detenidos. La configuración privada permanece excluida de Git.

Encuestas ya tiene su integración en [API_ENCUESTAS_LOCAL.md](API_ENCUESTAS_LOCAL.md). Solicitudes ciudadanas y PDF/Azure
mantienen su lugar en el plan. Resolver los tres fallos previos antes de fusionar.
