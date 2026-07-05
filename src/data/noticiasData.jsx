import pautacero from "../assets/pautacero.webp"
import rigi from "../assets/rigi.webp"
import rm from "../assets/romiymilei.jpeg"
import kari from "../assets/karinadiputados.jpeg"
import cierre from "../assets/cierreupl.webp"
import utn from "../assets/utn.webp"

export const newsData = [
  {
    id: 1,
    category: "Santa Fe",
    title: "PAUTA CERO",
    description: "LA VERDAD NO SE COMPRA.",
    image: pautacero,
    fecha: "14 de Junio, 2026",
    contenidoParte1: `
      <p>En la Provincia de Santa Fe, en 40 ciudades, se presenta el proyecto de Pauta Cero. Porque el periodismo libre se defiende con credibilidad, no con sobres ni dependencia del poder político.</p>
      
      <p>Con <strong>@JMilei</strong> empezó una nueva etapa: menos privilegios para los medios amigos y más respeto por los argentinos que no quieren financiar propaganda con sus impuestos.</p>
      
      <h3>La ofensiva contra el periodismo ensobrado</h3>
      <p>La diputada nacional <strong>Romina Diez</strong> volvió a marcar el rumbo político de La Libertad Avanza en Santa Fe con una ofensiva directa contra la pauta oficial y el llamado “periodismo ensobrado”.</p>
      
      <p>Desde el espacio de concejales libertarios alineados con <strong>Javier Milei</strong> y <strong>Karina Milei</strong>, y bajo la conducción política de Diez, se presentó en simultáneo el proyecto <strong>“Pauta Cero”</strong> en más de 20 ciudades santafesinas. La iniciativa busca eliminar el uso de recursos públicos para financiar medios, publicidad política y estructuras de comunicación vinculadas al poder de turno.</p>
      
      <p>“El dinero de los santafesinos tiene que volver a la gente y no terminar financiando propaganda política”, sostienen desde el armado libertario provincial.</p>
    `,
    imagenSecundaria: rm,
    contenidoParte2: `
      <h3>Consolidando la fuerza en la provincia</h3>
      <p>El lanzamiento del proyecto estuvo acompañado por un fuerte mensaje político contra el sistema tradicional de financiamiento estatal a medios de comunicación.</p>
      
      <p>Desde el entorno de <strong>Romina Diez</strong> remarcaron que el objetivo es terminar con décadas de utilización de fondos públicos para construir relatos políticos, disciplinar periodistas y sostener estructuras mediáticas cercanas al poder. La diputada nacional viene consolidándose como una de las principales figuras del mileísmo en Santa Fe y una de las arquitectas centrales del crecimiento territorial libertario en la provincia.</p>
      
      <p>Con <strong>@JMilei</strong> empezó una nueva etapa: menos privilegios para los medios amigos y más respeto por los argentinos que no quieren financiar propaganda con sus impuestos.</p>
      
      <p class="final-salute">La libertad avanza!!! <br/> VLLC!!!</p>
    `,
    linkX: "https://x.com/JMilei/status/2070131225646256211",
    linkInstagram: "https://instagram.com/lalibertadavanza",
  },
  {
    id: 2,
    category: "Nacional",
    title: "Súper RIGI",
    imagenSecundaria: kari,
    description:
      "Hoy damos un paso más para construir la Argentina que queremos.",
    fecha: "25 de junio, 2026",
    contenidoParte1:`
    En Diputados tratamos acuerdos internacionales, seguridad social y el Súper RIGI, una herramienta para atraer inversiones, crear empleo y seguir creciendo.
    
    La Cámara de Diputados de la Nación aprobó el proyecto de ley por el cual se crea el Régimen de Incentivo para Grandes Inversiones en Nuevas Industrias, conocido como “Súper RIGI”, destinado a otorgar incentivos y seguridad jurídica a proyectos de inversión dedicados exclusivamente al desarrollo de nuevas actividades económicas.

    `,
    contenidoParte2:`
    Con el Súper RIGI, la apuesta oficial es diferente: ya no se trata únicamente de potenciar sectores vinculados a los recursos naturales, sino de atraer compañías capaces de desarrollar en la Argentina industrias asociadas a la economía del conocimiento, la inteligencia artificial, la transición energética y la manufactura tecnológica avanzada.

    Con decisión de la mano del Presidente @JMilei, los argentinos salimos adelante!!
    VLLC!!!!
    `,
    image: rigi
  },
  {
    id: 3,
    category: "Juventud",
    title: "Universitarios por la libertad",
    fecha: "07 de marzo, 2026",
    imagenSecundaria: utn,
    description:
      "Vamos a terminar con los gerentes del adoctrinamiento",
    contenidoParte1: `El espacio sigue creciendo y este año trabajará para ganar influencia en las universidades santafesinas y del país. “La juventud que va a cambiar la historia no se va a detener”, afirmó la diputada nacional, tras brindar su apoyo a los estudiantes en la Facultad de Ciencias Exactas, Ingeniería y Agrimensura de Rosario
    La diputada nacional por la provincia de Santa Fe de La Libertad Avanza (LLA), Romina Diez, apoyó este viernes a Universitarios por la Libertad (UPL), una agrupación estudiantil que trabaja en pos de una universidad y una educación libre, por y para los estudiantes.`,
    contenidoParte2: ` “Universitarios por la Libertad” es la primera y única agrupación liberal en las universidades. Cuenta con todo el apoyo de La Libertad Avanza para impulsar este cambio y liberar las universidades”, agregó Romina Diez.

“Seguimos creciendo y llevando las ideas de la libertad a cada facultad de Santa Fe y la Argentina. Este proyecto es el movimiento estudiantil liberal más grande de la historia”, Romina Diez.
    `,
    image:
      cierre,
  },
];
