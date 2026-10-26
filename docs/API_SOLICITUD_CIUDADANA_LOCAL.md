# Solicitud Ciudadana desde React

Entrega local cerrada el 25 de octubre de 2026 en `codex/integracion-api`.
La ruta existente `/propone` usa el backend .NET para texto y seguimiento propio.
El contenido público permanece en React/Vercel. No se hizo push, fusión ni despliegue.

## Preparación

1. Usar la API con las migraciones 001–010 ya aplicadas. **Esta entrega no agrega
   SQL, DbContext, NuGet ni dependencias de npm**. No reejecutar migraciones antiguas.
2. Ejecutar Presentation en Development con el perfil `http` o `https` de proyecto.
   Ambos ofrecen `http://localhost:5275`; el perfil IIS Express tiene otros puertos.
3. Mantener `VITE_API_BASE_URL=http://localhost:5275` en `.env.development.local`
   y `FrontendUrl=http://localhost:5173` en la configuración efectiva de la API.
   No es necesario duplicar FrontendUrl en el archivo local si se hereda del general.
4. Desde el frontend ejecutar `npm run dev -- --host localhost --port 5173 --strictPort`.
   Abrir `http://localhost:5173/propone`. Las credenciales/configuraciones privadas
   siguen fuera de Git.

## Prueba del usuario

1. Sin sesión, abrir Propone. Se muestran enlaces para ingresar o registrarse,
   sin permitir envíos anónimos. Al ingresar se vuelve a `/propone`.
2. Con una cuenta activa y verificada, comprobar nombre y correo del perfil.
   Teléfono y localidad aparecen cuando existen; no se vuelven a pedir. No se
   exige completar teléfono/profesión/localidad si faltan: el contrato de esta
   solicitud solo necesita motivo y mensaje. La cuenta tiene su enlace de edición.
3. Elegir uno de los cinco motivos:

   | Valor enviado | Opción |
   | --- | --- |
   | `proyecto` | Tengo un Proyecto / Propuesta formal |
   | `sugerencia` | Sugerencia para la provincia |
   | `duda` | Duda o Consulta general |
   | `voluntariado` | Quiero sumarme como voluntario/fiscal |
   | `denuncia` | Denuncia / Irregularidad |

4. Escribir entre 10 y 5000 caracteres. El contador usa el mismo criterio UTF-16
   de .NET para el límite de entrada. Espacios exteriores se recortan; saltos de
   línea, tildes y Unicode se conservan. NUL y Unicode incompleto se rechazan.
5. Enviar una sola vez. Se muestra «Tu solicitud fue recibida», su UUID y el
   listado actualizado. El encabezado de confirmación recibe el foco. El usuario
   y su contacto se obtienen de su cuenta; no se envían copias en el POST.
6. Abrir la fila en «Mis solicitudes». Solo entonces se consulta el mensaje
   completo, estado, respuesta y fecha de actualización. No se interpreta HTML.
7. Probar filtros Todos/Pendiente/En revisión/Resuelta/Rechazada. Las páginas usan
   cursor UUID, hasta 20 registros; Anterior/Siguiente no descargan todo el historial.
   El orden es UUID ascendente, como en el backend, no fecha descendente.
8. «Actualizar estado» consulta solo ese expediente y actualiza también la etiqueta
   de la fila. «Actualizar listado» vuelve a consultar la página seleccionada.
   No se realizan consultas periódicas.
9. Para otro envío, usar «Escribir otra solicitud» después de confirmar el anterior.
   Probar el cuarto intento con una cuenta de prueba que haya enviado tres en
   menos de 24 horas: el backend devuelve 429 y se conserva el mensaje. No hacer
   esta prueba con una cuenta que necesite enviar solicitudes reales ese día.
10. Cerrar sesión y usar otra cuenta: no aparecen el mensaje, el comprobante ni la
    caché de la cuenta anterior. Recargar también elimina la sesión en memoria.

## Reintentos y consumo

POST `/api/SolicitudCiudadana` envía exclusivamente:

```json
{
  "motivo": "sugerencia",
  "mensaje": "Mensaje ficticio con el detalle necesario para la solicitud."
}
```

- `Idempotency-Key` se genera con `crypto.randomUUID()` por operación. El doble
  clic se bloquea sin crear dos operaciones.
- Una respuesta 201 o 200 con el acuse válido confirma el envío. No se declara
  éxito por haber iniciado el POST. Se invalida el listado local tras confirmar.
