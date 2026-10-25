# Integración de cuenta con .NET: primer bloque

24 de octubre de 2026. Trabajo local en `codex/integracion-api`, sobre el frontend
actual. Este bloque conecta cuentas; afiliación, encuestas y solicitudes se
incorporan en las siguientes entregas. Los formularios vigentes conservan su
destino actual y el contenido editorial continúa siendo local en React.

## Configuración para probar

1. Iniciar `Presentation` del repositorio LLASantaFeApi en Development. El perfil
   HTTP actual usa `http://localhost:5275`. El perfil HTTPS de Visual Studio
   también publica ese puerto HTTP. En Development la API no redirige a HTTPS,
   por lo que ambos perfiles sirven para React local. En otros entornos se
   conserva la redirección HTTPS.
2. En LLASantaFe, `.env.development.local` contiene el origen público de la API:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:5275
   ```

   Se creó/agregó conservando las demás variables locales y está ignorado por Git.
   Es un origen, sin `/api`, credenciales, parámetros ni fragmentos. Si usás otro
   puerto de API, actualizarlo y reiniciar Vite.
3. La API debe tener `FrontendUrl=http://localhost:5173` en su configuración
   efectiva: se usa para CORS y para los enlaces del correo. Conservar Gmail,
   conexión PostgreSQL y clave JWT únicamente en la configuración privada de .NET.
   No es necesario repetir `FrontendUrl` en `appsettings.Local.json`: cuando no
   está allí, se hereda de `appsettings.json`. El archivo local solo sobrescribe
   las claves que contiene; variables de entorno y argumentos tienen prioridad.
4. Desde la carpeta React:

   ```powershell
   git branch --show-current
   npm run dev -- --host localhost --port 5173 --strictPort
   ```

5. Abrir `http://localhost:5173/ingresar` o usar **Mi cuenta** en el menú.

Usar un email nuevo o una cuenta activa. Un email cuya cuenta fue dada de baja no
se reactiva registrándolo otra vez. No se aplica ningún SQL nuevo por este bloque.

Para comprobar la conexión antes de registrar una cuenta, abrir
`http://localhost:5275/api/Departamento`: debe devolver un array JSON. Luego, en
`/registro`, elegir un departamento y una localidad. El catálogo viene de
PostgreSQL a través de .NET. Si la API estaba detenida al abrir el formulario,
iniciarla y recargar esa página; React y .NET deben ejecutarse a la vez.
Usar `http://localhost:5173`, ya que `127.0.0.1` o un puerto distinto son otros
orígenes y no coinciden con la política CORS configurada.

## Rutas y flujo

| Ruta React | Función |
| --- | --- |
| `/registro` | Datos de registro, contraseña/confirmación, fecha y ubicación opcional por catálogo. |
| `/verificar-email` | Solicitar enlace o confirmar el código del fragmento con email y contraseña del registro. |
| `/ingresar` | Login de cuenta verificada y entrada al perfil. |
| `/recuperar-cuenta` | Solicitud genérica del correo de recuperación. |
| `/restablecer-password` | Nueva contraseña y confirmación; toma el código del enlace. |
| `/mi-cuenta` | Perfil, PATCH de campos permitidos, cierre de todas las sesiones y baja confirmada. |

Prueba manual:

1. Crear una cuenta con un buzón accesible; debe mostrarse el acuse genérico del 202.
2. Abrir el enlace del correo. El código desaparece de la barra de direcciones y
   queda en memoria; completar email/contraseña y confirmar explícitamente.
3. Ingresar: se lee el perfil una vez. Navegar a la portada y volver a Mi cuenta
   conserva la copia en esa sesión. Recargar la página requiere login nuevamente.
4. Cambiar nombre/teléfono u otro campo permitido; guardar y comprobar el perfil.
   PATCH envía únicamente diferencias; un campo opcional vacío se envía como null.
5. Probar cierre de sesión y nuevo login. El cierre confirmado informa que se
   cerraron todas las sesiones. Si falla la confirmación remota, se cierra la copia
   local y el mensaje distingue el estado de los otros dispositivos.
6. Solicitar recuperación y seguir el enlace. Confirmar la nueva contraseña;
   iniciar sesión de nuevo. El frontend también elimina su sesión local anterior.
7. Con una cuenta descartable, confirmar la baja al final: el acceso queda cerrado
   y se explica que esta acción no constituye una desafiliación partidaria.

Mientras siga abierto un código válido, pedir otro conserva el anterior conforme
a las reglas de la API. Si se recarga una página de confirmación después de quitar
su fragmento, volver a abrir el enlace del correo. No se confirma ni cambia una
contraseña automáticamente por visitar el enlace.

## Consumo y seguridad del cliente

- Un cliente `fetch` compartido apunta al origen .NET; no se confunde con el
  endpoint `/api/forms` de Vercel. No incorpora Axios ni otra librería de estado.
- JWT solo en memoria de la pestaña, con vencimiento y limpieza en 401, cierre,
  recuperación y baja confirmada. No se persiste en localStorage/cookies/URLs y no
  se utiliza el rol del cliente como autorización: lo decide .NET.
