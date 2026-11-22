/*
============================================================
MI DIA.JSX
LifeTrack
============================================================

FUNCIONES:

- Planificación de lunes a domingo.
- Agregar actividades manualmente.
- Agregar actividades mediante voz.
- Editar actividades.
- Eliminar actividades.
- Marcar actividades completadas.

CATEGORÍAS:

- Trabajo
- Estudios
- Gimnasio
- Boxeo
- Personal
- Finanzas
- Remedios

OTRAS FUNCIONES:

- Guardado con localStorage.
- Progreso diario.
- Resumen semanal.
- Vista semanal completa.
- Modal ampliado por día.
- Modal solo de lectura.
- Asistente de voz.
- SpeechRecognition.
- SpeechSynthesis.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import "./MiDiaPremium.css";


import heroMontanas
    from "../assets/lifetrack/hero-montanas.png";


/*
============================================================
DÍAS DE LA SEMANA
============================================================
*/

const diasSemana = [

    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",

];


/*
============================================================
CATEGORÍAS
============================================================
*/

const categorias = [

    "Trabajo",
    "Estudios",
    "Gimnasio",
    "Boxeo",
    "Personal",
    "Finanzas",
    "Remedios",

];


/*
============================================================
ICONOS
============================================================
*/

function obtenerIcono(
    categoria
) {

    const iconos = {

        Trabajo: "💼",
        Estudios: "📚",
        Gimnasio: "🏋️",
        Boxeo: "🥊",
        Personal: "⭐",
        Finanzas: "💰",
        Remedios: "💊",

    };


    return (
        iconos[categoria] ||
        "⭐"
    );

}


/*
============================================================
INTERPRETAR DÍA HABLADO
============================================================
*/

function interpretarDiaVoz(
    texto
) {

    const limpio =
        texto
            .toLowerCase()
            .trim();


    if (
        limpio.includes("lunes")
    ) {

        return "Lunes";

    }


    if (
        limpio.includes("martes")
    ) {

        return "Martes";

    }


    if (
        limpio.includes("miércoles")
        ||
        limpio.includes("miercoles")
    ) {

        return "Miércoles";

    }


    if (
        limpio.includes("jueves")
    ) {

        return "Jueves";

    }


    if (
        limpio.includes("viernes")
    ) {

        return "Viernes";

    }


    if (
        limpio.includes("sábado")
        ||
        limpio.includes("sabado")
    ) {

        return "Sábado";

    }


    if (
        limpio.includes("domingo")
    ) {

        return "Domingo";

    }


    /*
    --------------------------------------------------------
    HOY
    --------------------------------------------------------
    */

    if (
        limpio.includes("hoy")
    ) {

        const numeroDia =
            new Date().getDay();


        const equivalencia = {

            0: "Domingo",
            1: "Lunes",
            2: "Martes",
            3: "Miércoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sábado",

        };


        return equivalencia[
            numeroDia
        ];

    }


    /*
    --------------------------------------------------------
    MAÑANA
    --------------------------------------------------------
    */

    if (
        limpio.includes("mañana")
    ) {

        const fecha =
            new Date();


        fecha.setDate(
            fecha.getDate() + 1
        );


        const numeroDia =
            fecha.getDay();


        const equivalencia = {

            0: "Domingo",
            1: "Lunes",
            2: "Martes",
            3: "Miércoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sábado",

        };


        return equivalencia[
            numeroDia
        ];

    }


    return null;

}


/*
============================================================
INTERPRETAR HORA HABLADA
============================================================
*/

function interpretarHoraVoz(
    texto
) {

    const limpio =
        texto
            .toLowerCase()
            .trim();


    const numeros = {

        cero: 0,
        una: 1,
        uno: 1,
        dos: 2,
        tres: 3,
        cuatro: 4,
        cinco: 5,
        seis: 6,
        siete: 7,
        ocho: 8,
        nueve: 9,
        diez: 10,
        once: 11,
        doce: 12,
        trece: 13,
        catorce: 14,
        quince: 15,
        dieciseis: 16,
        dieciséis: 16,
        diecisiete: 17,
        dieciocho: 18,
        diecinueve: 19,
        veinte: 20,
        veintiuno: 21,
        veintidos: 22,
        veintidós: 22,
        veintitres: 23,
        veintitrés: 23,

    };


    /*
    --------------------------------------------------------
    21:30 / 21 30
    --------------------------------------------------------
    */

    const formatoNumerico =
        limpio.match(
            /(\d{1,2})[:\s](\d{2})/
        );


    if (
        formatoNumerico
    ) {

        let hora =
            Number(
                formatoNumerico[1]
            );


        const minutos =
            Number(
                formatoNumerico[2]
            );


        if (
            limpio.includes("tarde")
            ||
            limpio.includes("noche")
        ) {

            if (
                hora < 12
            ) {

                hora += 12;

            }

        }


        return (
            `${String(hora).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`
        );

    }


    let horaDetectada =
        null;


    for (
        const [
            palabra,
            numero
        ]
        of Object.entries(
            numeros
        )
    ) {

        if (
            limpio.includes(
                palabra
            )
        ) {

            horaDetectada =
                numero;

            break;

        }

    }


    if (
        horaDetectada === null
    ) {

        const directa =
            limpio.match(
                /\b([01]?\d|2[0-3])\b/
            );


        if (
            directa
        ) {

            horaDetectada =
                Number(
                    directa[1]
                );

        }

    }


    if (
        horaDetectada === null
    ) {

        return null;

    }


    let minutos =
        0;


    if (
        limpio.includes(
            "y media"
        )
    ) {

        minutos =
            30;

    }


    if (
        limpio.includes(
            "y cuarto"
        )
    ) {

        minutos =
            15;

    }


    if (
        limpio.includes(
            "menos cuarto"
        )
    ) {

        horaDetectada -= 1;

        minutos =
            45;

    }


    if (
        limpio.includes("tarde")
        ||
        limpio.includes("noche")
    ) {

        if (
            horaDetectada < 12
        ) {

            horaDetectada += 12;

        }

    }


    if (
        limpio.includes("mañana")
        &&
        horaDetectada === 12
    ) {

        horaDetectada =
            0;

    }


    return (
        `${String(horaDetectada).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`
    );

}


/*
============================================================
INTERPRETAR CATEGORÍA
============================================================
*/