- Ante red, timeout, 409 o 5xx se conserva clave y cuerpo en memoria y se bloquea
  crear otra operación. «Comprobar envío» repite **manualmente** el mismo POST:
  si el servidor ya lo guardó, devuelve el mismo acuse sin otra fila/cuota.
- Un 429 conserva la operación para reintentar más tarde. Se respeta Retry-After
  cuando el servidor lo entrega. No hay reenvíos automáticos ni bucles de consulta.
- Un 400/413/422 explícito permite corregir el formulario. Cerrar/cambiar sesión
  borra la operación privada y cancela las lecturas pendientes.
- La operación pendiente sobrevive al cambio de sección dentro de la misma pestaña
  mientras siga la sesión. **No sobrevive a recargar/cerrar la pestaña ni a cerrar
  sesión**: no se guardan mensajes, claves ni JWT en localStorage/sessionStorage.
  Después de volver a ingresar, revisar el historial antes de crear otro envío.
- Lecturas privadas: máximo 16 entradas en memoria por sesión, TTL de 30 segundos,
  deduplicación de lecturas simultáneas y cancelación cuando no queda consumidor.
  No hay llamadas por campo, detalle por cada fila, descarga de PDF o recarga del
  perfil después de crear una solicitud.
- El backend mantiene sus cuotas atómicas de 3 solicitudes por cuenta/24 horas,
  1000 globales/24 horas y límites HTTP. Los controles del navegador son de uso;
  autorización, idempotencia y cuotas se vuelven a comprobar en PostgreSQL.

## Gestión administrativa existente

Esta entrega no añade otro panel. En Swagger Development, con JWT Admin/SuperAdmin:

1. `GET /api/SolicitudCiudadana/administracion?limite=20` y luego GET del UUID elegido.
2. `PATCH /api/SolicitudCiudadana/{id}/gestion`, usando la revisión actual:

   ```json
   {
     "revision": 1,
     "estado": "en_revision",
     "respuesta": "El equipo está revisando esta solicitud de prueba."
   }
   ```

3. Consultar de nuevo antes de finalizar como `resuelta` o `rechazada`; la revisión
   aumenta. La respuesta final requiere 10–5000 caracteres. Una revisión vieja da
   409; las solicitudes finalizadas no se reabren.
4. Desde React del propietario usar «Actualizar estado». Se muestra la respuesta
   registrada. Otro usuario común no puede consultar ese expediente (404) ni gestionarlo.

No se envía un email nuevo por esta gestión: la respuesta se consulta en el expediente.

## Formularios anteriores y documentos

En esta rama, `/api/forms` devuelve 410 `form_retired` para Sumate y Propone antes
de llamar a Redis, Turnstile, Sheets o Drive, incluso sin sus claves antiguas.
No se migra ni borra contenido histórico y no se envía el mismo formulario a dos
destinos. `main` y su versión pública no se modifican.

Se retira el selector de archivos y su codificación Base64 del formulario React.
**No se habilita subir PDF** en esta entrega. El backend previo conserva su
validación/antivirus; no se omite ningún control. Blob privado y Defender for
Storage, estados de análisis y descarga autorizada siguen pendientes para Azure.

## Verificación

- Pruebas Node del servicio: contrato, tipos/límites, idempotencia, doble clic,
  errores, cancelación, caché acotada y separación entre cuentas: 22 pruebas.
  El conjunto de cuenta/afiliación/encuesta/solicitud/formularios aprueba 100.
- Regresión HTTP/PostgreSQL aislada: 975 comprobaciones correctas; incluye todas
  las entidades y los casos previos de idempotencia, cuotas, permisos y documentos.
- Navegador contra .NET/PostgreSQL aislados: envío y una fila real, Unicode,
  tres solicitudes permitidas/cuarto rechazado con texto conservado, lectura propia
  y transición administrativa en revisión → resuelta reflejada en React. Otra
  cuenta sin teléfono/localidad pudo enviar sin que se le pidieran esos campos.
- No se modificaron datos de la base habitual ni se enviaron correos reales.
- Build Release .NET sin errores/advertencias, build Vite y ESLint de archivos
  modificados correctos. La suite general mantiene los tres fallos previos de
  perfiles/imágenes, registrados en INTEGRACION_API_RAMA.md; deben cerrarse antes
  de fusionar (153 pruebas: 150 correctas y esos tres fallos). Permanece la
  advertencia previa de importación de Framer Motion.

Sigue la revisión general de la integración; la preparación de producción y PDF
requiere su entrega de Azure. No se declara lista para desplegar por compilar.
