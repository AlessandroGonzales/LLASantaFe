# Presentación del chatbot de Rosario

Integrada el 13 de octubre de 2026 en la portada: PropuestasPreview → ChatbotPreview → NosotrosPreview.

Franja compacta, sin tarjetas ni animaciones adicionales: robot a la izquierda, título, descripción y enlace a la derecha. El enlace abre https://llareclamosrosario.com/ en la misma pestaña. La presentación no incorpora un chat ni recopila datos en este sitio.

## Recurso visual

Se usó la herramienta integrada de generación/edición de imágenes, siguiendo la habilidad imagegen. Se conservó el robot de referencia, se adaptaron sus colores a la paleta del sitio y se solicitó fondo transparente. El original del usuario no fue reemplazado. La salida PNG se convirtió a WebP, conservando transparencia y ajustando el margen vacío para el uso en la franja.

- `src/assets/chatbot-rosario-small.webp`: 240 px de ancho, 25.714 bytes.
- `src/assets/chatbot-rosario.webp`: 480 px de ancho, 68.880 bytes.
- `src/components/ChatbotPreview.jsx`: carga diferida, srcSet/sizes, dimensiones reservadas y enlace con foco visible. La imagen es decorativa; el texto comunica la función del servicio.

## Prompt final de edición

Use case: precise-object-edit + background-extraction. Asset type: compact website mascot cutout, to sit on a dark violet #1E082D web page. Image 1 is the edit target. Edit the supplied robot: keep its recognizable cute rounded head, black glass face with two cream-white circular eyes, body proportions, full standing pose, arms, hands and feet, camera perspective and polished 3D material style. Change ONLY the robot's surface colors and remove the background. Main body shell: pale lavender-white with tasteful violet #5C3A7A/#2F1A3F panels and joints; change yellow ear light accents to magenta #D946EF, add restrained cyan #06B6D4 accent reflections, no excessive glow. Keep the face almost black and the eyes bright white. Soft realistic studio lighting; crisp silhouette, all limbs and feet fully visible, generous but not excessive padding, centered robot. Genuine transparent background with clean antialiased alpha edges: no cyan backdrop, no stage, no rectangular colored background, no checkerboard baked into image. No text, no party logos, no extra props, no additional characters. This must be the same recognizable robot recolored, not a redesigned mascot.

## Verificación

Compilación de producción correcta y ESLint limpio en ChatbotPreview y App. Comprobado en Edge con anchos de 320, 390, 768 y 1440 px: robot a la izquierda, enlace correcto, imagen cargada y sin desbordamientos en la franja. No se registraron errores JavaScript. Capturas en `artifacts/chatbot/`.

Se inspeccionó la página de destino para confirmar su relación con el chatbot y los reclamos de Rosario; no se enviaron reclamos ni se modificó el sitio externo.
