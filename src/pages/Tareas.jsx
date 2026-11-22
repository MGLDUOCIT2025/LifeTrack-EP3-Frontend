/*
============================================================
TAREAS.JSX
LifeTrack
============================================================

FUNCIONES PRINCIPALES:

- Agregar tareas manualmente.
- Agregar tareas mediante voz.
- Navegar por fechas.
- Guardar tareas por día.
- Categorías:
    Trabajo
    Estudios
    Gimnasio
    Boxeo
    Personal
    Finanzas
    Remedios
- Hora.
- Fecha.
- Estado completado / pendiente.
- Filtros.
- Progreso diario.
- localStorage.
- Notificaciones internas.
- Notificaciones del navegador.
- Asistente de voz paso a paso.

============================================================
*/


import {
    useEffect,
    useMemo,
    useState
} from "react";


import "./TareasPremium.css";


import bannerBoxeo
    from "../assets/lifetrack/banner-boxeo.png";


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

const obtenerIconoCategoria = (
    categoria
) => {

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
        "📋"
    );

};


/*
============================================================
FECHA LOCAL
============================================================
*/

const obtenerFechaLocal = (
    fechaBase = new Date()
) => {

    const anio =
        fechaBase.getFullYear();


    const mes =
        String(
            fechaBase.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            fechaBase.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${anio}-${mes}-${dia}`;

};


/*
============================================================
SUMAR DÍAS
============================================================
*/

const sumarDias = (
    fecha,
    cantidad
) => {

    const nuevaFecha =
        new Date(fecha);


    nuevaFecha.setDate(
        nuevaFecha.getDate() +
        cantidad
    );


    return nuevaFecha;

};


/*
============================================================
INTERPRETAR FECHA HABLADA
============================================================
*/

const interpretarFechaVoz = (
    texto
) => {

    const limpio =
        texto
            .toLowerCase()
            .trim();


    const hoy =
        new Date();


    if (
        limpio.includes("hoy")
    ) {

        return obtenerFechaLocal(
            hoy
        );

    }


    if (
        limpio.includes(
            "pasado mañana"
        )
    ) {

        return obtenerFechaLocal(
            sumarDias(
                hoy,
                2
            )
        );

    }


    if (
        limpio.includes(
            "mañana"
        )
    ) {

        return obtenerFechaLocal(
            sumarDias(
                hoy,
                1
            )
        );

    }


    /*
    --------------------------------------------------------
    DÍAS DE LA SEMANA
    --------------------------------------------------------
    */

    const dias = {

        domingo: 0,
        lunes: 1,
        martes: 2,
        miércoles: 3,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sábado: 6,
        sabado: 6,

    };


    for (
        const [
            nombre,
            numero
        ]
        of Object.entries(
            dias
        )
    ) {

        if (
            limpio.includes(
                nombre
            )
        ) {

            const fecha =
                new Date();


            const hoyNumero =
                fecha.getDay();


            let diferencia =
                numero -
                hoyNumero;


            if (
                diferencia <= 0
            ) {

                diferencia += 7;

            }


            fecha.setDate(
                fecha.getDate() +
                diferencia
            );


            return obtenerFechaLocal(
                fecha
            );

        }

    }


    /*
    --------------------------------------------------------
    FECHA DD/MM/YYYY
    --------------------------------------------------------
    */

    const coincidencia =
        limpio.match(
            /(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{4})/
        );


    if (
        coincidencia
    ) {

        const dia =
            coincidencia[1]
                .padStart(
                    2,
                    "0"
                );


        const mes =
            coincidencia[2]
                .padStart(
                    2,
                    "0"
                );


        const anio =
            coincidencia[3];


        return `${anio}-${mes}-${dia}`;

    }


    return null;

};


/*
============================================================
INTERPRETAR HORA HABLADA
============================================================
*/

const interpretarHoraVoz = (
    texto
) => {

    let limpio =
        texto
            .toLowerCase()
            .trim();


    /*
    --------------------------------------------------------
    NORMALIZAR PALABRAS
    --------------------------------------------------------
    */

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
    FORMATO 21:30 / 21 30
    --------------------------------------------------------
    */

    const horaNumerica =
        limpio.match(
            /(\d{1,2})[:\s](\d{2})/
        );


    if (
        horaNumerica
    ) {

        let hora =
            Number(
                horaNumerica[1]
            );


        const minutos =
            Number(
                horaNumerica[2]
            );


        if (
            limpio.includes(
                "tarde"
            )
            ||
            limpio.includes(
                "noche"
            )
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


    /*
    --------------------------------------------------------
    HORA SIMPLE
    --------------------------------------------------------
    */

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

        const numeroDirecto =
            limpio.match(
                /\b([01]?\d|2[0-3])\b/
            );


        if (
            numeroDirecto
        ) {

            horaDetectada =
                Number(
                    numeroDirecto[1]
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


    /*
    --------------------------------------------------------
    MAÑANA / TARDE / NOCHE
    --------------------------------------------------------
    */

    if (
        limpio.includes(
            "tarde"
        )
        ||
        limpio.includes(
            "noche"
        )
    ) {

        if (
            horaDetectada < 12
        ) {

            horaDetectada += 12;

        }

    }


    if (
        limpio.includes(
            "mañana"
        )
        &&
        horaDetectada === 12
    ) {

        horaDetectada =
            0;

    }


    return (
        `${String(horaDetectada).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`
    );

};


/*
============================================================
INTERPRETAR CATEGORÍA
============================================================
*/

const interpretarCategoriaVoz = (
    texto
) => {

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
        limpio.includes("estudios")
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
        ||
        limpio.includes("entrenamiento")
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

};


/*
============================================================
COMPONENTE
============================================================
*/

function Tareas() {


    /*
    ============================================================
    FECHA SELECCIONADA
    ============================================================
    */

    const [
        fechaSeleccionada,
        setFechaSeleccionada
    ] = useState(
        obtenerFechaLocal()
    );


    /*
    ============================================================
    FORMULARIO MANUAL
    ============================================================
    */

    const [
        texto,
        setTexto
    ] = useState("");


    const [
        categoria,
        setCategoria
    ] = useState(
        "Personal"
    );


    const [
        fecha,
        setFecha
    ] = useState(
        obtenerFechaLocal()
    );


    const [
        hora,
        setHora
    ] = useState("");


    /*
    ============================================================
    FILTRO
    ============================================================
    */

    const [
        filtro,
        setFiltro
    ] = useState(
        "Todas"
    );


    /*
    ============================================================
    NOTIFICACIÓN INTERNA
    ============================================================
    */

    const [
        notificacionCerrada,
        setNotificacionCerrada
    ] = useState(
        false
    );


    /*
    ============================================================
    PERMISO NOTIFICACIONES
    ============================================================
    */

    const [
        permisoNotificaciones,
        setPermisoNotificaciones
    ] = useState(
        () => {

            if (
                "Notification" in window
            ) {

                return Notification.permission;

            }


            return "unsupported";

        }
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
        tareaVoz,
        setTareaVoz
    ] = useState({

        titulo: "",
        fecha: obtenerFechaLocal(),
        hora: "",
        categoria: "Personal",
        descripcion: "",

    });


    /*
    ============================================================
    RECUPERAR TAREAS
    ============================================================
    */

    const [
        tareas,
        setTareas
    ] = useState(
        () => {

            const tareasGuardadas =
                localStorage.getItem(
                    "tareasLifeTrack"
                );


            if (
                tareasGuardadas
            ) {

                try {

                    const tareasRecuperadas =
                        JSON.parse(
                            tareasGuardadas
                        );


                    return tareasRecuperadas.map(
                        tarea => ({

                            ...tarea,

                            fecha:
                                tarea.fecha ||
                                obtenerFechaLocal(),

                            hora:
                                tarea.hora || "",

                            categoria:
                                tarea.categoria ||
                                "Personal",

                            descripcion:
                                tarea.descripcion ||
                                "",

                        })
                    );

                } catch (
                    error
                ) {

                    console.error(
                        "Error recuperando tareas:",
                        error
                    );

                }

            }


            return [];

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
                "tareasLifeTrack",
                JSON.stringify(
                    tareas
                )
            );

        },
        [
            tareas
        ]
    );


    /*
    ============================================================
    SINCRONIZAR FECHA
    ============================================================
    */

    useEffect(
        () => {

            setFecha(
                fechaSeleccionada
            );


            setNotificacionCerrada(
                false
            );

        },
        [
            fechaSeleccionada
        ]
    );


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
    RECONOCIMIENTO DE VOZ
    ============================================================
    */

    const escuchar = (
        paso
    ) => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (
            !SpeechRecognition
        ) {

            setMensajeVoz(
                "Tu navegador no permite reconocimiento de voz. Prueba LifeTrack en Google Chrome."
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
                    evento.results[0][0]
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
                    "Error reconocimiento de voz:",
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
    PREGUNTAS DEL ASISTENTE
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
                "¿Qué tarea quieres agregar?";

        }


        if (
            paso === "fecha"
        ) {

            pregunta =
                "¿Para qué día quieres agregarla? Puedes decir hoy, mañana o un día de la semana.";

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
            paso === "descripcion"
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
    PROCESAR RESPUESTAS
    ============================================================
    */

    const procesarRespuestaVoz = (
        paso,
        respuesta
    ) => {

        if (
            paso === "titulo"
        ) {

            setTareaVoz(
                actual => ({
                    ...actual,
                    titulo:
                        respuesta,
                })
            );


            hacerPreguntaVoz(
                "fecha"
            );

            return;

        }


        if (
            paso === "fecha"
        ) {

            const fechaDetectada =
                interpretarFechaVoz(
                    respuesta
                );


            if (
                !fechaDetectada
            ) {

                hablar(
                    "No entendí la fecha. Intenta decir hoy, mañana, viernes o una fecha completa.",
                    () =>
                        escuchar(
                            "fecha"
                        )
                );

                return;

            }


            setTareaVoz(
                actual => ({
                    ...actual,
                    fecha:
                        fechaDetectada,
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
                    "No entendí la hora. Intenta decir por ejemplo siete de la tarde, ocho y media o veintiuna treinta.",
                    () =>
                        escuchar(
                            "hora"
                        )
                );

                return;

            }


            setTareaVoz(
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


            setTareaVoz(
                actual => ({
                    ...actual,
                    categoria:
                        categoriaDetectada,
                })
            );


            hacerPreguntaVoz(
                "descripcion"
            );

            return;

        }


        if (
            paso === "descripcion"
        ) {

            const sinDescripcion =
                respuesta
                    .toLowerCase()
                    .includes(
                        "sin descripción"
                    )
                ||
                respuesta
                    .toLowerCase()
                    .includes(
                        "sin descripcion"
                    )
                ||
                respuesta
                    .toLowerCase() ===
                    "no";


            setTareaVoz(
                actual => ({
                    ...actual,
                    descripcion:
                        sinDescripcion
                            ? ""
                            : respuesta,
                })
            );


            setPasoVoz(
                "confirmacion"
            );


            hablar(
                "Listo. Revisa los datos en pantalla y presiona confirmar para agregar la tarea."
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


            setTareaVoz({

                titulo: "",
                fecha:
                    fechaSeleccionada,
                hora: "",
                categoria:
                    "Personal",
                descripcion: "",

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

                window.speechSynthesis.cancel();

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
    CONFIRMAR TAREA POR VOZ
    ============================================================
    */

    const confirmarTareaVoz =
        () => {

            if (
                !tareaVoz.titulo
                ||
                !tareaVoz.fecha
            ) {

                return;

            }


            const nuevaTarea = {

                id:
                    Date.now(),

                titulo:
                    tareaVoz.titulo,

                fecha:
                    tareaVoz.fecha,

                hora:
                    tareaVoz.hora,

                categoria:
                    tareaVoz.categoria,

                descripcion:
                    tareaVoz.descripcion,

                completada:
                    false,

            };


            setTareas(
                actual => [
                    ...actual,
                    nuevaTarea,
                ]
            );


            setFechaSeleccionada(
                tareaVoz.fecha
            );


            setFiltro(
                "Todas"
            );


            hablar(
                "Tarea agregada correctamente."
            );


            setAsistenteVozAbierto(
                false
            );


            setNotificacionCerrada(
                false
            );

        };


    /*
    ============================================================
    FORMULARIO MANUAL
    ============================================================
    */

    const agregarTarea = (
        evento
    ) => {

        evento.preventDefault();


        const textoLimpio =
            texto.trim();


        if (
            !textoLimpio
        ) {

            return;

        }


        const fechaFinal =
            fecha ||
            fechaSeleccionada;


        const nuevaTarea = {

            id:
                Date.now(),

            titulo:
                textoLimpio,

            categoria,

            fecha:
                fechaFinal,

            hora,

            descripcion: "",

            completada:
                false,

        };


        setTareas(
            actual => [
                ...actual,
                nuevaTarea,
            ]
        );


        setFechaSeleccionada(
            fechaFinal
        );


        setTexto("");

        setCategoria(
            "Personal"
        );

        setHora("");

        setNotificacionCerrada(
            false
        );

    };


    /*
    ============================================================
    COMPLETAR
    ============================================================
    */

    const cambiarEstado = (
        id
    ) => {

        setTareas(
            actual =>
                actual.map(
                    tarea =>
                        tarea.id === id

                            ? {
                                ...tarea,
                                completada:
                                    !tarea.completada,
                            }

                            : tarea
                )
        );


        setNotificacionCerrada(
            false
        );

    };


    /*
    ============================================================
    ELIMINAR
    ============================================================
    */

    const eliminar = (
        id
    ) => {

        setTareas(
            actual =>
                actual.filter(
                    tarea =>
                        tarea.id !== id
                )
        );


        setNotificacionCerrada(
            false
        );

    };


    /*
    ============================================================
    CAMBIAR DÍA
    ============================================================
    */

    const cambiarDia = (
        cantidad
    ) => {

        const fechaBase =
            new Date(
                `${fechaSeleccionada}T12:00:00`
            );


        fechaBase.setDate(
            fechaBase.getDate() +
            cantidad
        );


        setFechaSeleccionada(
            obtenerFechaLocal(
                fechaBase
            )
        );


        setFiltro(
            "Todas"
        );

    };


    /*
    ============================================================
    HOY
    ============================================================
    */

    const irAHoy =
        () => {

            const hoy =
                obtenerFechaLocal();


            setFechaSeleccionada(
                hoy
            );


            setFecha(
                hoy
            );


            setFiltro(
                "Todas"
            );

        };


    /*
    ============================================================
    FECHA FORMATEADA
    ============================================================
    */

    const formatearFecha = (
        fechaTarea
    ) => {

        if (
            !fechaTarea
        ) {

            return "";

        }


        const [
            anio,
            mes,
            dia
        ] =
            fechaTarea.split("-");


        return `${dia}/${mes}/${anio}`;

    };


    /*
    ============================================================
    NOMBRE DEL DÍA
    ============================================================
    */

    const nombreDia =
        useMemo(
            () => {

                const fechaObjeto =
                    new Date(
                        `${fechaSeleccionada}T12:00:00`
                    );


                const nombre =
                    new Intl.DateTimeFormat(
                        "es-CL",
                        {
                            weekday:
                                "long",
                        }
                    ).format(
                        fechaObjeto
                    );


                return (
                    nombre
                        .charAt(0)
                        .toUpperCase()
                    +
                    nombre.slice(1)
                );

            },
            [
                fechaSeleccionada
            ]
        );


    /*
    ============================================================
    TAREAS DEL DÍA
    ============================================================
    */

    const tareasDelDia =
        tareas.filter(
            tarea =>
                tarea.fecha ===
                fechaSeleccionada
        );


    const tareasPendientes =
        tareasDelDia.filter(
            tarea =>
                !tarea.completada
        );


    const tareasPendientesOrdenadas =
        [...tareasPendientes]
            .sort(
                (
                    a,
                    b
                ) => {

                    if (
                        !a.hora
                        &&
                        !b.hora
                    ) {
                        return 0;
                    }


                    if (
                        !a.hora
                    ) {
                        return 1;
                    }


                    if (
                        !b.hora
                    ) {
                        return -1;
                    }


                    return (
                        a.hora.localeCompare(
                            b.hora
                        )
                    );

                }
            );


    const proximaTarea =
        tareasPendientesOrdenadas[0]
        ||
        null;


    /*
    ============================================================
    ESTADÍSTICAS
    ============================================================
    */

    const totalTareas =
        tareasDelDia.length;


    const completadas =
        tareasDelDia.filter(
            tarea =>
                tarea.completada
        ).length;


    const pendientes =
        tareasPendientes.length;


    const porcentaje =
        totalTareas === 0

            ? 0

            : Math.round(
                (
                    completadas /
                    totalTareas
                )
                *
                100
            );


    /*
    ============================================================
    NOTIFICACIONES
    ============================================================
    */

    const activarNotificaciones =
        async () => {

            if (
                !(
                    "Notification" in window
                )
            ) {

                setPermisoNotificaciones(
                    "unsupported"
                );

                return;

            }


            const permiso =
                await Notification
                    .requestPermission();


            setPermisoNotificaciones(
                permiso
            );


            if (
                permiso ===
                "granted"
            ) {

                new Notification(
                    "LifeTrack",
                    {
                        body:
                            "🔔 Notificaciones activadas correctamente.",
                    }
                );

            }

        };


    /*
    ============================================================
    FILTRO
    ============================================================
    */

    const tareasFiltradas =
        filtro === "Todas"

            ? tareasDelDia

            : tareasDelDia.filter(
                tarea =>
                    tarea.categoria ===
                    filtro
            );


    const tareasOrdenadas =
        [...tareasFiltradas]
            .sort(
                (
                    a,
                    b
                ) => {

                    if (
                        !a.hora &&
                        !b.hora
                    ) {
                        return 0;
                    }


                    if (
                        !a.hora
                    ) {
                        return 1;
                    }


                    if (
                        !b.hora
                    ) {
                        return -1;
                    }


                    return (
                        a.hora.localeCompare(
                            b.hora
                        )
                    );

                }
            );


    /*
    ============================================================
    MENSAJE DE PROGRESO
    ============================================================
    */

    const obtenerMensaje =
        () => {

            if (
                porcentaje === 100
                &&
                totalTareas > 0
            ) {

                return (
                    "¡Objetivos completados!"
                );

            }


            if (
                porcentaje >= 80
            ) {

                return (
                    "¡Excelente trabajo!"
                );

            }


            if (
                porcentaje >= 50
            ) {

                return (
                    "Vas por buen camino"
                );

            }


            if (
                porcentaje > 0
            ) {

                return (
                    "Buen comienzo"
                );

            }


            return (
                "Comienza con tu primera tarea"
            );

        };


    /*
    ============================================================
    RETURN
    ============================================================
    */

    return (

        <main className="task-page">


            {/* HERO */}

            <section

                className="task-hero"

                style={{
                    backgroundImage:
                        `url(${bannerBoxeo})`,
                }}

            >

                <div
                    className="task-hero-overlay"
                ></div>


                <div
                    className="
                        task-container
                        task-hero-content
                    "
                >

                    <span className="task-label">
                        MIS TAREAS
                    </span>


                    <h1>

                        Menos pendientes.

                        <br />

                        <strong>
                            Más progreso.
                        </strong>

                    </h1>


                    <p>

                        Organiza el detalle de cada día,
                        prioriza lo importante y avanza
                        una tarea a la vez.

                    </p>

                </div>

            </section>


            <section className="task-content">

                <div className="task-container">


                    {/* DÍA */}

                    <section className="task-day-card">

                        <div className="task-day-info">

                            <span>
                                TAREAS DEL DÍA
                            </span>

                            <h2>
                                {nombreDia}
                            </h2>

                            <strong>

                                {
                                    formatearFecha(
                                        fechaSeleccionada
                                    )
                                }

                            </strong>

                        </div>


                        <div className="task-day-right">


                            {/* MICRÓFONO */}

                            <button

                                type="button"

                                onClick={
                                    iniciarAsistenteVoz
                                }

                                style={{

                                    minHeight:
                                        "42px",

                                    padding:
                                        "0 18px",

                                    border:
                                        "none",

                                    borderRadius:
                                        "999px",

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

                                🎙️ Agregar por voz

                            </button>


                            {/* NOTIFICACIONES */}

                            <button

                                type="button"

                                className={
                                    permisoNotificaciones ===
                                    "granted"

                                        ? "task-browser-notification active"

                                        : "task-browser-notification"
                                }

                                onClick={
                                    activarNotificaciones
                                }

                            >

                                {
                                    permisoNotificaciones ===
                                    "granted"

                                        ? "🔔 Notificaciones activadas"

                                        : "🔔 Activar notificaciones"
                                }

                            </button>


                            <div className="task-day-controls">

                                <button
                                    type="button"
                                    onClick={
                                        () =>
                                            cambiarDia(
                                                -1
                                            )
                                    }
                                >
                                    ← Día anterior
                                </button>


                                <input

                                    type="date"

                                    value={
                                        fechaSeleccionada
                                    }

                                    onChange={
                                        evento => {

                                            setFechaSeleccionada(
                                                evento.target.value
                                            );

                                            setFiltro(
                                                "Todas"
                                            );

                                        }
                                    }

                                />


                                <button

                                    type="button"

                                    className="task-today-button"

                                    onClick={
                                        irAHoy
                                    }

                                >
                                    Hoy
                                </button>


                                <button

                                    type="button"

                                    onClick={
                                        () =>
                                            cambiarDia(
                                                1
                                            )
                                    }

                                >
                                    Día siguiente →
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* NOTIFICACIÓN INTERNA */}

                    {

                        !notificacionCerrada &&
                        totalTareas > 0 && (

                            <section

                                className={
                                    pendientes === 0
                                        ? "task-notification success"
                                        : "task-notification warning"
                                }

                            >

                                <div className="task-notification-icon">

                                    {
                                        pendientes === 0
                                            ? "✅"
                                            : "🔔"
                                    }

                                </div>


                                <div className="task-notification-content">

                                    <strong>

                                        {
                                            pendientes === 0

                                                ? "¡Todas las tareas del día están completadas!"

                                                : `Tienes ${pendientes} ${
                                                    pendientes === 1
                                                        ? "tarea pendiente"
                                                        : "tareas pendientes"
                                                }`
                                        }

                                    </strong>


                                    {

                                        pendientes > 0 &&
                                        proximaTarea && (

                                            <div className="task-next">

                                                <span>
                                                    Próxima tarea
                                                </span>


                                                <div>

                                                    <strong>

                                                        {
                                                            obtenerIconoCategoria(
                                                                proximaTarea.categoria
                                                            )
                                                        }

                                                        {" "}

                                                        {
                                                            proximaTarea.titulo
                                                        }

                                                    </strong>


                                                    <small>

                                                        {
                                                            proximaTarea.hora
                                                                ? `🕒 ${proximaTarea.hora}`
                                                                : "Sin hora definida"
                                                        }

                                                        {" · "}

                                                        {
                                                            proximaTarea.categoria
                                                        }

                                                    </small>

                                                </div>

                                            </div>

                                        )
                                    }

                                </div>


                                <button

                                    type="button"

                                    className="task-notification-close"

                                    onClick={
                                        () =>
                                            setNotificacionCerrada(
                                                true
                                            )
                                    }

                                >
                                    ×
                                </button>

                            </section>

                        )
                    }


                    {/* DASHBOARD */}

                    <div className="task-dashboard">

                        <article className="task-stat">

                            <div className="task-stat-icon">
                                📋
                            </div>

                            <div>

                                <strong>
                                    {totalTareas}
                                </strong>

                                <span>
                                    Tareas del día
                                </span>

                            </div>

                        </article>


                        <article className="task-stat">

                            <div className="task-stat-icon">
                                ✅
                            </div>

                            <div>

                                <strong>
                                    {completadas}
                                </strong>

                                <span>
                                    Completadas
                                </span>

                            </div>

                        </article>


                        <article className="task-progress-card">

                            <div

                                className="task-circle"

                                style={{
                                    "--task-progress":
                                        `${porcentaje * 3.6}deg`,
                                }}

                            >

                                <div className="task-circle-inner">

                                    <div className="task-percent">

                                        <span>
                                            {porcentaje}
                                        </span>

                                        <span>
                                            %
                                        </span>

                                    </div>

                                    <small>
                                        progreso
                                    </small>

                                </div>

                            </div>


                            <div className="task-progress-text">

                                <span>
                                    PROGRESO DEL DÍA
                                </span>

                                <h2>
                                    {obtenerMensaje()}
                                </h2>

                                <p>

                                    {completadas}
                                    {" "}
                                    de
                                    {" "}
                                    {totalTareas}
                                    {" "}
                                    tareas completadas.

                                </p>

                            </div>

                        </article>

                    </div>


                    {/* FORMULARIO */}

                    <form

                        className="task-form"

                        onSubmit={
                            agregarTarea
                        }

                    >

                        <div className="task-form-main">

                            <input

                                type="text"

                                value={texto}

                                onChange={
                                    evento =>
                                        setTexto(
                                            evento.target.value
                                        )
                                }

                                placeholder="¿Qué necesitas hacer?"

                            />

                        </div>


                        <div className="task-form-options">

                            <div className="task-field">

                                <label>
                                    Categoría
                                </label>

                                <select

                                    value={
                                        categoria
                                    }

                                    onChange={
                                        evento =>
                                            setCategoria(
                                                evento.target.value
                                            )
                                    }

                                >

                                    {
                                        categorias.map(
                                            item => (

                                                <option
                                                    key={item}
                                                    value={item}
                                                >

                                                    {
                                                        obtenerIconoCategoria(
                                                            item
                                                        )
                                                    }

                                                    {" "}

                                                    {item}

                                                </option>

                                            )
                                        )
                                    }

                                </select>

                            </div>


                            <div className="task-field">

                                <label>
                                    Fecha
                                </label>

                                <input

                                    type="date"

                                    value={fecha}

                                    onChange={
                                        evento =>
                                            setFecha(
                                                evento.target.value
                                            )
                                    }

                                />

                            </div>


                            <div className="task-field">

                                <label>
                                    Hora
                                </label>

                                <input

                                    type="time"

                                    value={hora}

                                    onChange={
                                        evento =>
                                            setHora(
                                                evento.target.value
                                            )
                                    }

                                />

                            </div>


                            <button type="submit">
                                + Agregar tarea
                            </button>

                        </div>

                    </form>


                    {/* FILTROS */}

                    <div className="task-filters">

                        {
                            [
                                "Todas",
                                "Trabajo",
                                "Estudios",
                                "Gimnasio",
                                "Boxeo",
                                "Personal",
                                "Finanzas",
                                "Remedios",
                            ].map(
                                item => (

                                    <button

                                        type="button"

                                        key={item}

                                        className={
                                            filtro === item
                                                ? "active"
                                                : ""
                                        }

                                        onClick={
                                            () =>
                                                setFiltro(
                                                    item
                                                )
                                        }

                                    >

                                        {
                                            item === "Todas"
                                                ? "Todas"
                                                : `${obtenerIconoCategoria(item)} ${item}`
                                        }

                                    </button>

                                )
                            )
                        }

                    </div>


                    {/* LISTADO */}

                    <div className="task-list">

                        {
                            tareasOrdenadas.map(
                                tarea => (

                                    <article

                                        key={
                                            tarea.id
                                        }

                                        className={
                                            `task-item ${
                                                tarea.completada
                                                    ? "done"
                                                    : ""
                                            }`
                                        }

                                    >

                                        <button

                                            type="button"

                                            className="task-check"

                                            onClick={
                                                () =>
                                                    cambiarEstado(
                                                        tarea.id
                                                    )
                                            }

                                        >

                                            {
                                                tarea.completada
                                                    ? "✓"
                                                    : ""
                                            }

                                        </button>


                                        <div className="task-category-icon">

                                            {
                                                obtenerIconoCategoria(
                                                    tarea.categoria
                                                )
                                            }

                                        </div>


                                        <div className="task-item-info">

                                            <strong>
                                                {tarea.titulo}
                                            </strong>


                                            {
                                                tarea.descripcion && (

                                                    <span>

                                                        {
                                                            tarea.descripcion
                                                        }

                                                    </span>

                                                )
                                            }


                                            <div className="task-meta">

                                                <span className="task-category">
                                                    {tarea.categoria}
                                                </span>


                                                <span>

                                                    📅
                                                    {" "}
                                                    {
                                                        formatearFecha(
                                                            tarea.fecha
                                                        )
                                                    }

                                                </span>


                                                {
                                                    tarea.hora && (

                                                        <span>

                                                            🕒
                                                            {" "}
                                                            {tarea.hora}

                                                        </span>

                                                    )
                                                }

                                            </div>

                                        </div>


                                        <button

                                            type="button"

                                            className="task-delete"

                                            onClick={
                                                () =>
                                                    eliminar(
                                                        tarea.id
                                                    )
                                            }

                                        >
                                            Eliminar
                                        </button>

                                    </article>

                                )
                            )
                        }

                    </div>


                    {
                        tareasOrdenadas.length === 0 && (

                            <div className="task-empty">

                                <span>
                                    📅
                                </span>

                                <strong>
                                    No tienes tareas para este día.
                                </strong>

                                <p>

                                    Agrega una tarea para
                                    {" "}
                                    {nombreDia}.

                                </p>

                            </div>

                        )
                    }

                </div>

            </section>


            {/* =================================================
                ASISTENTE DE VOZ
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
                                "rgba(5, 25, 55, 0.72)",

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
                                    "white",

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

                                        cursor:
                                            "pointer",

                                        fontSize:
                                            "24px",

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

                                                margin:
                                                    "10px 0 0",

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
                                        "10px",

                                }}

                            >

                                <div>
                                    <strong>
                                        📝 Tarea:
                                    </strong>
                                    {" "}
                                    {
                                        tareaVoz.titulo ||
                                        "—"
                                    }
                                </div>


                                <div>
                                    <strong>
                                        📅 Fecha:
                                    </strong>
                                    {" "}
                                    {
                                        tareaVoz.fecha
                                            ? formatearFecha(
                                                tareaVoz.fecha
                                            )
                                            : "—"
                                    }
                                </div>


                                <div>
                                    <strong>
                                        🕒 Hora:
                                    </strong>
                                    {" "}
                                    {
                                        tareaVoz.hora ||
                                        "—"
                                    }
                                </div>


                                <div>
                                    <strong>
                                        {
                                            obtenerIconoCategoria(
                                                tareaVoz.categoria
                                            )
                                        }
                                        {" "}
                                        Categoría:
                                    </strong>
                                    {" "}
                                    {
                                        tareaVoz.categoria
                                    }
                                </div>


                                <div>
                                    <strong>
                                        💬 Descripción:
                                    </strong>
                                    {" "}
                                    {
                                        tareaVoz.descripcion ||
                                        "Sin descripción"
                                    }
                                </div>

                            </div>


                            {/* CONTROLES */}

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
                                                confirmarTareaVoz
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

                                            ✅ Confirmar tarea

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
                                            "white",

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


export default Tareas;