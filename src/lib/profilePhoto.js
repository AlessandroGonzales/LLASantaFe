import { ApiError } from "./apiClient.js";

export async function prepareProfilePhoto(file, signal, { maxBytes = 49152 } = {}) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024 || !file.size)
    throw new ApiError("Elegí una foto JPEG, PNG o WebP de hasta 2 MiB.");
  signal?.throwIfAborted();
  let image;
  try {
    image = await createImageBitmap(file, { imageOrientation: "from-image" });
    signal?.throwIfAborted();
    if (image.width > 8192 || image.height > 8192 || image.width * image.height > 24000000) throw new ApiError("Elegí una foto de hasta 24 megapíxeles.");
    const canvas = document.createElement("canvas"); canvas.width = 256; canvas.height = 256;
    const context = canvas.getContext("2d"), side = Math.min(image.width, image.height);
    context.fillStyle = "#fff"; context.fillRect(0, 0, 256, 256);
    context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 256, 256);
    for (const quality of [.85, .7, .55, .4]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
      signal?.throwIfAborted();
      if (blob && blob.size <= maxBytes) return blob;
    }
    throw new ApiError("Esta imagen no se pudo reducir. Probá con otra foto.");
  } catch (error) {
    if (signal?.aborted || error instanceof ApiError) throw error;
    throw new ApiError("No pudimos abrir esta imagen. Probá con otra foto.");
  } finally { image?.close(); }
}
