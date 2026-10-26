# Inicio de sesión y avatar

La rama `codex/integracion-api` incorpora acceso flotante sobre la página actual, foto desde el dispositivo y navegación personal desde el avatar. El registro mantiene su diseño actual.

**Antes de usar la API actualizada con tu base local**, detener `Presentation`, ejecutar una vez `LLASantaFeApi/database/011_foto_perfil.sql` después de 001–010 y reiniciar la API. El cambio requiere la tabla nueva para leer la versión de la foto en el perfil. La base real se actualiza manualmente; las pruebas automatizadas usan el clúster aislado 55432.

Prueba rápida:

1. Pulsar **Ingresar** desde cualquier sección. Aparece la ventana y se conserva la URL; X, Escape y clic en el fondo la cierran.
2. Una contraseña incorrecta muestra un error dentro de la ventana. Un acceso correcto cierra la ventana y reemplaza Ingresar por el avatar.
3. Abrir el avatar: Mi afiliación, Mis solicitudes, Mis datos y Respuestas de encuestas. Funciona con cursor, clic y teclado; el botón Afiliate tiene menor tamaño.
4. En **Mis datos → Elegir foto**, seleccionar JPEG/PNG/WebP de hasta 2 MiB, revisar el recorte y pulsar Guardar foto. La imagen del navbar se actualiza. Una modificación por minuto; la repetición idéntica no ocupa otra imagen. Quitar foto restaura las iniciales.
5. En **Respuestas de encuestas**, abrir cada participación para consultar lo enviado. Incluye encuestas finalizadas. No se descargan las respuestas por cada tarjeta del listado público.
6. Cerrar sesión: se revoca el Blob URL de la foto. Al entrar con otra cuenta no se reutiliza la imagen ni el historial anterior.

La imagen original se reduce localmente a 256 × 256 antes de enviarse. La API valida y recodifica el archivo; el JWT se envía únicamente en Authorization. Las fotos y los detalles personales no utilizan caché pública. No se guarda la sesión en localStorage ni se agrega sondeo periódico.

Implementación: `components/account/LoginProvider`, `LoginModal`, `AccountMenu`, `ProfilePhotoEditor`, `lib/accountService`, `lib/profilePhoto` y `pages/MisRespuestas`. La ruta `/ingresar` sigue disponible para enlaces directos y rutas protegidas; los botones normales abren la ventana sin navegar. El historial y la imagen se comparten dentro de la sesión mediante cachés acotadas.

La guía completa de límites, endpoints, SQL y recorrido de prueba está en `LLASantaFeApi/docs/inicio-sesion-foto-perfil.md`.

Validación: 160/160 pruebas Node; ESLint de archivos afectados; build de Vite correcto. La advertencia previa de importación estática/dinámica de Framer Motion permanece. API: 1029 comprobaciones HTTP/SQL y 78 de consumo. Probado en navegador con cuentas ficticias: acceso, registro, carga de foto, menú y lectura de respuestas de los cuatro tipos, incluidas encuestas cerradas. No se realizó despliegue ni merge de `main`.
