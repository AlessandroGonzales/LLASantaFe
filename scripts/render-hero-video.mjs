import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// Previsualización editorial con fotografías: no genera movimiento de personas.
// node scripts/render-hero-video.mjs [carpeta-de-las-tres-fotos]
// Requiere ffmpeg y ffprobe disponibles en PATH.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(process.argv[2] || "C:/Users/jaman/Downloads");
const output = path.join(root, "artifacts/hero-video");
const work = path.join(output, "render-work");
const photos = ["parteVideo.webp", "mileirosario.webp", "mileidiez.webp"];
const fps = 24;
const frames = 132; // 5,5 s por toma; dos fundidos de 0,75 s = 15 s.

async function run(args) {
  await new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`ffmpeg terminó con código ${code}`)));
  });
}

const encode = ["-an", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-threads", "2"];
const ease = "(0.5-0.5*cos(PI*min(on/131,1)))";
const finish = "(0.5-0.5*cos(PI*min(on/78,1)))";

function shotFilter(index, width, height, mobile) {
  const z = index === 0 ? `1.02+0.075*${ease}` : index === 1 ? `1.12-0.035*${ease}` : `1.045-0.045*${finish}`;
  const x = index === 1 ? `(iw-iw/zoom)*(0.15+0.75*${ease})` : "(iw-iw/zoom)/2";
  const zoom = `zoompan=z='${z}':x='${x}':y='(ih-ih/zoom)/2':d=1:s=${width}x${height}:fps=${fps},setsar=1`;
  if (mobile && index === 2) {
    // La foto final es horizontal. Mantener los tres rostros con un fondo
    // desenfocado derivado de la misma fotografía, sin inventar escena adicional.
    return `[0:v]split[bg][fg];[bg]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,boxblur=32:2,eq=brightness=-0.20:saturation=0.65[back];` +
      `[fg]scale=2000:-2,crop=1440:ih:(iw-1440)*0.65:0,zoompan=z='${z}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=720x526:fps=24,setsar=1[front];` +
      `[back][front]overlay=x=0:y=338:shortest=1,setsar=1,format=yuv420p[out]`;
  }
  const anchorX = mobile ? (index === 0 ? 0.32 : 0.84) : 0.5;
  const anchorY = index === 1 ? 0.54 : 0.5;
  return `[0:v]scale=${width * 2}:${height * 2}:force_original_aspect_ratio=increase:flags=lanczos,` +
    `crop=${width * 2}:${height * 2}:(iw-ow)*${anchorX}:(ih-oh)*${anchorY},${zoom},format=yuv420p[out]`;
}

await mkdir(work, { recursive: true });
for (const photo of photos) await stat(path.join(source, photo));

for (const [name, width, height] of [["desktop", 1600, 900], ["mobile", 720, 1280]]) {
  const clips = [];
  for (const [index, photo] of photos.entries()) {
    const clip = path.join(work, `${name}-${index + 1}.mp4`);
    console.log(`Render ${name}: toma ${index + 1}/3`);
    await run(["-loop", "1", "-framerate", String(fps), "-i", path.join(source, photo),
      "-filter_complex_threads", "1", "-filter_complex", shotFilter(index, width, height, name === "mobile"),
      "-map", "[out]", "-frames:v", String(frames), ...encode, clip]);
    clips.push(clip);
  }
  console.log(`Montaje y compresión ${name}`);
  const filename = path.join(output, `hero-${name}-montaje.mp4`);
  await run([...clips.flatMap(clip => ["-i", clip]), "-filter_complex_threads", "1", "-filter_complex",
    "[0:v]settb=AVTB,setpts=PTS-STARTPTS[a];[1:v]settb=AVTB,setpts=PTS-STARTPTS[b];[2:v]settb=AVTB,setpts=PTS-STARTPTS[c];" +
    "[a][b]xfade=transition=fade:duration=0.75:offset=4.75[ab];[ab][c]xfade=transition=fade:duration=0.75:offset=9.5,format=yuv420p[out]",
    "-map", "[out]", "-t", "15", "-r", String(fps), "-an", "-c:v", "libx264", "-preset", "slow",
    "-crf", name === "desktop" ? "24" : "25", "-maxrate", name === "desktop" ? "3000k" : "1700k",
    "-bufsize", name === "desktop" ? "6000k" : "3400k", "-pix_fmt", "yuv420p", "-threads", "2",
    "-movflags", "+faststart", "-metadata", "comment=Montaje de fotografias originales. No es una filmacion continua ni video generativo.", filename]);
  await run(["-ss", "14.9", "-i", filename, "-frames:v", "1", "-q:v", "3", "-update", "1", path.join(output, `poster-${name}.jpg`)]);
  console.log(`${name}: ${((await stat(filename)).size / 1024 / 1024).toFixed(2)} MiB`);
}