function interpretarCategoriaVoz(
    texto
) {

    const limpio =
        texto
            .toLowerCase();


    if (
        limpio.includes("trabajo")
    ) {

        return "Trabajo";

    }


    if (
        limpio.includes("estudio")
        ||
        limpio.includes("universidad")
        ||
        limpio.includes("duoc")
    ) {

        return "Estudios";

    }


    if (
        limpio.includes("gimnasio")
        ||
        limpio.includes("gym")
    ) {

        return "Gimnasio";

    }


    if (
        limpio.includes("boxeo")
    ) {

        return "Boxeo";

    }


    if (
        limpio.includes("finanza")
        ||
        limpio.includes("pagar")
        ||
        limpio.includes("pago")
        ||
        limpio.includes("cuota")
    ) {

        return "Finanzas";

    }


    if (
        limpio.includes("remedio")
        ||
        limpio.includes("medicamento")
        ||
        limpio.includes("pastilla")
    ) {

        return "Remedios";

    }


    if (
        limpio.includes("personal")
    ) {

        return "Personal";

    }


    return null;

}


/*
============================================================
ACTIVIDADES INICIALES
============================================================
*/

const actividadesIniciales = [

    {
        id: 1,
        hora: "07:00",
        categoria: "Gimnasio",
        icono: "🏋️",
        titulo: "Gimnasio",
        detalle: "Entrenamiento de fuerza",
        realizado: true,
    },

    {
        id: 2,
        hora: "09:00",
        categoria: "Trabajo",
        icono: "💼",
        titulo: "Trabajo",
        detalle: "Jornada laboral",
        realizado: true,
    },

    {
        id: 3,
        hora: "19:00",
        categoria: "Estudios",
        icono: "📚",
        titulo: "Estudios",
        detalle: "Ingeniería en Informática",
        realizado: false,
    },

    {
        id: 4,
        hora: "21:30",
        categoria: "Boxeo",
        icono: "🥊",
        titulo: "Boxeo",
        detalle: "Entrenamiento",
        realizado: false,
    },

];


/*
============================================================
SEMANA VACÍA
============================================================
*/

function crearSemanaVacia() {

    return {

        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: [],

    };

}


/*
============================================================
COMPONENTE
============================================================
*/

