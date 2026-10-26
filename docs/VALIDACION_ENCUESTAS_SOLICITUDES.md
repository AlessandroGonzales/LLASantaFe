# Validación de Encuestas y Solicitud Ciudadana

25 de octubre de 2026. Ambos módulos pasan las pruebas de su alcance actual y
están preparados para la prueba manual del usuario. No se afirma una garantía
absoluta de ausencia de errores ni se incluye aquí el despliegue o PDF en Azure.

## Entorno y resultados

Frontend vigente en `codex/integracion-api`, API Release .NET 10 y PostgreSQL 16
aislado en el puerto 55432. Se crearon bases y cuentas ficticias, con Gmail
deshabilitado. La base habitual y el sitio público de Vercel no se modificaron.

| Comprobación | Resultado |
| --- | --- |
| Compilación Release .NET | 0 errores, 0 advertencias |
| Integración Node: cuenta, afiliación, encuestas, solicitudes y formularios | 100 pruebas correctas |
| Regresión HTTP/PostgreSQL de la API | 975 comprobaciones correctas |
| Consumo, límites, worker y caché | 78 comprobaciones correctas |
| Servicios del cliente conectados a API y PostgreSQL reales de prueba | 51 comprobaciones adicionales correctas |
| ESLint de los archivos modificados | Correcto |
| Build de producción Vite | Correcto; conserva la advertencia previa de Framer Motion |
| Suite Node completa | 153 pruebas: 150 correctas y 3 fallos previos de perfiles/imágenes |

La prueba de Vite excluyó únicamente el reporte auxiliar del visualizador para
evitar abrir una pestaña; compiló la aplicación con sus plugins habituales.

## Qué se comprobó

**Encuestas:** listado y preguntas sin sesión ni JWT público; login con retorno a
la encuesta; preguntas obligatorias, rangos y corrección de avisos; cero, decimal,
categorías, array de selección múltiple y Unicode; opcionales vacías omitidas.
Se verificaron los tipos persistidos en jsonb y una fila por cuenta/encuesta.
Una segunda respuesta se rechaza; solo el administrador publica, cierra o consulta
resultados. El comprobante propio permanece disponible después del cierre.

Se simuló un corte **después de que PostgreSQL guardara la respuesta**: el cliente
recuperó el comprobante mediante GET, sin repetir el POST ni guardar otra fila.
En el navegador, un número fuera del rango se rechazó conservando las otras
respuestas; al corregirlo se retiró su aviso y el envío confirmó el comprobante.

**Solicitud Ciudadana:** solo motivo y mensaje, identidad derivada del JWT y datos
del perfil mostrados sin volver a pedirlos. También pudo enviar una cuenta sin
teléfono/localidad, porque el contrato de texto no los exige. Cinco motivos,
límites de texto, conservación de tildes/saltos/Unicode y HTML mostrado literalmente.

Se simuló un corte **después de guardar el expediente**: el reintento manual con
la misma clave recuperó el mismo ID. No creó otra fila ni gastó otro cupo: todavía
se pudieron crear tres solicitudes nuevas en total y la cuarta devolvió 429.
Se conservaron el texto y la clave del intento rechazado por cuota.

También se verificaron listado privado, filtros, cursor, detalle bajo demanda,
rechazo de acceso ajeno (404), gestión sin rol (403), revisión administrativa
obsoleta (409), resolución y respuesta al propietario. El navegador reflejó
pendiente → en revisión → rechazada; el servicio conectado verificó también resuelta.
Las lecturas de expediente actualizaron la etiqueta de la fila y el detalle.

En ambos módulos se comprobaron cancelación y separación entre cuentas, caché
acotada y ausencia de reenvíos automáticos. Cerrar sesión elimina sus datos privados
en memoria. Los servicios temporales se detuvieron al finalizar.

La revisión visual detectó enlaces solapados en la barra a un ancho intermedio.
Se ajustó el umbral del menú compacto a 1536 px, conservando el mismo menú y sus
acciones. Se comprobaron sus accesos a Proponé y Encuestas, el cierre al navegar
y la presentación sin solapamientos en el ancho disponible de la prueba.

## Prueba manual en tu entorno

1. Iniciar `Presentation` en Development con el perfil de proyecto `http` o `https`.
   Usar `http://localhost:5275` para el cliente React. Conservar FrontendUrl efectivo
   en `http://localhost:5173` y VITE_API_BASE_URL en el archivo local ignorado.
2. Desde el frontend ejecutar:

   ```powershell
   npm run dev -- --host localhost --port 5173 --strictPort
   ```

3. Sin iniciar sesión, abrir `/encuestas` y una encuesta publicada. Deben verse
   el motivo y las preguntas; para responder debe ofrecer ingresar. `/propone`
   debe ofrecer ingresar o registrarse, sin permitir un envío anónimo.
4. Ingresar con una cuenta activa/verificada. En `/propone`, revisar los datos de
   cuenta y enviar motivo + mensaje. Abrir su fila en Mis solicitudes; comprobar
   el mensaje, UUID, fecha y estado pendiente. No probar la cuarta solicitud con
   una cuenta que necesite enviar solicitudes reales durante esas 24 horas.
5. En Swagger, con administrador, consultar y gestionar ese UUID usando la revisión
   actual. En React pulsar Actualizar estado: deben aparecer el nuevo estado y la
   respuesta. No se incorpora otro panel de gestión en esta entrega.
6. Para encuestas, crear/publicar desde Swagger el ejemplo de la guía. Responder
   desde React con 3.5, una categoría, varias opciones y texto. Debe aparecer el
   comprobante; volver a abrirla debe mostrarlo sin permitir un segundo envío.
7. Cambiar de cuenta y comprobar que no se comparta el comprobante ni el historial
   de solicitudes. Una encuesta cerrada no acepta nuevas respuestas; su caché pública
   puede conservar metadatos hasta 30 segundos. El servidor valida el estado real.
8. Si todo coincide, informar el resultado para realizar el commit acordado.

Guías completas: [Encuestas](API_ENCUESTAS_LOCAL.md) y
[Solicitud Ciudadana](API_SOLICITUD_CIUDADANA_LOCAL.md).

## Pendientes delimitados

- El PDF de Solicitud Ciudadana queda para Blob privado/Defender en Azure. No se
  habilitó el selector ni se omitió el antivirus existente. La regresión del backend
  incluye sus simulaciones anteriores, no una certificación de Defender ni malware real.
- Los tres fallos generales previos están en `tests/profile-pagination.test.js`:
  personas duplicadas/omitidas, miniatura ausente y cálculo de reducción de peso.
  No pertenecen a estos dos módulos; deben cerrarse antes de fusionar con main.
- La medición de carga y la preparación de producción son una etapa posterior.
  Estas pruebas funcionales no fijan una capacidad garantizada de Azure.
- No se hizo commit, push, fusión ni despliegue durante esta validación.

## Cierre de la entrega

El usuario confirmó que Solicitud Ciudadana funciona correctamente en su prueba
manual y autorizó conservar esta entrega mediante commits locales. La integración
continúa en `codex/integracion-api`; el siguiente bloque propuesto es corregir los
tres fallos previos de perfiles/imágenes antes de preparar la fusión con main.
