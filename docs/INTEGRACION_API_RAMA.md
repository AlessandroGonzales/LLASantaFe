# Rama de integración de la API

Preparada el 24 de octubre de 2026 en `codex/integracion-api`.

## Punto de partida

La rama se crea desde `main` en `5af605da1437775c85be156d08e0ec10a4c702f4`.
El primer commit conserva los cambios actuales del frontend que estaban pendientes,
incluidos sus componentes, recursos y formularios. Es el punto de partida previo
a conectar .NET; el ZIP del 8 de octubre es una copia histórica local.

`main` y `origin/main` conservan su commit. La integración, las pruebas y los commits
nuevos se realizan en `codex/integracion-api`. Los ZIP y las evidencias generadas
permanecen locales; los archivos de artifacts previamente versionados se conservan.

## Verificación del punto de partida

El build de producción de Vite completó correctamente. Se omitió únicamente el
reporte auxiliar del visualizador para evitar abrir el navegador; el código de la
aplicación y sus demás plugins se compilaron con la configuración actual.

`npm run test:forms` ejecutó 71 pruebas: 68 correctas y tres fallos existentes en
`tests/profile-pagination.test.js` antes de conectar la API:

- Conservación de personas en orden, sin duplicados ni omisiones.
- Imágenes/miniaturas: falta optimización para el perfil identificado como Franco volpe.
- Cálculo de reducción de peso: intenta leer `card` de una entrada ausente.

Se conservan para corregirlos durante la revisión del frontend, antes de fusionar
con main. Esta rama no se considera lista para producción por el solo hecho de
compilar. La revisión de secretos del contenido preparado y del historial no tuvo
hallazgos; no se almacenan credenciales ni variables privadas en este commit.

## Trabajo y pruebas

1. Antes de editar, comprobar la rama con `git branch --show-current`.
2. Conectar primero cliente HTTP y sesión; luego cuenta, afiliación, encuestas y
   solicitudes de texto, según los contratos de LLASantaFeApi.
3. Mantener contenido editorial público en React/Vercel. Conservar el recorrido
   actual de los formularios hasta completar y comprobar su reemplazo acordado.
4. Las pruebas con API comienzan en local. Un Preview requiere API accesible,
   origen CORS autorizado y variables/recursos de prueba propios. El PDF en Azure
   continúa pendiente.
5. Revisar secretos, ejecutar pruebas y build antes de publicar nuevos commits.
   `git push` de esta rama debe seguir su remoto `origin/codex/integracion-api`.

## Vercel y producción

Según la configuración indicada por el usuario, `main` es la rama de producción.
Se conserva esa configuración y el dominio público. Vercel puede crear un Preview
al recibir un push de otra rama: es un entorno diferente del sitio de producción.
No se ejecuta un despliegue con `--prod` ni una promoción de Preview en esta etapa.
Las variables de prueba deben apuntar a servicios de prueba para evitar escrituras
en las planillas o servicios usados por el sitio público.

Referencia: [ramas de producción y Preview en Vercel](https://vercel.com/docs/git#production-branch).

## Incorporación final

Cuando la integración pase las pruebas, revisar el diff contra `main` y preparar
un pull request. Incorporar cambios recientes de `main` si los hubiera, repetir
las verificaciones y fusionar solo con autorización del usuario. La creación de
esta rama no ejecuta esa fusión ni cambia la rama de producción.