function MiDia() {


    /*
    ============================================================
    DÍA SELECCIONADO
    ============================================================
    */

    const [
        diaSeleccionado,
        setDiaSeleccionado
    ] = useState(
        "Lunes"
    );


    /*
    ============================================================
    MODAL SEMANAL
    ============================================================
    */

    const [
        diaModal,
        setDiaModal
    ] = useState(
        null
    );


    /*
    ============================================================
    ASISTENTE DE VOZ
    ============================================================
    */

    const [
        asistenteVozAbierto,
        setAsistenteVozAbierto
    ] = useState(
        false
    );


    const [
        pasoVoz,
        setPasoVoz
    ] = useState(
        "inicio"
    );


    const [
        escuchando,
        setEscuchando
    ] = useState(
        false
    );


    const [
        mensajeVoz,
        setMensajeVoz
    ] = useState(
        ""
    );


    const [
        ultimaRespuestaVoz,
        setUltimaRespuestaVoz
    ] = useState(
        ""
    );


    const [
        actividadVoz,
        setActividadVoz
    ] = useState({

        titulo: "",
        dia: "Lunes",
        hora: "",
        categoria: "Personal",
        detalle: "",

    });


    /*
    ============================================================
    PLANIFICACIÓN SEMANAL
    ============================================================
    */

    const [
        planificacionSemanal,
        setPlanificacionSemanal
    ] = useState(
        () => {

            const semanaGuardada =
                localStorage.getItem(
                    "planificacionSemanalLifeTrack"
                );


            if (
                semanaGuardada
            ) {

                try {

                    return {

                        ...crearSemanaVacia(),

                        ...JSON.parse(
                            semanaGuardada
                        ),

                    };

                } catch (
                    error
                ) {

                    console.error(
                        "Error recuperando planificación semanal:",
                        error
                    );

                }

            }


            const actividadesAntiguas =
                localStorage.getItem(
                    "actividadesLifeTrack"
                );


            if (
                actividadesAntiguas
            ) {

                try {

                    const actividades =
                        JSON.parse(
                            actividadesAntiguas
                        );


                    return {

                        ...crearSemanaVacia(),

                        Lunes:
                            Array.isArray(
                                actividades
                            )

                                ? actividades

                                : actividadesIniciales,

                    };

                } catch (
                    error
                ) {

                    console.error(
                        "Error migrando planificación:",
                        error
                    );

                }

            }


            return {

                ...crearSemanaVacia(),

                Lunes:
                    actividadesIniciales,

            };

        }
    );


    /*
    ============================================================
    GUARDAR
    ============================================================
    */

    useEffect(
        () => {

            localStorage.setItem(

                "planificacionSemanalLifeTrack",

                JSON.stringify(
                    planificacionSemanal
                )

            );

        },
        [
            planificacionSemanal
        ]
    );


    /*
    ============================================================
    CONTROL DEL MODAL
    ============================================================
    */

    useEffect(
        () => {

            if (
                !diaModal
            ) {

                return;

            }


            const cerrarConEscape =
                evento => {

                    if (
                        evento.key ===
                        "Escape"
                    ) {

                        setDiaModal(
                            null
                        );

                    }

                };


            window.addEventListener(
                "keydown",
                cerrarConEscape
            );


            return () => {

                window.removeEventListener(
                    "keydown",
                    cerrarConEscape
                );

            };

        },
        [
            diaModal
        ]
    );


    /*
    ============================================================
    ACTIVIDADES DEL DÍA
    ============================================================
    */

    const actividades =

        planificacionSemanal[
            diaSeleccionado
        ] || [];


    /*
    ============================================================
    ACTUALIZAR DÍA
    ============================================================
    */

    const actualizarActividadesDelDia =
        (
            actualizador
        ) => {

            setPlanificacionSemanal(
                estadoActual => {

                    const actuales =

                        estadoActual[
                            diaSeleccionado
                        ] || [];


                    const nuevas =

                        typeof actualizador ===
                        "function"

                            ? actualizador(
                                actuales
                            )

                            : actualizador;


                    return {

                        ...estadoActual,

                        [diaSeleccionado]:
                            nuevas,

                    };

                }
            );

        };


    /*
    ============================================================
    FORMULARIO
    ============================================================
    */

    const [
        nuevaHora,
        setNuevaHora
    ] = useState(
        "08:00"
    );


    const [
        nuevoTitulo,
        setNuevoTitulo
    ] = useState("");


    const [
        nuevoDetalle,
        setNuevoDetalle
    ] = useState("");


    const [
        nuevaCategoria,
        setNuevaCategoria
    ] = useState(
        "Personal"
    );


    /*
    ============================================================
    EDICIÓN
    ============================================================
    */

    const [
        actividadEditando,
        setActividadEditando
    ] = useState(
        null
    );


    const [
        edicion,
        setEdicion
    ] = useState({

        hora: "",
        titulo: "",
        detalle: "",
        categoria: "Personal",

    });


    /*
    ============================================================
    HABLAR
    ============================================================
    */

    const hablar = (
        mensaje,
        alTerminar = null
    ) => {

        setMensajeVoz(
            mensaje
        );


        if (
            !(
                "speechSynthesis" in window
            )
        ) {

            if (
                alTerminar
            ) {

                alTerminar();

            }


            return;

        }


        window.speechSynthesis.cancel();


        const voz =
            new SpeechSynthesisUtterance(
                mensaje
            );


        voz.lang =
            "es-CL";


        voz.rate =
            0.95;


        voz.pitch =
            1;


        if (
            alTerminar
        ) {

            voz.onend =
                alTerminar;

        }


        window.speechSynthesis.speak(
            voz
        );

    };


    /*
    ============================================================
    ESCUCHAR
    ============================================================
    */

    const escuchar = (
        paso
    ) => {

        const SpeechRecognition =

            window.SpeechRecognition
            ||
            window.webkitSpeechRecognition;


        if (
            !SpeechRecognition
        ) {

            setMensajeVoz(
                "Tu navegador no permite reconocimiento de voz. Prueba Google Chrome."
            );

            return;

        }


        const reconocimiento =
            new SpeechRecognition();


        reconocimiento.lang =
            "es-CL";


        reconocimiento.continuous =
            false;


        reconocimiento.interimResults =
            false;


        setEscuchando(
            true
        );


        reconocimiento.start();


        reconocimiento.onresult =
            evento => {

                const respuesta =

                    evento
                        .results[0][0]
                        .transcript
                        .trim();


                setUltimaRespuestaVoz(
                    respuesta
                );


                setEscuchando(
                    false
                );


                procesarRespuestaVoz(
                    paso,
                    respuesta
                );

            };


        reconocimiento.onerror =
            error => {

                console.error(
                    "Error de reconocimiento:",
                    error
                );


                setEscuchando(
                    false
                );


                setMensajeVoz(
                    "No pude escuchar bien. Presiona el micrófono para intentarlo nuevamente."
                );

            };


        reconocimiento.onend =
            () => {

                setEscuchando(
                    false
                );

            };

    };


    /*
    ============================================================
    HACER PREGUNTA
    ============================================================
    */

    const hacerPreguntaVoz = (
        paso
    ) => {

        let pregunta =
            "";


        if (
            paso === "titulo"
        ) {

            pregunta =
                "¿Qué actividad quieres agregar?";

        }


        if (
            paso === "dia"
        ) {

            pregunta =
                "¿Qué día quieres agregarla? Puedes decir lunes, martes, miércoles, jueves, viernes, sábado, domingo, hoy o mañana.";

        }


        if (
            paso === "hora"
        ) {

            pregunta =
                "¿A qué hora quieres realizarla?";

        }


        if (
            paso === "categoria"
        ) {

            pregunta =
                "¿Qué categoría corresponde? Trabajo, estudios, gimnasio, boxeo, personal, finanzas o remedios.";

        }


        if (
            paso === "detalle"
        ) {

            pregunta =
                "¿Quieres agregar una descripción? Si no quieres, di sin descripción.";

        }


        setPasoVoz(
            paso
        );


        hablar(
            pregunta,
            () =>
                escuchar(
                    paso
                )
        );

    };


    /*
    ============================================================
    PROCESAR RESPUESTA
    ============================================================
    */

    const procesarRespuestaVoz = (
        paso,
        respuesta
    ) => {


        if (
            paso === "titulo"
        ) {

            setActividadVoz(
                actual => ({
                    ...actual,
                    titulo:
                        respuesta,
                })
            );


            hacerPreguntaVoz(
                "dia"
            );

            return;

        }


        if (
            paso === "dia"
        ) {

            const diaDetectado =
                interpretarDiaVoz(
                    respuesta
                );


            if (
                !diaDetectado
            ) {

                hablar(
                    "No entendí el día. Intenta decir lunes, martes, miércoles, jueves, viernes, sábado, domingo, hoy o mañana.",
                    () =>
                        escuchar(
                            "dia"
                        )
                );

                return;

            }


            setActividadVoz(
                actual => ({
                    ...actual,
                    dia:
                        diaDetectado,
                })
            );


            hacerPreguntaVoz(
                "hora"
            );

            return;

        }


        if (
            paso === "hora"
        ) {

            const horaDetectada =
                interpretarHoraVoz(
                    respuesta
                );


            if (
                !horaDetectada
            ) {

                hablar(
                    "No entendí la hora. Puedes decir por ejemplo siete de la mañana, seis y media de la tarde o veintiuna treinta.",
                    () =>
                        escuchar(
                            "hora"
                        )
                );

                return;

            }


            setActividadVoz(
                actual => ({
                    ...actual,
                    hora:
                        horaDetectada,
                })
            );


            hacerPreguntaVoz(
                "categoria"
            );

            return;

        }


        if (
            paso === "categoria"
        ) {

            const categoriaDetectada =
                interpretarCategoriaVoz(
                    respuesta
                );


            if (
                !categoriaDetectada
            ) {

                hablar(
                    "No reconocí la categoría. Puedes decir trabajo, estudios, gimnasio, boxeo, personal, finanzas o remedios.",
                    () =>
                        escuchar(
                            "categoria"
                        )
                );

                return;

            }


            setActividadVoz(
                actual => ({
                    ...actual,
                    categoria:
                        categoriaDetectada,
                })
            );


            hacerPreguntaVoz(
                "detalle"
            );

            return;

        }


        if (
            paso === "detalle"
        ) {

            const respuestaLimpia =
                respuesta.toLowerCase();


            const sinDescripcion =

                respuestaLimpia.includes(
                    "sin descripción"
                )

                ||

                respuestaLimpia.includes(
                    "sin descripcion"
                )

                ||

                respuestaLimpia ===
                    "no";


            setActividadVoz(
                actual => ({
                    ...actual,

                    detalle:

                        sinDescripcion

                            ? ""

                            : respuesta,

                })
            );


            setPasoVoz(
                "confirmacion"
            );


            hablar(
                "Listo. Revisa los datos y presiona confirmar actividad."
            );

        }

    };


    /*
    ============================================================
    INICIAR ASISTENTE
    ============================================================
    */

    const iniciarAsistenteVoz =
        () => {

            setAsistenteVozAbierto(
                true
            );


            setUltimaRespuestaVoz(
                ""
            );


            setActividadVoz({

                titulo: "",
                dia:
                    diaSeleccionado,
                hora: "",
                categoria:
                    "Personal",
                detalle: "",

            });


            setTimeout(
                () => {

                    hacerPreguntaVoz(
                        "titulo"
                    );

                },
                300
            );

        };


    /*
    ============================================================
    CERRAR ASISTENTE
    ============================================================
    */

    const cerrarAsistenteVoz =
        () => {

            if (
                "speechSynthesis" in window
            ) {

                window
                    .speechSynthesis
                    .cancel();

            }


            setEscuchando(
                false
            );


            setAsistenteVozAbierto(
                false
            );


            setPasoVoz(
                "inicio"
            );

        };


    /*
    ============================================================
    CONFIRMAR ACTIVIDAD POR VOZ
    ============================================================
    */

    const confirmarActividadVoz =
        () => {


            if (
                !actividadVoz.titulo
                ||
                !actividadVoz.dia
                ||
                !actividadVoz.hora
            ) {

                return;

            }


            const nuevaActividad = {

                id:
                    Date.now(),

                hora:
                    actividadVoz.hora,

                categoria:
                    actividadVoz.categoria,

                icono:
                    obtenerIcono(
                        actividadVoz.categoria
                    ),

                titulo:
                    actividadVoz.titulo,

                detalle:
                    actividadVoz.detalle ||
                    "Actividad personal",

                realizado:
                    false,

            };


            setPlanificacionSemanal(
                estadoActual => {

                    const actividadesDia =

                        estadoActual[
                            actividadVoz.dia
                        ] || [];


                    return {

                        ...estadoActual,

                        [actividadVoz.dia]:
                            [
                                ...actividadesDia,
                                nuevaActividad,
                            ],

                    };

                }
            );


            setDiaSeleccionado(
                actividadVoz.dia
            );


            hablar(
                "Actividad agregada correctamente."
            );


            setAsistenteVozAbierto(
                false
            );

        };


    /*
    ============================================================
    CAMBIAR DÍA
    ============================================================
    */

    const cambiarDia = (
        dia
    ) => {

        setDiaSeleccionado(
            dia
        );


        setActividadEditando(
            null
        );

    };


    /*
    ============================================================
    AGREGAR ACTIVIDAD MANUAL
    ============================================================
    */

    const agregarActividad = (
        evento
    ) => {

        evento.preventDefault();


        const tituloLimpio =
            nuevoTitulo.trim();


        if (
            !tituloLimpio
        ) {

            return;

        }


        const nuevaActividad = {

            id:
                Date.now(),

            hora:
                nuevaHora,

            categoria:
                nuevaCategoria,

            icono:
                obtenerIcono(
                    nuevaCategoria
                ),

            titulo:
                tituloLimpio,

            detalle:
                nuevoDetalle.trim() ||
                "Actividad personal",

            realizado:
                false,

        };


        actualizarActividadesDelDia(
            actual => [
                ...actual,
                nuevaActividad,
            ]
        );


        setNuevaHora(
            "08:00"
        );


        setNuevoTitulo(
            ""
        );


        setNuevoDetalle(
            ""
        );


        setNuevaCategoria(
            "Personal"
        );

    };


    /*
    ============================================================
    CAMBIAR ESTADO
    ============================================================
    */

    const cambiarEstado = (
        id
    ) => {

        actualizarActividadesDelDia(
            actual =>

                actual.map(
                    actividad =>

                        actividad.id === id

                            ? {

                                ...actividad,

                                realizado:
                                    !actividad.realizado,

                            }

                            : actividad
                )
        );

    };


    /*
    ============================================================
    ELIMINAR
    ============================================================
    */

    const eliminarActividad = (
        id
    ) => {

        actualizarActividadesDelDia(
            actual =>

                actual.filter(
                    actividad =>
                        actividad.id !== id
                )
        );


        if (
            actividadEditando === id
        ) {

            setActividadEditando(
                null
            );

        }

    };


    /*
    ============================================================
    EDITAR
    ============================================================
    */

    const iniciarEdicion = (
        actividad
    ) => {

        setActividadEditando(
            actividad.id
        );


        setEdicion({

            hora:
                actividad.hora,

            titulo:
                actividad.titulo,

            detalle:
                actividad.detalle,

            categoria:
                actividad.categoria ||
                "Personal",

        });

    };


    const cancelarEdicion =
        () => {

            setActividadEditando(
                null
            );

        };


    const guardarEdicion = (
        id
    ) => {

        const tituloLimpio =
            edicion.titulo.trim();


        if (
            !tituloLimpio
        ) {

            return;

        }


        actualizarActividadesDelDia(
            actual =>

                actual.map(
                    actividad =>

                        actividad.id === id

                            ? {

                                ...actividad,

                                hora:
                                    edicion.hora,

                                titulo:
                                    tituloLimpio,

                                detalle:
                                    edicion.detalle.trim() ||
                                    "Actividad personal",

                                categoria:
                                    edicion.categoria,

                                icono:
                                    obtenerIcono(
                                        edicion.categoria
                                    ),

                            }

                            : actividad
                )
        );


        setActividadEditando(
            null
        );

    };


    /*
    ============================================================
    ORDENAR ACTIVIDADES
    ============================================================
    */

    const actividadesOrdenadas =

        [...actividades].sort(
            (
                a,
                b
            ) =>
                a.hora.localeCompare(
                    b.hora
                )
        );


    /*
    ============================================================
    PROGRESO DIARIO
    ============================================================
    */

    const totalActividades =
        actividades.length;


    const actividadesCompletadas =

        actividades.filter(
            actividad =>
                actividad.realizado
        ).length;


    const porcentaje =

        totalActividades === 0

            ? 0

            : Math.round(

                (
                    actividadesCompletadas /
                    totalActividades
                )
                *
                100

            );


    /*
    ============================================================
    SEMANA
    ============================================================
    */

    const totalActividadesSemana =

        diasSemana.reduce(
            (
                total,
                dia
            ) =>

                total +
                (
                    planificacionSemanal[
                        dia
                    ]?.length || 0
                ),

            0
        );


    const completadasSemana =

        diasSemana.reduce(
            (
                total,
                dia
            ) => {

                const completadas =

                    (
                        planificacionSemanal[
                            dia
                        ] || []
                    ).filter(
                        actividad =>
                            actividad.realizado
                    ).length;


                return (
                    total +
                    completadas
                );

            },
            0
        );


    /*
    ============================================================
    MENSAJE
    ============================================================
    */

    const obtenerMensaje =
        () => {


            if (
                porcentaje === 100 &&
                totalActividades > 0
            ) {

                return {

                    titulo:
                        "¡Día completado!",

                    texto:
                        `Cumpliste todos tus objetivos del ${diaSeleccionado.toLowerCase()}.`,

                };

            }


            if (
                porcentaje >= 75
            ) {

                return {

                    titulo:
                        "Excelente progreso",

                    texto:
                        "Ya completaste gran parte de tu rutina.",

                };

            }


            if (
                porcentaje >= 50
            ) {

                return {

                    titulo:
                        "Vas por buen camino",

                    texto:
                        `${actividadesCompletadas} de ${totalActividades} actividades completadas.`,

                };

            }


            if (
                porcentaje > 0
            ) {

                return {

                    titulo:
                        "Buen comienzo",

                    texto:
                        "Cada actividad completada suma a tu progreso.",

                };

            }


            return {

                titulo:
                    "Comienza tu día",

                texto:
                    "Marca cada actividad cuando la completes y observa tu progreso.",

            };

        };


    const mensaje =
        obtenerMensaje();


    /*
    ============================================================
    MODAL SEMANAL
    ============================================================
    */

    const actividadesModal =

        diaModal

            ? [
                ...(
                    planificacionSemanal[
                        diaModal
                    ] || []
                )
            ].sort(
                (
                    a,
                    b
                ) =>
                    a.hora.localeCompare(
                        b.hora
                    )
            )

            : [];


    const completadasModal =

        actividadesModal.filter(
            actividad =>
                actividad.realizado
        ).length;


    const porcentajeModal =

        actividadesModal.length === 0

            ? 0

            : Math.round(

                (
                    completadasModal /
                    actividadesModal.length
                )
                *
                100

            );


    /*
    ============================================================
    RETURN
    ============================================================
    */

    return (

        <main className="dia-page">


            {/* HERO */}

            <section

                className="dia-hero"

                style={{
                    backgroundImage:
                        `url(${heroMontanas})`,
                }}

            >

                <div
                    className="dia-hero-overlay"
                ></div>


                <div
                    className="dia-container dia-hero-content"
                >

                    <span className="dia-label">
                        MI DÍA
                    </span>


                    <h1>

                        Organiza hoy.

                        <br />

                        <strong>
                            Avanza mañana.
                        </strong>

                    </h1>


                    <p>

                        Mantén el equilibrio entre trabajo,
                        estudios, gimnasio, boxeo, finanzas,
                        salud y vida personal.

                    </p>

                </div>

            </section>


            <section className="dia-dashboard">


                {/* SELECTOR SEMANA */}

                <div className="dia-container">


                    <section className="selector-semana-card">


                        <div className="selector-semana-header">


                            <div>

                                <span className="mini-label">
                                    PLANIFICACIÓN SEMANAL
                                </span>

                                <h2>
                                    ¿Qué día quieres organizar?
                                </h2>

                            </div>


                            <div

                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "12px",

                                    flexWrap:
                                        "wrap",
                                }}

                            >


                                <button

                                    type="button"

                                    onClick={
                                        iniciarAsistenteVoz
                                    }

                                    style={{

                                        minHeight:
                                            "44px",

                                        padding:
                                            "0 18px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "999px",

                                        background:
                                            "#1769ff",

                                        color:
                                            "#ffffff",

                                        fontWeight:
                                            "900",

                                        cursor:
                                            "pointer",

                                    }}

                                >

                                    🎙️ Agregar por voz

                                </button>


                                <strong>

                                    {diaSeleccionado}

                                </strong>


                            </div>


                        </div>


                        <div className="selector-dias">


                            {

                                diasSemana.map(
                                    dia => (

                                        <button

                                            type="button"

                                            key={
                                                dia
                                            }

                                            className={
                                                diaSeleccionado === dia

                                                    ? "dia-selector activo"

                                                    : "dia-selector"
                                            }

                                            onClick={
                                                () =>
                                                    cambiarDia(
                                                        dia
                                                    )
                                            }

                                        >

                                            <span>

                                                {
                                                    dia.substring(
                                                        0,
                                                        3
                                                    )
                                                }

                                            </span>


                                            <strong>

                                                {
                                                    planificacionSemanal[
                                                        dia
                                                    ]?.length || 0
                                                }

                                            </strong>


                                            <small>
                                                actividades
                                            </small>

                                        </button>

                                    )
                                )
                            }

                        </div>

                    </section>

                </div>


                {/* PLANIFICACIÓN */}

                <div className="dia-container dia-grid">


                    <section className="dia-card agenda-card">


                        <div className="dia-card-header">

                            <div>

                                <span className="mini-label">
                                    ORDEN DEL DÍA
                                </span>

                                <h2>

                                    Mi planificación — {diaSeleccionado}

                                </h2>

                            </div>


                            <strong>
                                {diaSeleccionado}
                            </strong>

                        </div>


                        {/* FORMULARIO */}

                        <form

                            className="agenda-form"

                            onSubmit={
                                agregarActividad
                            }

                        >

                            <input

                                type="time"

                                value={
                                    nuevaHora
                                }

                                onChange={
                                    evento =>
                                        setNuevaHora(
                                            evento.target.value
                                        )
                                }

                            />


                            <input

                                type="text"

                                placeholder="Nombre de la actividad"

                                value={
                                    nuevoTitulo
                                }

                                onChange={
                                    evento =>
                                        setNuevoTitulo(
                                            evento.target.value
                                        )
                                }

                            />


                            <input

                                type="text"

                                placeholder="Detalle"

                                value={
                                    nuevoDetalle
                                }

                                onChange={
                                    evento =>
                                        setNuevoDetalle(
                                            evento.target.value
                                        )
                                }

                            />


                            <select

                                value={
                                    nuevaCategoria
                                }

                                onChange={
                                    evento =>
                                        setNuevaCategoria(
                                            evento.target.value
                                        )
                                }

                            >

                                {
                                    categorias.map(
                                        categoria => (

                                            <option

                                                key={
                                                    categoria
                                                }

                                                value={
                                                    categoria
                                                }

                                            >

                                                {
                                                    obtenerIcono(
                                                        categoria
                                                    )
                                                }

                                                {" "}

                                                {categoria}

                                            </option>

                                        )
                                    )
                                }

                            </select>


                            <button type="submit">
                                + Agregar
                            </button>

                        </form>


                        {/* LISTADO */}

                        <div className="agenda-list">


                            {
                                actividadesOrdenadas.map(
                                    actividad => (

                                        <article

                                            key={
                                                actividad.id
                                            }

                                            className={
                                                `agenda-item ${
                                                    actividad.realizado
                                                        ? "actividad-realizada"
                                                        : ""
                                                }`
                                            }

                                        >


                                            <button

                                                type="button"

                                                className={
                                                    `agenda-check ${
                                                        actividad.realizado
                                                            ? "checked"
                                                            : ""
                                                    }`
                                                }

                                                onClick={
                                                    () =>
                                                        cambiarEstado(
                                                            actividad.id
                                                        )
                                                }

                                            >

                                                {
                                                    actividad.realizado
                                                        ? "✓"
                                                        : ""
                                                }

                                            </button>


                                            {

                                                actividadEditando ===
                                                actividad.id

                                                    ? (

                                                        <div className="agenda-edit-form">


                                                            <input

                                                                type="time"

                                                                value={
                                                                    edicion.hora
                                                                }

                                                                onChange={
                                                                    evento =>
                                                                        setEdicion(
                                                                            {
                                                                                ...edicion,
                                                                                hora:
                                                                                    evento.target.value,
                                                                            }
                                                                        )
                                                                }

                                                            />


                                                            <input

                                                                type="text"

                                                                value={
                                                                    edicion.titulo
                                                                }

                                                                onChange={
                                                                    evento =>
                                                                        setEdicion(
                                                                            {
                                                                                ...edicion,
                                                                                titulo:
                                                                                    evento.target.value,
                                                                            }
                                                                        )
                                                                }

                                                            />


                                                            <input

                                                                type="text"

                                                                value={
                                                                    edicion.detalle
                                                                }

                                                                onChange={
                                                                    evento =>
                                                                        setEdicion(
                                                                            {
                                                                                ...edicion,
                                                                                detalle:
                                                                                    evento.target.value,
                                                                            }
                                                                        )
                                                                }

                                                            />


                                                            <select

                                                                value={
                                                                    edicion.categoria
                                                                }

                                                                onChange={
                                                                    evento =>
                                                                        setEdicion(
                                                                            {
                                                                                ...edicion,
                                                                                categoria:
                                                                                    evento.target.value,
                                                                            }
                                                                        )
                                                                }

                                                            >

                                                                {
                                                                    categorias.map(
                                                                        categoria => (

                                                                            <option
                                                                                key={categoria}
                                                                                value={categoria}
                                                                            >

                                                                                {
                                                                                    obtenerIcono(
                                                                                        categoria
                                                                                    )
                                                                                }

                                                                                {" "}

                                                                                {categoria}

                                                                            </option>

                                                                        )
                                                                    )
                                                                }

                                                            </select>


                                                            <div className="agenda-edit-actions">

                                                                <button

                                                                    type="button"

                                                                    className="agenda-save"

                                                                    onClick={
                                                                        () =>
                                                                            guardarEdicion(
                                                                                actividad.id
                                                                            )
                                                                    }

                                                                >
                                                                    Guardar
                                                                </button>


                                                                <button

                                                                    type="button"

                                                                    className="agenda-cancel"

                                                                    onClick={
                                                                        cancelarEdicion
                                                                    }

                                                                >
                                                                    Cancelar
                                                                </button>

                                                            </div>

                                                        </div>

                                                    )

                                                    : (

                                                        <>

                                                            <div className="agenda-hora">

                                                                {
                                                                    actividad.hora
                                                                }

                                                            </div>


                                                            <div className="agenda-icono">

                                                                {
                                                                    actividad.icono
                                                                }

                                                            </div>


                                                            <div className="agenda-info">

                                                                <strong>

                                                                    {
                                                                        actividad.titulo
                                                                    }

                                                                </strong>

                                                                <span>

                                                                    {
                                                                        actividad.detalle
                                                                    }

                                                                </span>

                                                                <small>

                                                                    {
                                                                        actividad.categoria
                                                                    }

                                                                </small>

                                                            </div>


                                                            <div className="agenda-actions">

                                                                <div

                                                                    className={
                                                                        actividad.realizado
                                                                            ? "agenda-estado completado"
                                                                            : "agenda-estado pendiente"
                                                                    }

                                                                >

                                                                    {
                                                                        actividad.realizado
                                                                            ? "Completado"
                                                                            : "Pendiente"
                                                                    }

                                                                </div>


                                                                <button

                                                                    type="button"

                                                                    className="agenda-edit"

                                                                    onClick={
                                                                        () =>
                                                                            iniciarEdicion(
                                                                                actividad
                                                                            )
                                                                    }

                                                                >
                                                                    Editar
                                                                </button>


                                                                <button

                                                                    type="button"

                                                                    className="agenda-delete"

                                                                    onClick={
                                                                        () =>
                                                                            eliminarActividad(
                                                                                actividad.id
                                                                            )
                                                                    }

                                                                >
                                                                    Eliminar
                                                                </button>

                                                            </div>

                                                        </>

                                                    )
                                            }

                                        </article>

                                    )
                                )
                            }

                        </div>


                        {
                            actividadesOrdenadas.length === 0 && (

                                <div className="agenda-vacia">

                                    <div>
                                        📅
                                    </div>

                                    <strong>

                                        Aún no tienes actividades para {diaSeleccionado}.

                                    </strong>

                                    <span>

                                        Puedes agregarlas manualmente
                                        o usando 🎙️ LifeTrack Voice.

                                    </span>

                                </div>

                            )
                        }

                    </section>


                    {/* DERECHA */}

                    <aside className="dia-side">


                        <section className="dia-card progreso-card">

                            <span className="mini-label">

                                PROGRESO DEL {diaSeleccionado.toUpperCase()}

                            </span>


                            <div className="progreso-layout">

                                <div

                                    className="circulo-progreso"

                                    style={{
                                        "--progreso":
                                            `${porcentaje * 3.6}deg`,
                                    }}

                                >

                                    <div className="circulo-interior">

                                        <div className="numero-porcentaje">

                                            <span>
                                                {porcentaje}
                                            </span>

                                            <span>
                                                %
                                            </span>

                                        </div>

                                        <small>
                                            completado
                                        </small>

                                    </div>

                                </div>


                                <div className="progreso-texto">

                                    <h3>
                                        {mensaje.titulo}
                                    </h3>

                                    <p>
                                        {mensaje.texto}
                                    </p>

                                </div>

                            </div>

                        </section>


                        <section className="dia-card habitos-card">

                            <span className="mini-label">
                                ACTIVIDADES
                            </span>

                            <h2>
                                Hábitos del {diaSeleccionado}
                            </h2>


                            {
                                actividadesOrdenadas.map(
                                    actividad => (

                                        <div

                                            className="habito-item"

                                            key={
                                                `habito-${actividad.id}`
                                            }

                                        >

                                            <div className="habito-row">

                                                <span>

                                                    {
                                                        actividad.icono
                                                    }

                                                    {" "}

                                                    {
                                                        actividad.titulo
                                                    }

                                                </span>

                                                <strong>

                                                    {
                                                        actividad.realizado
                                                            ? "100%"
                                                            : "0%"
                                                    }

                                                </strong>

                                            </div>


                                            <div className="progress-line">

                                                <div

                                                    style={{
                                                        width:
                                                            actividad.realizado
                                                                ? "100%"
                                                                : "0%",
                                                    }}

                                                ></div>

                                            </div>

                                        </div>

                                    )
                                )
                            }

                        </section>

                    </aside>

                </div>


                {/* RESUMEN */}

                <div className="dia-container">

                    <section className="dia-card dia-resumen">

                        <div>

                            <span className="mini-label">

                                RESUMEN DEL {diaSeleccionado.toUpperCase()}

                            </span>

                            <h2>
                                Tu progreso de hoy
                            </h2>

                            <p>

                                Cada check actualiza automáticamente
                                el progreso del día seleccionado.

                            </p>

                        </div>


                        <div className="dia-resumen-numeros">

                            <div>

                                <strong>
                                    {totalActividades}
                                </strong>

                                <span>
                                    Actividades
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {actividadesCompletadas}
                                </strong>

                                <span>
                                    Completadas
                                </span>

                            </div>


                            <div>

                                <strong>

                                    {
                                        totalActividades -
                                        actividadesCompletadas
                                    }

                                </strong>

                                <span>
                                    Pendientes
                                </span>

                            </div>


                            <div>

                                <strong>
                                    {porcentaje}%
                                </strong>

                                <span>
                                    Progreso
                                </span>

                            </div>

                        </div>

                    </section>

                </div>


                {/* SEMANA COMPLETA */}

                <div className="dia-container">

                    <section className="dia-card semana-completa">

                        <div className="semana-completa-header">

                            <div>

                                <span className="mini-label">
                                    MI PLANIFICACIÓN SEMANAL
                                </span>

                                <h2>
                                    Toda tu semana en un solo lugar
                                </h2>

                                <p>

                                    Haz clic sobre cualquier día para verlo en grande.

                                </p>

                            </div>


                            <div className="semana-resumen-general">

                                <div>

                                    <strong>
                                        {totalActividadesSemana}
                                    </strong>

                                    <span>
                                        Actividades
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        {completadasSemana}
                                    </strong>

                                    <span>
                                        Completadas
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="semana-grid">

                            {
                                diasSemana.map(
                                    dia => {

                                        const actividadesDia =
                                            [
                                                ...(
                                                    planificacionSemanal[
                                                        dia
                                                    ] || []
                                                )
                                            ].sort(
                                                (
                                                    a,
                                                    b
                                                ) =>
                                                    a.hora.localeCompare(
                                                        b.hora
                                                    )
                                            );


                                        return (

                                            <article

                                                className={
                                                    diaSeleccionado === dia
                                                        ? "semana-dia-card seleccionado"
                                                        : "semana-dia-card"
                                                }

                                                key={dia}

                                                role="button"

                                                tabIndex="0"

                                                onClick={
                                                    () =>
                                                        setDiaModal(
                                                            dia
                                                        )
                                                }

                                            >

                                                <div className="semana-dia-header">

                                                    <div>

                                                        <span>
                                                            {dia}
                                                        </span>

                                                        <strong>
                                                            {actividadesDia.length}
                                                        </strong>

                                                    </div>

                                                    <small>
                                                        Ver día completo ↗
                                                    </small>

                                                </div>


                                                <div className="semana-dia-lista">

                                                    {
                                                        actividadesDia.length === 0

                                                            ? (

                                                                <div className="semana-sin-actividad">

                                                                    Sin actividades planificadas.

                                                                </div>

                                                            )

                                                            : (

                                                                actividadesDia.map(
                                                                    actividad => (

                                                                        <div

                                                                            className={
                                                                                actividad.realizado
                                                                                    ? "semana-actividad completada"
                                                                                    : "semana-actividad"
                                                                            }

                                                                            key={
                                                                                `${dia}-${actividad.id}`
                                                                            }

                                                                        >

                                                                            <div className="semana-actividad-hora">
                                                                                {actividad.hora}
                                                                            </div>

                                                                            <div className="semana-actividad-icono">
                                                                                {actividad.icono}
                                                                            </div>

                                                                            <div className="semana-actividad-info">

                                                                                <strong>
                                                                                    {actividad.titulo}
                                                                                </strong>

                                                                                <span>
                                                                                    {actividad.categoria}
                                                                                </span>

                                                                            </div>

                                                                            <div className="semana-actividad-check">

                                                                                {
                                                                                    actividad.realizado
                                                                                        ? "✓"
                                                                                        : ""
                                                                                }

                                                                            </div>

                                                                        </div>

                                                                    )
                                                                )

                                                            )
                                                    }

                                                </div>

                                            </article>

                                        );

                                    }
                                )
                            }

                        </div>

                    </section>

                </div>

            </section>


            {/* MODAL DÍA */}

            {
                diaModal && (

                    <div

                        className="dia-modal-overlay"

                        onClick={
                            () =>
                                setDiaModal(
                                    null
                                )
                        }

                    >

                        <section

                            className="dia-modal"

                            onClick={
                                evento =>
                                    evento.stopPropagation()
                            }

                        >

                            <button

                                type="button"

                                className="dia-modal-cerrar"

                                onClick={
                                    () =>
                                        setDiaModal(
                                            null
                                        )
                                }

                            >
                                ×
                            </button>


                            <div className="dia-modal-header">

                                <span className="mini-label">
                                    MI PLANIFICACIÓN
                                </span>

                                <h2>
                                    {diaModal}
                                </h2>

                                <p>
                                    Vista completa de tu planificación del día.
                                </p>

                            </div>


                            <div className="dia-modal-progreso">

                                <div

                                    className="dia-modal-circle"

                                    style={{
                                        "--modal-progreso":
                                            `${porcentajeModal * 3.6}deg`,
                                    }}

                                >

                                    <div>

                                        <strong>
                                            {porcentajeModal}%
                                        </strong>

                                        <span>
                                            completado
                                        </span>

                                    </div>

                                </div>


                                <div className="dia-modal-estadisticas">

                                    <div>

                                        <strong>
                                            {actividadesModal.length}
                                        </strong>

                                        <span>
                                            Actividades
                                        </span>

                                    </div>

                                    <div>

                                        <strong>
                                            {completadasModal}
                                        </strong>

                                        <span>
                                            Completadas
                                        </span>

                                    </div>

                                    <div>

                                        <strong>

                                            {
                                                actividadesModal.length -
                                                completadasModal
                                            }

                                        </strong>

                                        <span>
                                            Pendientes
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div className="dia-modal-lista">

                                {
                                    actividadesModal.map(
                                        actividad => (

                                            <article

                                                className={
                                                    actividad.realizado
                                                        ? "dia-modal-actividad completada"
                                                        : "dia-modal-actividad"
                                                }

                                                key={
                                                    actividad.id
                                                }

                                            >

                                                <div className="dia-modal-hora">
                                                    {actividad.hora}
                                                </div>

                                                <div className="dia-modal-icono">
                                                    {actividad.icono}
                                                </div>

                                                <div className="dia-modal-info">

                                                    <strong>
                                                        {actividad.titulo}
                                                    </strong>

                                                    <span>
                                                        {actividad.detalle}
                                                    </span>

                                                    <small>
                                                        {actividad.categoria}
                                                    </small>

                                                </div>

                                                <div

                                                    className={
                                                        actividad.realizado
                                                            ? "dia-modal-estado completado"
                                                            : "dia-modal-estado pendiente"
                                                    }

                                                >

                                                    {
                                                        actividad.realizado
                                                            ? "✓ Completado"
                                                            : "Pendiente"
                                                    }

                                                </div>

                                            </article>

                                        )
                                    )
                                }

                            </div>


                            <div className="dia-modal-footer">

                                <span>

                                    Para modificar este día utiliza
                                    "Mi planificación" en la parte superior.

                                </span>

                                <button

                                    type="button"

                                    onClick={
                                        () =>
                                            setDiaModal(
                                                null
                                            )
                                    }

                                >
                                    Cerrar
                                </button>

                            </div>

                        </section>

                    </div>

                )
            }


            {/* =================================================
                MODAL ASISTENTE DE VOZ
            ================================================= */}

            {
                asistenteVozAbierto && (

                    <div

                        style={{
                            position:
                                "fixed",

                            inset:
                                0,

                            zIndex:
                                99999,

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            padding:
                                "20px",

                            background:
                                "rgba(5,25,55,.72)",

                            backdropFilter:
                                "blur(7px)",
                        }}

                        onClick={
                            cerrarAsistenteVoz
                        }

                    >

                        <section

                            style={{
                                width:
                                    "min(620px, 100%)",

                                maxHeight:
                                    "90vh",

                                overflowY:
                                    "auto",

                                padding:
                                    "30px",

                                borderRadius:
                                    "26px",

                                background:
                                    "#ffffff",

                                boxShadow:
                                    "0 30px 80px rgba(0,0,0,.25)",
                            }}

                            onClick={
                                evento =>
                                    evento.stopPropagation()
                            }

                        >

                            <div

                                style={{
                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    gap:
                                        "20px",
                                }}

                            >

                                <div>

                                    <span className="mini-label">
                                        ASISTENTE DE VOZ
                                    </span>

                                    <h2

                                        style={{
                                            margin:
                                                "8px 0",

                                            color:
                                                "#0b2d61",

                                            fontSize:
                                                "30px",
                                        }}

                                    >

                                        🎙️ LifeTrack Voice

                                    </h2>

                                </div>


                                <button

                                    type="button"

                                    onClick={
                                        cerrarAsistenteVoz
                                    }

                                    style={{
                                        width:
                                            "40px",

                                        height:
                                            "40px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "50%",

                                        fontSize:
                                            "24px",

                                        cursor:
                                            "pointer",
                                    }}

                                >

                                    ×

                                </button>

                            </div>


                            <div

                                style={{
                                    marginTop:
                                        "20px",

                                    padding:
                                        "20px",

                                    borderRadius:
                                        "18px",

                                    background:
                                        escuchando
                                            ? "#eaf2ff"
                                            : "#f5f8fc",
                                }}

                            >

                                <div

                                    style={{
                                        fontSize:
                                            "42px",

                                        textAlign:
                                            "center",
                                    }}

                                >

                                    {
                                        escuchando
                                            ? "🎙️"
                                            : "🤖"
                                    }

                                </div>


                                <h3

                                    style={{
                                        color:
                                            "#0b2d61",

                                        textAlign:
                                            "center",
                                    }}

                                >

                                    {
                                        escuchando
                                            ? "Te estoy escuchando..."
                                            : mensajeVoz
                                    }

                                </h3>


                                {
                                    ultimaRespuestaVoz && (

                                        <p

                                            style={{
                                                textAlign:
                                                    "center",

                                                color:
                                                    "#62758e",
                                            }}

                                        >

                                            Escuché:
                                            {" "}

                                            <strong>

                                                “{ultimaRespuestaVoz}”

                                            </strong>

                                        </p>

                                    )
                                }

                            </div>


                            {/* RESUMEN */}

                            <div

                                style={{
                                    marginTop:
                                        "22px",

                                    display:
                                        "grid",

                                    gap:
                                        "11px",

                                    color:
                                        "#17396d",
                                }}

                            >

                                <div>

                                    <strong>
                                        📝 Actividad:
                                    </strong>

                                    {" "}

                                    {
                                        actividadVoz.titulo ||
                                        "—"
                                    }

                                </div>


                                <div>

                                    <strong>
                                        📅 Día:
                                    </strong>

                                    {" "}

                                    {
                                        actividadVoz.dia ||
                                        "—"
                                    }

                                </div>


                                <div>

                                    <strong>
                                        🕒 Hora:
                                    </strong>

                                    {" "}

                                    {
                                        actividadVoz.hora ||
                                        "—"
                                    }

                                </div>


                                <div>

                                    <strong>

                                        {
                                            obtenerIcono(
                                                actividadVoz.categoria
                                            )
                                        }

                                        {" "}

                                        Categoría:

                                    </strong>

                                    {" "}

                                    {
                                        actividadVoz.categoria
                                    }

                                </div>


                                <div>

                                    <strong>
                                        💬 Descripción:
                                    </strong>

                                    {" "}

                                    {
                                        actividadVoz.detalle ||
                                        "Sin descripción"
                                    }

                                </div>

                            </div>


                            {/* BOTONES */}

                            <div

                                style={{
                                    marginTop:
                                        "25px",

                                    display:
                                        "flex",

                                    gap:
                                        "10px",

                                    flexWrap:
                                        "wrap",
                                }}

                            >

                                {
                                    pasoVoz !==
                                    "confirmacion" && (

                                        <button

                                            type="button"

                                            disabled={
                                                escuchando
                                            }

                                            onClick={
                                                () =>
                                                    escuchar(
                                                        pasoVoz
                                                    )
                                            }

                                            style={{
                                                flex:
                                                    "1 1 180px",

                                                minHeight:
                                                    "48px",

                                                border:
                                                    "none",

                                                borderRadius:
                                                    "12px",

                                                background:
                                                    "#1769ff",

                                                color:
                                                    "white",

                                                fontWeight:
                                                    "900",

                                                cursor:
                                                    "pointer",
                                            }}

                                        >

                                            🎙️ Volver a hablar

                                        </button>

                                    )
                                }


                                {
                                    pasoVoz ===
                                    "confirmacion" && (

                                        <button

                                            type="button"

                                            onClick={
                                                confirmarActividadVoz
                                            }

                                            style={{
                                                flex:
                                                    "1 1 180px",

                                                minHeight:
                                                    "48px",

                                                border:
                                                    "none",

                                                borderRadius:
                                                    "12px",

                                                background:
                                                    "#1769ff",

                                                color:
                                                    "#ffffff",

                                                fontWeight:
                                                    "900",

                                                cursor:
                                                    "pointer",
                                            }}

                                        >

                                            ✅ Confirmar actividad

                                        </button>

                                    )
                                }


                                <button

                                    type="button"

                                    onClick={
                                        cerrarAsistenteVoz
                                    }

                                    style={{
                                        flex:
                                            "1 1 130px",

                                        minHeight:
                                            "48px",

                                        border:
                                            "1px solid #dce5ef",

                                        borderRadius:
                                            "12px",

                                        background:
                                            "#ffffff",

                                        color:
                                            "#536b89",

                                        fontWeight:
                                            "900",

                                        cursor:
                                            "pointer",
                                    }}

                                >

                                    Cancelar

                                </button>

                            </div>

                        </section>

                    </div>

                )
            }

        </main>

    );

}


export default MiDia;