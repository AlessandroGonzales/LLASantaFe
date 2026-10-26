# Registro por pasos

Ruta: `/registro`, en `codex/integracion-api`. Fondo claro `#f5f0f7`; cinco etapas de datos/consentimiento y sexta etapa de bienvenida sobre el inicio. El formulario conserva los valores al avanzar y volver, sin guardarlos en localStorage. La foto se elige desde el dispositivo, con vista previa y reducción local. El logo de ingreso pasa a 86 píxeles.

Antes de probar, detener la API, aplicar `LLASantaFeApi/database/012_registro_privacidad.sql` una vez después de 011, y volver a compilar/iniciar Presentation. No aplicar 011 nuevamente si ya existe. El endpoint de registro ahora requiere `aceptaPrivacidad: true` y `privacidadVersion: "2026-10-26"`; la foto opcional usa `fotoPerfilBase64` de hasta 32 KiB preparados. El JSON mantiene el máximo de 64 KiB.

La verificación de email sigue siendo necesaria antes de ingresar. La bienvenida no crea una sesión; la aceptación y foto se guardan atómicamente con la cuenta y el correo pendiente. Un 202 de un email ya utilizado tampoco modifica su perfil.

Componentes: `pages/Registro.jsx`, `components/account/RegistrationProvider.jsx`, `WelcomeCard.jsx`; contrato/validaciones en `lib/registration.js`; aviso versionado en `data/privacyNotice.js`. La foto y la contraseña se mantienen solo en memoria durante el formulario. La bienvenida retiene únicamente nombre y Blob URL de la foto hasta cerrarse.

Responsable, domicilio y correo del aviso fueron proporcionados por el cliente. Las fuentes oficiales y los puntos que deben revisarse antes de producción están documentados en `LLASantaFeApi/docs/registro-por-pasos.md`.

Validado: 166 pruebas Node, 1053 comprobaciones HTTP/SQL de API y 78 de consumo; ESLint y builds correctos. Recorrido completo en navegador a ancho de escritorio y 390 píxeles, más revisión a 320 píxeles. Se usaron cuentas ficticias y otra base; no se enviaron correos reales ni se modificó `main`.
