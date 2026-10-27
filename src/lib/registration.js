import { validateNewPassword } from "./accountLinks.js";
import { privacyNotice } from "../data/privacyNotice.js";
// Cada envío obtiene su desafío; no se conserva ni se reintenta el token de un uso.
export async function submitRegistration({ body, signal, register, verify, container, challengeRequired = true }) {
  signal?.throwIfAborted();
  const token = challengeRequired ? await verify(container, "registro", signal) : undefined;
  signal?.throwIfAborted();
  return register(body, signal, token);
}
const email = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phone = /^\+?[0-9\s\-()]{8,20}$/;
export const registrationSteps = ["Tu identidad", "Tu lugar", "Tu día a día", "Tu seguridad", "Tu privacidad", "Bienvenida"];
export const emptyRegistration = () => ({ nombre: "", apellido: "", email: "", genero: "", telefono: "", fechaNacimiento: "", profesion: "", password: "", confirmation: "", city: "", department: "", aceptaPrivacidad: false });
export function validateRegistrationStep(step, data, today = new Date().toISOString().slice(0, 10)) {
  if (step === 0) {
    if (!data.nombre.trim() || data.nombre.trim().length > 100 || !data.apellido.trim() || data.apellido.trim().length > 100) throw new Error("Completá tu nombre y apellido.");
    if (!email.test(data.email.trim()) || data.email.trim().length > 254) throw new Error("Revisá tu correo electrónico.");
  }
  if (step === 1) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fechaNacimiento) || !Number.isFinite(Date.parse(`${data.fechaNacimiento}T00:00:00Z`)) || new Date(`${data.fechaNacimiento}T00:00:00Z`).toISOString().slice(0, 10) !== data.fechaNacimiento || data.fechaNacimiento > today) throw new Error("Indicá una fecha de nacimiento válida.");
    if (data.telefono.trim() && !phone.test(data.telefono.trim())) throw new Error("Revisá tu teléfono: entre 8 y 20 caracteres, con números y los símbolos + - ( ).");
    if (data.genero && !["masculino", "femenino", "otro", "prefiero_no_decir"].includes(data.genero)) throw new Error("Elegí una de las opciones de género.");
    if (data.department && !data.city) throw new Error("Elegí una localidad o dejá el departamento sin seleccionar.");
  }
  if (step === 2 && data.profesion.trim().length > 150) throw new Error("La profesión puede tener hasta 150 caracteres.");
  if (step === 3) validateNewPassword(data.password, data.confirmation);
  if (step === 4 && data.aceptaPrivacidad !== true) throw new Error("Para crear tu cuenta, leé y aceptá el aviso de privacidad.");
}
export async function registrationBody(data, photo, signal) {
  for (let step = 0; step < 5; step++) validateRegistrationStep(step, data);
  signal?.throwIfAborted();
  let fotoPerfilBase64 = null;
  if (photo) {
    if (photo.type !== "image/jpeg" || photo.size > 32768 || !photo.size) throw new Error("Elegí nuevamente tu foto para prepararla.");
    const bytes = new Uint8Array(await photo.arrayBuffer()); signal?.throwIfAborted();
    fotoPerfilBase64 = btoa(String.fromCharCode(...bytes));
  }
  return { nombre: data.nombre.trim(), apellido: data.apellido.trim(), email: data.email.trim(), password: data.password,
    fechaNacimiento: data.fechaNacimiento, telefono: data.telefono.trim() || null, genero: data.genero || null,
    ciudadId: data.city || null, profesion: data.profesion.trim() || null, fotoPerfilBase64,
    aceptaPrivacidad: true, privacidadVersion: privacyNotice.version };
}
