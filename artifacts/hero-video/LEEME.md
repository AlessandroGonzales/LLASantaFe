# Previsualización del video para el hero

Esta entrega es un **montaje de las tres fotografías originales**, con movimiento de encuadre y fundidos. No genera gestos, movimiento de banderas ni una cámara que recorra físicamente el encuentro. La propuesta de animación generativa necesita una herramienta de video conectada; Runway se sugirió como opción, pero no se utilizó para estos archivos.

## Archivos

| Archivo | Formato | Duración | Tamaño |
| --- | --- | --- | --- |
| `hero-desktop-montaje.mp4` | 1600 × 900, H.264, 24 fps | 15 s | 2.90 MB |
| `hero-mobile-montaje.mp4` | 720 × 1280, H.264, 24 fps | 15 s | 1.11 MB |

Sin audio. Ambos MP4 tienen los metadatos de reproducción al inicio (`faststart`). Los JPG `poster-*` contienen el encuadre final. `contacto-*` permite revisar la secuencia y `preview-*.png` muestra el cierre con la interfaz de demostración.

Abrir `preview.html` mediante el servidor de desarrollo en `/artifacts/hero-video/preview.html`. Selecciona la versión mobile o desktop según el ancho inicial. El contenido del hero aparece a los 12,5 segundos; el video termina a los 15 segundos y conserva el último encuadre. La demostración permite pausar, repetir y saltar al cierre. Con movimiento reducido o ahorro de datos evita el autoplay.

El logo, título y enlaces son elementos HTML de la demostración. **No están incrustados en los MP4 ni se integró esta versión al componente Hero.** La web actual conserva sus cambios previos.

## Montaje

- 0–4,75 s: monumento y bandera, con acercamiento lento.
- 4,75–5,5 s: fundido hacia la foto de la multitud.
- 5,5–9,5 s: recorrido lateral suave sobre el encuadre de la multitud.
- 9,5–10,25 s: fundido hacia la fotografía final.
- 10,25–12,75 s: apertura gradual del encuadre final.
- 12,75–15 s: encuadre estable para presentar el contenido del hero.

En mobile, la tercera fotografía utiliza una composición horizontal sobre un fondo desenfocado de la misma imagen para conservar los tres rostros principales. La resolución de salida no agrega detalles que no existan en las fotos originales.

## Reproducir el render

Requiere Node.js y FFmpeg en PATH. Las imágenes de entrada deben llamarse `parteVideo.webp`, `mileirosario.webp` y `mileidiez.webp`.

```powershell
node scripts/render-hero-video.mjs "C:/Users/jaman/Downloads"
```

El comando reemplaza los renders de esta carpeta. Los clips intermedios están en `render-work`, excluido de Git. Los originales no se modifican.

## Dirección para una futura versión generativa

Crear tres tomas independientes usando las respectivas referencias, de 5–6 segundos cada una; montar luego un total máximo de 15 segundos. Mantener las proporciones faciales, vestuario, arquitectura, densidad de la multitud e iluminación de las referencias. Evitar movimientos de boca, discursos inventados, nuevos participantes o cambios de identidad.

1. Monumento: desplazamiento de cámara lento, bandera con movimiento sutil y físicamente plausible. No agregar ni eliminar elementos del monumento.
2. Multitud: movimiento de cámara lateral contenido; saludos suaves solo si la herramienta conserva correctamente rostros y manos. No simular un discurso ni añadir gritos o audio de personas.
3. Foto final: cámara casi inmóvil, cierre reconocible respecto de la referencia. Evitar transformar la pose de los protagonistas o alterar sus facciones. Reservar el espacio del título y de los botones fuera de los rostros.

Una versión con movimiento generado debe identificarse como recreación audiovisual; no presentarla como una filmación documental continua del evento. La continuidad, las manos y los rostros se deben revisar cuadro a cuadro antes de usarla públicamente.
