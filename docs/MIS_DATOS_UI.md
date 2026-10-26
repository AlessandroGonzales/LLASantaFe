# Mis datos

`/mi-cuenta` presenta el perfil con el fondo `#f5f0f7`, en la rama `codex/integracion-api`.

- Computadora: identidad y contacto a la izquierda (foto, nombre, apellido, correo y teléfono); información personal a la derecha (género, nacimiento, profesión y localidad).
- Móvil: las secciones se apilan, con campos y botones adaptados al ancho disponible.
- Se retiraron los accesos duplicados a afiliación, solicitudes y encuestas. Permanecen en el menú del avatar.
- El cierre de sesión se ejecuta desde ese menú. Conserva el cierre de todas las sesiones del backend y comunica si solo se pudo confirmar la salida local.
- La baja de cuenta está separada al pie, con otro tratamiento visual, explicación de consecuencias y casilla de confirmación. No se ejecuta al abrir esa sección.
- La foto conserva selección, vista previa, guardado, descarte, eliminación y errores. Se retiraron los textos explicativos y la línea de formatos/cuota; las validaciones y límites siguen aplicándose.

Nombre, apellido, teléfono y localidad conservan el PATCH actual: se envían únicamente los valores cambiados. Correo, género, profesión y nacimiento se muestran con los permisos de edición existentes. El selector de localidad se carga al pulsar Cambiar/Agregar. Cancelar o conservar la localidad actual no la elimina; quitarla explícitamente envía `ciudadId: null`.

La página se separó en `src/pages/MisDatos.jsx`; `Cuenta.jsx` conserva verificación de email y recuperación de acceso. Se retiraron el perfil anterior y sus estilos sin uso. No requiere cambios de base de datos ni nuevas dependencias.

Validado: 166/166 pruebas Node, ESLint de archivos afectados y build Vite. En navegador y base temporal: subir foto, guardar teléfono y localidad, conservar/quitar localidad, persistencia después de volver a ingresar, cierre desde el avatar, cancelación de baja y baja confirmada de una cuenta ficticia desde viewport móvil de 390 píxeles. Sin correos reales ni cambios a la base de trabajo. La advertencia previa de Framer Motion del build se mantiene.

Prueba manual: ingresar → avatar → Mis datos; cambiar un dato y guardar; cambiar foto y revisar navbar; abrir y cancelar la baja; cerrar sesión desde el avatar. Para una baja real, leer y confirmar sus consecuencias antes de enviar.