- No se realizan lecturas privadas al montar la portada. El perfil se carga una
  vez después del login, se comparte y se actualiza después de PATCH. No hay polling.
- Las lecturas anónimas de geografía conservan el caché público del servidor. Las
  peticiones privadas usan no-store. Las peticiones a .NET omiten cookies y no
  siguen redirecciones; solo las operaciones privadas reciben Authorization.
- Hay cancelación y timeout por petición. No se reintentan escrituras
  automáticamente. Errores de datos/red conservan los campos mientras el formulario
  y su sesión sigan vigentes; al vencer/revocar el acceso se limpia la sesión privada.
- `Retry-After` se presenta y bloquea temporalmente un nuevo envío, sin hacer
  consultas periódicas. Los mensajes de validación no muestran posiciones internas
  del JSON. Una respuesta tardía de una sesión anterior no cierra la sesión nueva.
- Los códigos se leen del fragmento antes de montar el router, se quitan de la URL
  y se descartan al salir/completar el flujo. No se incluyen en logs ni persistencia.

## Antes de Preview/producción

Configurar `VITE_API_BASE_URL` con el origen **HTTPS** de la API accesible de pruebas
en el entorno Preview de Vercel para esta rama, y alinear `FrontendUrl` en esa API.
El HTTP de loopback se admite únicamente durante desarrollo. Las variables VITE
son públicas y quedan incorporadas al build: nunca poner ahí secretos.

Una API que solo corre en localhost no sirve al resto de visitantes de Vercel.
La integración pública espera la preparación de Azure y sus recursos de prueba.
Sin origen válido, las pantallas de cuenta informan indisponibilidad y deshabilitan
envíos; la navegación editorial sigue disponible. No se cambia main ni se promueve
un Preview desde esta entrega.

Fuentes: [variables y modos de Vite](https://vite.dev/guide/env-and-mode) y
[suscripción de React al estado compartido](https://react.dev/reference/react/useSyncExternalStore).

## Verificación realizada

- Validación manual del usuario, 24 de octubre: registro, login, edición de datos,
  baja y selección de localidad funcionaron desde React. Se conserva este primer
  bloque como punto de continuación; afiliación, encuestas y solicitudes siguen
  pendientes de integración, sin modificar los formularios vigentes ni producción.
- Corrección del arranque local: se reprodujo el 307 de HTTP a HTTPS con el perfil
  HTTPS de Visual Studio. La API ahora permite HTTP directo en Development. La
  regresión `scripts/verify-local-react-http.ps1` del backend comprueba GET,
  preflight/origen exacto, 401 anónimo y redirección HTTPS en Production, sin DB ni
  correo. Build Release sin errores ni advertencias; 19 pruebas de cuenta correctas.
- Se comprobó React local contra la configuración real de PostgreSQL, solo con
  lecturas de geografía: 19 departamentos, 61 localidades y selección Rosario →
  Rosario en navegador. No se modificaron datos ni se enviaron correos.
- 19 pruebas nuevas en `tests/account-api.test.js`: transporte, permisos, errores,
  cancelación/timeout, no reintentos, unicidad de lectura de perfil, expiración,
  respuestas atrasadas, cierre/baja y códigos del correo.
- 19 comprobaciones del cliente contra .NET/PostgreSQL reales, en una base temporal
  independiente y con Gmail deshabilitado: registro, verificación, login, perfil,
  PATCH, recuperación, revocación, baja y preflight CORS permitido/rechazado.
- Navegador contra ese entorno: registro con fecha válida, ingreso, PATCH y
  persistencia tras nuevo login; navegación pública, recarga sin JWT persistido,
  mensaje correcto de cierre, formulario de recuperación y limpieza del fragmento.
  Se detuvo la API temporal y se comprobó portada disponible y error controlado al
  ingresar, con campos conservados. No se enviaron correos reales.
- Build Vite y ESLint de archivos nuevos/modificados de este bloque comprobados.
- Build de producción abierto en navegador sin origen API configurado: muestra
  indisponibilidad y bloquea el envío de cuenta sin romper la aplicación. Los
  servicios temporales de .NET, Vite, preview y PostgreSQL se detuvieron al terminar.
- Suite completa actual: 90 pruebas, 87 correctas y los tres fallos previos de
  perfiles. Las 19 pruebas nuevas de cuenta pasan; no se añadieron paquetes.
- Los tres fallos previos de perfiles registrados en `INTEGRACION_API_RAMA.md`
  continúan pendientes; no pertenecen a la sesión/API ni se ocultaron o saltaron.
  Deben cerrarse antes de fusionar con main. La advertencia previa de importación
  dinámica/estática de Framer Motion también permanece visible en el build.

La afiliación ya tiene su entrega de integración en [API_AFILIACION_LOCAL.md](API_AFILIACION_LOCAL.md).
Continúan pendientes encuestas, solicitudes de texto y la preparación de PDF/Azure.
