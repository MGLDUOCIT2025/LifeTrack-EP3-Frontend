/*
============================================================
BLOG.JSX
LifeTrack
============================================================

Blog principal de LifeTrack.

Incluye:

- Hero principal.
- Tarjetas de artículos.
- Imágenes oficiales de LifeTrack.
- Botón "Leer artículo".
- Vista completa del artículo.
- Cierre del artículo.
- Contenido dinámico mediante state.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import "./BlogPremium.css";


/* =========================================================
   IMÁGENES
========================================================= */

import heroPersona from "../assets/lifetrack/hero-persona.png";

import heroMontanas from "../assets/lifetrack/hero-montanas.png";

import bannerBoxeo from "../assets/lifetrack/banner-boxeo.png";

import cuaderno from "../assets/lifetrack/cuaderno.png";

import guantes from "../assets/lifetrack/guantes.png";

import shaker from "../assets/lifetrack/shaker.png";


function Blog() {


    /* =====================================================
       ARTÍCULOS
    ===================================================== */

    const articulos = [

        {
            id: 1,

            categoria:
                "PRODUCTIVIDAD",

            titulo:
                "Cómo organizar una semana realmente productiva",

            texto:
                "Aprende a equilibrar trabajo, estudios y vida personal.",

            imagen:
                heroMontanas,

            introduccion:
                "Una semana productiva no consiste en llenar cada hora con actividades. La verdadera productividad aparece cuando sabemos qué es importante, organizamos nuestras prioridades y dejamos espacio para descansar.",

            contenido: [

                "Cuando tenemos trabajo, estudios y responsabilidades personales al mismo tiempo, es fácil sentir que las horas del día no alcanzan. Por eso es importante comenzar la semana definiendo cuáles son las actividades realmente importantes.",

                "Una buena estrategia es separar las tareas por áreas. Por ejemplo: trabajo, estudios, entrenamiento y vida personal. De esta forma podemos visualizar mejor nuestra carga diaria y evitar concentrar demasiadas responsabilidades en un solo día.",

                "También es recomendable establecer objetivos pequeños y alcanzables. Completar varias tareas pequeñas genera sensación de progreso y ayuda a mantener la motivación durante la semana.",

                "LifeTrack busca apoyar precisamente este proceso, permitiendo visualizar actividades, tareas y progreso desde un mismo lugar."

            ],

            puntos: [

                "Define tus prioridades antes de comenzar la semana.",

                "Divide las tareas grandes en actividades pequeñas.",

                "Evita llenar todas las horas del día.",

                "Reserva tiempo para descanso y recuperación.",

                "Revisa tu progreso al terminar cada jornada."

            ]

        },


        {
            id: 2,

            categoria:
                "ESTUDIOS",

            titulo:
                "Estudiar cuando trabajas tiempo completo",

            texto:
                "Planificación inteligente para aprovechar cada hora.",

            imagen:
                cuaderno,

            introduccion:
                "Combinar trabajo y estudios puede ser difícil, pero una buena organización permite aprovechar mejor el tiempo disponible sin descuidar otras áreas importantes de la vida.",

            contenido: [

                "Cuando una persona trabaja durante gran parte del día, el tiempo disponible para estudiar es limitado. Por eso estudiar muchas horas no siempre significa estudiar mejor.",

                "Una estrategia efectiva consiste en identificar los momentos del día donde existe mayor concentración. Algunas personas estudian mejor temprano, mientras otras aprovechan las noches o los fines de semana.",

                "También es útil trabajar con sesiones cortas y objetivos concretos. Por ejemplo, en lugar de pensar 'hoy estudiaré base de datos', podemos definir algo específico como 'hoy practicaré procedimientos almacenados durante 40 minutos'.",

                "La planificación permite que el estudio deje de sentirse como una actividad improvisada y se transforme en parte de una rutina organizada."

            ],

            puntos: [

                "Estudia con objetivos concretos.",

                "Utiliza sesiones cortas de concentración.",

                "Prioriza los contenidos más importantes.",

                "Planifica con anticipación las evaluaciones.",

                "Mantén espacios de descanso."

            ]

        },


        {
            id: 3,

            categoria:
                "BOXEO",

            titulo:
                "Disciplina antes que motivación",

            texto:
                "La constancia construye resultados.",

            imagen:
                bannerBoxeo,

            introduccion:
                "La motivación puede ayudarnos a comenzar, pero es la disciplina la que permite continuar cuando las ganas disminuyen.",

            contenido: [

                "En el boxeo, al igual que en los estudios o el trabajo, los resultados no aparecen de un día para otro. Cada entrenamiento aporta una pequeña parte del progreso.",

                "Hay días donde existe mucha energía y otros donde simplemente debemos cumplir con nuestra rutina. En esos momentos la disciplina se vuelve más importante que la motivación.",

                "Crear horarios, registrar actividades y observar el progreso ayuda a mantener la constancia. Cuando podemos visualizar cuánto hemos avanzado resulta más sencillo continuar.",

                "Esta idea forma parte de la filosofía de LifeTrack: avanzar mediante pequeñas acciones realizadas de manera constante."

            ],

            puntos: [

                "La motivación cambia; la disciplina se construye.",

                "La constancia genera resultados a largo plazo.",

                "Una rutina ayuda a reducir las excusas.",

                "Registrar el progreso permite mantener el enfoque.",

                "Cada pequeña acción cuenta."

            ]

        },


        {
            id: 4,

            categoria:
                "ENTRENAMIENTO",

            titulo:
                "Entrenar también fortalece la mente",

            texto:
                "Tu cuerpo y tu concentración trabajan juntos.",

            imagen:
                guantes,

            introduccion:
                "El entrenamiento físico no solamente produce cambios en el cuerpo. También ayuda a desarrollar concentración, constancia y capacidad para enfrentar desafíos.",

            contenido: [

                "Mantener una rutina deportiva requiere organización. Cuando el entrenamiento se incorpora de manera estable dentro de la semana, deja de depender exclusivamente de la motivación.",

                "Actividades como gimnasio o boxeo también exigen concentración, control y capacidad para seguir instrucciones. Estas habilidades pueden trasladarse posteriormente a los estudios o al trabajo.",

                "El objetivo no es entrenar todos los días sin descanso, sino construir una rutina sostenible que pueda mantenerse en el tiempo.",

                "LifeTrack propone integrar el entrenamiento como una parte más de una vida organizada, junto con estudios, trabajo y objetivos personales."

            ],

            puntos: [

                "Organiza horarios realistas de entrenamiento.",

                "Incluye días de recuperación.",

                "Registra tus avances.",

                "Mantén objetivos alcanzables.",

                "Busca equilibrio entre actividad y descanso."

            ]

        },


        {
            id: 5,

            categoria:
                "HÁBITOS",

            titulo:
                "Pequeños hábitos, grandes cambios",

            texto:
                "Las acciones simples generan resultados sostenibles.",

            imagen:
                shaker,

            introduccion:
                "Los cambios importantes normalmente comienzan con acciones pequeñas que repetimos durante mucho tiempo.",

            contenido: [

                "Intentar cambiar completamente nuestra rutina de un día para otro suele ser difícil de mantener. En cambio, pequeños cambios pueden integrarse mucho más fácilmente a nuestra vida diaria.",

                "Preparar las cosas la noche anterior, revisar las tareas pendientes, organizar el horario del día siguiente o tomar algunos minutos para planificar son ejemplos de hábitos simples.",

                "La repetición transforma esas pequeñas acciones en comportamientos automáticos. Cuando eso ocurre necesitamos menos esfuerzo para mantenerlas.",

                "LifeTrack permite observar estas pequeñas acciones dentro de una estructura diaria y visualizar cómo contribuyen al progreso general."

            ],

            puntos: [

                "Comienza con un cambio pequeño.",

                "Repite la acción constantemente.",

                "Evita intentar cambiar todo al mismo tiempo.",

                "Observa tu progreso.",

                "Ajusta tus hábitos cuando sea necesario."

            ]

        },


        {
            id: 6,

            categoria:
                "LIFETRACK",

            titulo:
                "Construyendo una vida en equilibrio",

            texto:
                "Una rutina organizada permite avanzar en todas tus áreas.",

            imagen:
                heroPersona,

            introduccion:
                "LifeTrack nace de la idea de reunir distintas áreas de la vida dentro de una sola experiencia de organización personal.",

            contenido: [

                "Trabajo, estudios, entrenamiento y responsabilidades personales compiten diariamente por nuestro tiempo. Cuando no existe una planificación clara es fácil perder de vista nuestras prioridades.",

                "LifeTrack busca ofrecer una forma sencilla de visualizar el día, administrar tareas y observar el progreso conseguido.",

                "El objetivo del proyecto no es simplemente crear una lista de pendientes. La idea es construir una herramienta capaz de acompañar una rutina completa.",

                "Cada módulo del proyecto representa una parte de esa idea: Mi Día permite visualizar actividades, Mis Tareas permite administrar objetivos y la Tienda complementa el ecosistema LifeTrack.",

                "El concepto central del proyecto se resume en una frase: disciplina hoy, libertad mañana."

            ],

            puntos: [

                "Organizar distintas áreas desde un mismo lugar.",

                "Visualizar tareas y actividades.",

                "Observar el progreso diariamente.",

                "Construir hábitos sostenibles.",

                "Mantener equilibrio entre responsabilidades."

            ]

        }

    ];


    /* =====================================================
       STATE
    ===================================================== */

    const [
        articuloSeleccionado,
        setArticuloSeleccionado
    ] = useState(null);


    /* =====================================================
       ABRIR ARTÍCULO
    ===================================================== */

    const abrirArticulo = (
        articulo
    ) => {

        setArticuloSeleccionado(
            articulo
        );

    };


    /* =====================================================
       CERRAR ARTÍCULO
    ===================================================== */

    const cerrarArticulo = () => {

        setArticuloSeleccionado(
            null
        );

    };


    /* =====================================================
       BLOQUEAR SCROLL CUANDO EL ARTÍCULO ESTÁ ABIERTO
    ===================================================== */

    useEffect(() => {

        if (
            articuloSeleccionado
        ) {

            document.body.style.overflow =
                "hidden";

        } else {

            document.body.style.overflow =
                "";

        }


        return () => {

            document.body.style.overflow =
                "";

        };

    }, [articuloSeleccionado]);


    /* =====================================================
       CERRAR CON TECLA ESC
    ===================================================== */

    useEffect(() => {

        const manejarTecla = (
            event
        ) => {

            if (
                event.key === "Escape"
            ) {

                cerrarArticulo();

            }

        };


        window.addEventListener(
            "keydown",
            manejarTecla
        );


        return () => {

            window.removeEventListener(
                "keydown",
                manejarTecla
            );

        };

    }, []);


    /* =====================================================
       RETURN
    ===================================================== */

    return (

        <main className="blog-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section

                className="blog-hero"

                style={{

                    backgroundImage:
                        `url(${heroPersona})`

                }}

            >


                <div className="blog-hero-overlay"></div>


                <div className="blog-container blog-hero-content">


                    <span>

                        BLOG · SEGUIMIENTO DE VIDA

                    </span>


                    <h1>

                        Ideas para construir

                        <br />

                        <strong>

                            una vida mejor.

                        </strong>

                    </h1>


                    <p>

                        Productividad, estudios,
                        entrenamiento, hábitos y
                        crecimiento personal.

                    </p>


                </div>


            </section>


            {/* =================================================
                ARTÍCULOS
            ================================================= */}

            <section className="blog-content">


                <div className="blog-container blog-grid">


                    {

                        articulos.map(

                            (articulo) => (

                                <article

                                    className="blog-card"

                                    key={
                                        articulo.id
                                    }

                                >


                                    <img

                                        src={
                                            articulo.imagen
                                        }

                                        alt={
                                            articulo.titulo
                                        }

                                    />


                                    <div>


                                        <span>

                                            {
                                                articulo.categoria
                                            }

                                        </span>


                                        <h2>

                                            {
                                                articulo.titulo
                                            }

                                        </h2>


                                        <p>

                                            {
                                                articulo.texto
                                            }

                                        </p>


                                        <button

                                            type="button"

                                            onClick={
                                                () =>
                                                    abrirArticulo(
                                                        articulo
                                                    )
                                            }

                                        >

                                            Leer artículo →

                                        </button>


                                    </div>


                                </article>

                            )

                        )

                    }


                </div>


            </section>


            {/* =================================================
                ARTÍCULO COMPLETO
            ================================================= */}

            {

                articuloSeleccionado && (

                    <div

                        className="blog-modal"

                        role="dialog"

                        aria-modal="true"

                        aria-label={
                            articuloSeleccionado.titulo
                        }

                    >


                        {/* =========================================
                            FONDO
                        ========================================= */}

                        <button

                            type="button"

                            className="blog-modal-backdrop"

                            aria-label="Cerrar artículo"

                            onClick={
                                cerrarArticulo
                            }

                        ></button>


                        {/* =========================================
                            CONTENIDO
                        ========================================= */}

                        <article className="blog-article">


                            {/* =====================================
                                BOTÓN CERRAR
                            ===================================== */}

                            <button

                                type="button"

                                className="blog-article-close"

                                onClick={
                                    cerrarArticulo
                                }

                                aria-label="Cerrar artículo"

                            >

                                ✕

                            </button>


                            {/* =====================================
                                IMAGEN
                            ===================================== */}

                            <img

                                src={
                                    articuloSeleccionado.imagen
                                }

                                alt={
                                    articuloSeleccionado.titulo
                                }

                                className="blog-article-image"

                            />


                            {/* =====================================
                                CONTENIDO DEL ARTÍCULO
                            ===================================== */}

                            <div className="blog-article-content">


                                <span className="blog-article-category">

                                    {
                                        articuloSeleccionado.categoria
                                    }

                                </span>


                                <h2>

                                    {
                                        articuloSeleccionado.titulo
                                    }

                                </h2>


                                <p className="blog-article-intro">

                                    {
                                        articuloSeleccionado.introduccion
                                    }

                                </p>


                                <div className="blog-article-text">


                                    {

                                        articuloSeleccionado.contenido.map(

                                            (
                                                parrafo,
                                                index
                                            ) => (

                                                <p
                                                    key={
                                                        index
                                                    }
                                                >

                                                    {
                                                        parrafo
                                                    }

                                                </p>

                                            )

                                        )

                                    }


                                </div>


                                {/* =================================
                                    PUNTOS CLAVE
                                ================================= */}

                                <div className="blog-article-points">


                                    <h3>

                                        Puntos clave

                                    </h3>


                                    <ul>


                                        {

                                            articuloSeleccionado.puntos.map(

                                                (
                                                    punto,
                                                    index
                                                ) => (

                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >

                                                        <span>

                                                            ✓

                                                        </span>

                                                        {
                                                            punto
                                                        }

                                                    </li>

                                                )

                                            )

                                        }


                                    </ul>


                                </div>


                                {/* =================================
                                    MENSAJE FINAL
                                ================================= */}

                                <div className="blog-article-message">


                                    <span>

                                        LifeTrack

                                    </span>


                                    <strong>

                                        Disciplina hoy,
                                        libertad mañana.

                                    </strong>


                                </div>


                                {/* =================================
                                    VOLVER
                                ================================= */}

                                <button

                                    type="button"

                                    className="blog-article-return"

                                    onClick={
                                        cerrarArticulo
                                    }

                                >

                                    ← Volver al Blog

                                </button>


                            </div>


                        </article>


                    </div>

                )

            }


        </main>

    );

}


export default Blog;