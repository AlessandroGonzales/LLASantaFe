const assets = import.meta.glob("../assets/historia/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

function photograph(name, width, height, alt, caption) {
  const src = assets[`../assets/historia/${name}-1440.webp`];
  const small = assets[`../assets/historia/${name}-640.webp`];
  return {
    src,
    srcSet: `${small} ${Math.min(width, 640)}w, ${src} ${Math.min(width, 1440)}w`,
    width,
    height,
    alt,
    caption,
  };
}

// Cada capítulo admite más párrafos y fotografías sin cambiar el componente.
export const historiaData = [
  {
    id: "historia-2023",
    year: "2023",
    label: "Los inicios",
    title: "El inicio del cambio en Santa Fe",
    accent: "#fde047",
    paragraphs: [
      "Comenzamos siendo un grupo de ciudadanos cansados de los mismos de siempre, caminando las calles de Santa Fe con boletas en la mano y convicción en el pecho.",
      "Fue el año en el que empezó la batalla cultural, con una militancia inquebrantable liderada por la fuerza de Romina Diez en la provincia y bajo la conducción de Javier Milei a nivel nacional, teniendo la precaución de cuidar cada voto frente al aparato de la casta. El año en el que conseguimos demostrar que las ideas de la libertad eran imparables y que ser un liberal no es un insulto.",
    ],
    photos: [
      photograph("santafedos", 1403, 964, "Encuentro de campaña con militantes, banderas argentinas y carteles de Milei 2023", "Encuentro de campaña"),
      photograph("santafe", 1591, 1185, "Militantes reunidos detrás de una bandera de La Libertad Avanza Santa Fe en 2023", "La militancia en Santa Fe"),
      photograph("inicios", 1280, 727, "Grupo de militantes con banderas de Javier Milei en Rosario", "Los primeros encuentros en Rosario"),
    ],
  },
  {
    id: "historia-2024-partido",
    year: "2024",
    label: "El partido",
    title: "La conformación oficial del partido",
    accent: "#e879f9",
    paragraphs: [
      "Los argentinos decidieron el rumbo para cambiar drásticamente a la Argentina: con el 56% de los votos obtenidos en las elecciones y siendo ya gobierno a nivel nacional, dimos el paso definitivo en nuestra región con la conformación oficial del partido La Libertad Avanza en Santa Fe.",
      "Bajo el liderazgo de Javier Milei, Karina Milei y Romina Diez, estructuramos una fuerza política real, superando récords de afiliaciones y consolidándonos como la alternativa definitiva para la provincia.",
    ],
    photos: [
      photograph("romisantafe", 1578, 977, "Dos dirigentes saludan desde el escenario a un salón lleno de militantes en Santa Fe", "La conformación del partido"),
      photograph("karina", 1265, 779, "Saludo a los asistentes de un encuentro de La Libertad Avanza en Santa Fe", "El encuentro con la militancia"),
      photograph("libertad", 941, 1280, "Dos dirigentes frente a la imagen del águila de La Libertad Avanza", "La identidad del partido"),
    ],
  },
  {
    id: "historia-2024-upl",
    year: "2024",
    label: "UPL",
    title: "Frente al adoctrinamiento",
    accent: "#7dd3fc",
    paragraphs: [
      "Ese mismo año marcamos un hito con el nacimiento de Universitarios por la Libertad (UPL). Frente al adoctrinamiento y a las estructuras tradicionales en las universidades, decidimos conformar el primer frente estudiantil puramente liberal.",
      "El objetivo era claro: devolverles las facultades a los estudiantes y llevar la batalla cultural a cada universidad, defendiendo siempre la libertad de pensamiento.",
    ],
    photos: [
      photograph("uplunidos", 2048, 1536, "Integrantes de Universitarios por la Libertad reunidos en una escalera", "Universitarios por la Libertad"),
      photograph("utn", 892, 665, "Integrantes de UPL en un aula universitaria", "La participación universitaria"),
      photograph("cierreupl", 1024, 768, "Encuentro de estudiantes con banderas de Universitarios por la Libertad", "Un encuentro de UPL"),
    ],
  },
  {
    id: "historia-2025",
    year: "2025",
    label: "Consolidación",
    title: "Nuestra consolidación",
    accent: "#e879f9",
    paragraphs: [
      "Las ideas de la libertad fueron llegando a cada argentino de bien; fueron creciendo a pesar de que se dijera que ser liberal era un insulto. Perseveramos a pesar del odio y, así, en 2025 dimos un batacazo en las elecciones legislativas, logrando el 40,67% de los votos.",
      "Con el apoyo de todos los santafesinos, podremos promulgar las más grandes reformas que necesita el país y la provincia de Santa Fe.",
    ],
    photos: [
      photograph("bloque", 1123, 977, "Representantes de La Libertad Avanza reunidos en el recinto de la Cámara de Diputados", "La representación en el Congreso"),
      photograph("folleto", 960, 1280, "Militantes y dirigentes repartiendo folletos de campaña en la calle", "La campaña en las calles"),
      photograph("mileiSantafe", 960, 1280, "Concentración de militantes con una bandera que dice Santa Fe es de Milei", "Santa Fe, presente"),
    ],
  },
];

export const historiaPhotos = historiaData.flatMap((chapter) =>
  chapter.photos.map((photo) => ({ ...photo, year: chapter.year, chapter: chapter.label })),
);
