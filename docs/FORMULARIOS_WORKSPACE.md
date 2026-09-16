# Activación de formularios: Workspace, Vercel y protección contra spam

## Estado y alcance

El código integra **Sumate** y **Propone** sin rediseñarlos. Todavía hay que configurar los servicios externos y desplegar: tener acceso al correo no conecta automáticamente Sheets con la web. No se crearon recursos ni se enviaron datos reales desde las pruebas locales.

Flujo: navegador → `/api/forms` en Vercel → verificación anti-bot y límites → solicitud firmada a Apps Script → Sheets y Drive privados de `oficial@llasantafe.com.ar`.

No hace falta activar Gmail API ni guardar la contraseña del correo. No se envían correos automáticos. Esta función de Vercel es únicamente el puente seguro de los formularios; no incorpora la futura base PostgreSQL ni el backend general.

## 1. Crear el almacenamiento en Workspace

1. Iniciar sesión en [Google Apps Script](https://script.google.com/) con **oficial@llasantafe.com.ar** y crear un proyecto independiente llamado `LLA Santa Fe - Formularios web`.
2. Copiar `google-apps-script/Code.gs` al archivo `Code.gs` del proyecto.
3. En Configuración del proyecto, habilitar la visualización del manifiesto `appsscript.json`. Reemplazarlo con `google-apps-script/appsscript.json` del repositorio.
4. Generar un secreto aleatorio en tu terminal local:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

5. Guardarlo en un administrador de contraseñas. En **Propiedades del script**, crear `API_SECRET` con ese valor. No enviarlo por chat, no colocarlo en React ni subirlo a Git.
6. Seleccionar y ejecutar **setupWorkspace** desde el editor. Autorizar con la cuenta oficial. El código verifica esa cuenta y crea:
   - Una planilla `LLA Santa Fe - Formularios web`, con pestañas **Sumate** y **Propuestas**.
   - Una carpeta privada `LLA Santa Fe - Documentos recibidos`.
   - Las propiedades `SPREADSHEET_ID` y `UPLOAD_FOLDER_ID`, automáticamente.
7. Abrir los enlaces que aparecen en el registro de ejecución. Verificar **Acceso general: Restringido** en ambos recursos y revisar cualquier permiso individual o política del dominio. Compartir únicamente con responsables autorizados, nunca con “cualquiera que tenga el enlace”.
8. Usar **Implementar → Nueva implementación → Aplicación web**. Ejecutar como **yo**, la cuenta oficial. Acceso: **Cualquier persona**, incluido acceso anónimo. Copiar la URL terminada en `/exec`; no usar `/dev`.

El acceso anónimo permite que Vercel llame al script, pero no autoriza escrituras: cada solicitud debe tener una firma HMAC válida y reciente. La URL solo se configura en el servidor. Si Workspace bloquea implementaciones anónimas, consultar con su administrador; no publicar la planilla ni quitar la verificación para resolverlo. [Documentación de aplicaciones web de Google](https://developers.google.com/apps-script/guides/web).

`setupWorkspace` puede ejecutarse de nuevo: reutiliza los IDs y no borra filas. Vuelve a restringir el acceso general de esos recursos, pero no elimina colaboradores individuales. Si ya existen IDs configurados, verificar que apunten a los recursos correctos antes de ejecutarlo. No cambiar nombres, orden ni contenido de las columnas del encabezado: el script rechaza esquemas distintos para evitar escribir en columnas equivocadas.

Cuando cambie `Code.gs`, actualizar la implementación con una **nueva versión**. Guardar cambios en el editor no actualiza por sí solo la versión publicada.

## 2. Configurar Turnstile

En Cloudflare, crear un widget **Turnstile Managed**. Registrar únicamente los nombres de host reales del sitio (por ejemplo, el dominio raíz y `www`, si ambos sirven formularios). No incluir `https://` ni rutas.

- **Site key** → `VITE_TURNSTILE_SITE_KEY`: pública, se incluye en React.
- **Secret key** → `TURNSTILE_SECRET_KEY`: exclusivamente en el servidor.

El widget se carga al enviar. Con `interaction-only` aparece solo cuando necesita intervención; esa comprobación puede ocupar espacio aunque el diseño del formulario no cambie. Si un bloqueador impide cargarla, el envío muestra error y conserva los campos. [Configuración del widget](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/).

El servidor verifica el token, el dominio y la acción (`sumate` o `propone`). Los tokens de Turnstile tienen duración limitada y son de un solo uso; cada reintento obtiene uno nuevo. No eliminar la verificación de servidor aunque el navegador ya haya mostrado el desafío. [Validación de Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## 3. Configurar límites persistentes con Redis

Crear una base Redis en Upstash y obtener sus **REST URL** y **REST TOKEN** con permisos de escritura. Configurar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` en Vercel. No usar el token de solo lectura. [API REST de Upstash](https://upstash.com/docs/redis/features/restapi).

Los contadores son compartidos entre las instancias de Vercel. No se usa memoria local de la función, porque reiniciarse permitiría eludir los límites.

Límites iniciales, compartidos por los dos formularios:

- Antes de verificar Turnstile: 20 intentos por IP cada 10 minutos y 3000 intentos globales cada 10 minutos.
- Tras una verificación válida: 5 intentos de guardado por IP por hora y 500 globales por 24 horas.
- Los intervalos comienzan con la primera operación del contador, no a medianoche.
- Los reintentos también consumen cuota. Una caída de Google puede consumir un intento sin guardar una fila.
- Las IPv6 de una misma red `/64` comparten contador. Las personas que comparten una conexión también pueden compartir el límite.

Los límites de guardado se ajustan con `FORMS_IP_HOURLY_LIMIT` y `FORMS_DAILY_LIMIT` (enteros entre 1 y 10000). Los límites previos están en `server/forms-handler.js`. Evaluarlos antes de una convocatoria grande: al llegar al cupo global también se bloquean envíos legítimos hasta su vencimiento. Separar el namespace de producción del de pruebas.

Si Redis o Turnstile fallan, **no se escribe en Sheets**. Un error de configuración nunca habilita envíos sin protección. Los contadores usan una huella HMAC de la IP, no la IP en texto; la IP se transmite a Turnstile para la verificación.

## 4. Variables en Vercel y despliegue

Usar `.env.example` como lista de configuración, nunca como lugar para guardar secretos reales en Git. En Vercel → proyecto → Settings → Environment Variables:

| Variable | Valor |
| --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | Clave pública del widget |
| `TURNSTILE_SECRET_KEY` | Clave secreta de Turnstile |
| `FORMS_ALLOWED_ORIGINS` | Orígenes exactos separados por coma, sin barra final |
| `GOOGLE_APPS_SCRIPT_URL` | URL de la implementación de Google terminada en `/exec` |
| `GOOGLE_APPS_SCRIPT_SECRET` | Exactamente el mismo valor de `API_SECRET` en Google |
| `UPSTASH_REDIS_REST_URL` | URL HTTPS de la API REST de Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token privado con escritura |
| `FORMS_IP_HOURLY_LIMIT` | Opcional; predeterminado `5` |
| `FORMS_DAILY_LIMIT` | Opcional; predeterminado `500` |
| `FORMS_RATE_NAMESPACE` | Por ejemplo `lla:forms:production:v1` |

**Confirmar el dominio web antes de publicar.** El repositorio usaba `www.lalibertadavanzasantafe.com`, mientras que el correo nuevo usa `llasantafe.com.ar`. El dominio del correo no demuestra cuál sirve la web. El valor de `.env.example` es una referencia, no una confirmación. Agregar solamente los orígenes donde realmente se sirve el formulario, por ejemplo `https://dominio-real,https://www.dominio-real`, y registrar esos mismos hostnames en Turnstile.

No usar comodines, `*`, rutas ni una lista indiscriminada de previews. Para staging, usar una planilla/carpeta de pruebas y un namespace independiente. No dar acceso al almacenamiento de producción a todos los despliegues de preview.

Hacer un nuevo deploy después de configurar las variables: la clave pública `VITE_` se incorpora durante la compilación. **No publicar esta versión antes de configurarlas**, porque los formularios quedan bloqueados de forma segura cuando faltan.

**Desactivar o archivar las implementaciones antiguas de Apps Script que aceptaban datos sin firma.** Cambiar el frontend no cierra esos endpoints: si permanecen activos, pueden permitir que un bot siga escribiendo directamente en las hojas antiguas.

## 5. Comprobación antes de anunciar el sitio

Con datos ficticios y la autorización del responsable:

1. Comprobar que `GET /api/forms` responde JSON y estado 405; no debe devolver el HTML de React.
2. Completar una solicitud de Sumate. Verificar una única fila en **Sumate**, DNI/teléfono como texto, fiscalización como booleano y `estado=pendiente`.
3. Enviar una propuesta sin adjunto y otra con un PDF o DOCX pequeño. Verificar filas en **Propuestas**, enlace al archivo y archivo en la carpeta oficial.
4. Abrir el enlace del documento en una ventana sin sesión: no debe quedar públicamente disponible.
5. Repetir exactamente el mismo contenido: debe confirmar el registro existente, sin duplicar fila ni documento. La deduplicación es por contenido normalizado completo, no por DNI o email solamente.
6. Verificar una extensión no admitida y un documento de más de 2 MB: se rechazan. Comprobar también un envío inválido directo al endpoint: no debe escribirse una fila.
7. Probar un límite bajo **solo en staging** y restaurarlo: respuesta 429, datos conservados y ninguna confirmación falsa.
8. Revisar móvil y escritorio, teclado y desafío de Turnstile real. Las pruebas automatizadas locales simulan los servicios externos; no sustituyen esta prueba real.

Para desarrollo local, `npm run dev` solo inicia React. Para probar la función de Vercel junto con la web, usar `vercel dev`, configurar variables privadas locales y el origen exacto del puerto que muestre. Configurar un widget de pruebas para localhost separado del productivo. Nunca desplegar claves de prueba de Turnstile en producción.

Verificación local del código:

```sh
npm run test:forms
npm run build
```

La suite de Node prueba validaciones, límites, firmas, errores, idempotencia y guardado privado mediante servicios simulados. No realiza llamadas a Google, Cloudflare ni Redis.

## Archivos, privacidad y límites de esta etapa

- Se acepta un documento por propuesta: PDF, DOC, DOCX, XLS, XLSX, ODT o TXT, hasta **2 MiB** (el texto del formulario dice 2 MB). Excel se conserva porque ya estaba permitido. No se admiten ZIP independientes ni extensiones de macros como DOCM/XLSM.
- El servidor comprueba tamaño, extensión y señales de contenido; no confía en el MIME informado por el navegador. Se limita también el contenido de los contenedores Office/ODT para rechazar estructuras peligrosas o excesivas.
- **Esto no es un antivirus.** PDF y documentos Office antiguos pueden contener contenido activo. No habilitar macros ni ejecutar adjuntos recibidos; revisarlos con herramientas de seguridad antes de abrirlos o distribuirlos. No se renderizan en la web.
- El límite conserva margen para Base64 dentro del máximo de petición de Vercel. No aumentarlo sin revisar ambos límites y las cuotas de Google. [Límites de Vercel Functions](https://vercel.com/docs/functions/limitations).
- Anti-bot no equivale a identidad verificada: no confirma que el DNI o el teléfono pertenezcan a la persona. Las filas quedan pendientes de revisión humana. Ninguna protección garantiza cero spam; un ataque distribuido puede agotar cuotas o disponibilidad. Añadir reglas de protección de Vercel y revisar consumos de los proveedores antes de difusión masiva.
- El endpoint público de Apps Script rechaza solicitudes no firmadas, pero esas solicitudes también pueden consumir cuotas de ejecución de Google. Mantener su URL fuera del cliente reduce exposición; no constituye por sí solo una defensa contra denegación de servicio.
- Limitar accesos a estos datos personales, definir quién revisa y cuándo elimina registros/documentos, y conservar las comunicaciones y autorizaciones que correspondan. No copiar datos reales a issues, logs o pruebas.
- El script neutraliza fórmulas al escribir en Sheets. Si se exportan datos a CSV/Excel, volver a sanitizarlos en el proceso de exportación: no asumir que la protección de Sheets se conserva en cualquier formato.
- Si falla Sheets después de crear el archivo, un reintento con el mismo ID recupera ese archivo. Si no hay reintento, puede quedar un archivo sin fila; revisar esos casos antes de eliminar nada. No hay transacción conjunta entre Drive y Sheets.

## Migración futura y mantenimiento

Los registros incluyen `id` UUID, `created_at` ISO, `schema_version`, `estado`, `fingerprint` y campos estables. Los adjuntos se referencian por ID y URL de Drive. Eso permite migrar a PostgreSQL sin depender de títulos visuales del formulario. Mantener los UUID y el registro de documentos al migrar.

Si se rota el secreto compartido, actualizar Google y Vercel coordinadamente y volver a desplegar. Durante una discrepancia se rechazan escrituras. La rotación cambia las huellas de contenido: la deduplicación por contenido de registros anteriores ya no coincide; los IDs siguen identificándolos.

Ante errores: confirmar variables y dominio, versión publicada de Apps Script, encabezados originales, permisos de la cuenta y cuotas de proveedores. No desactivar CAPTCHA, firma ni límites para recuperar disponibilidad. La aplicación conserva los campos en la página para reintentar; no los guarda de forma persistente en el navegador y se pierden al recargar.
