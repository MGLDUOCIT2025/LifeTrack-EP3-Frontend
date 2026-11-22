// ============================================================
// PORTAFOLIO.SPEC.JS
// Evaluación Parcial N°2
// Proyecto LifeTrack
//
// Pruebas realizadas:
//
// 1. Renderizado principal
// 2. Datos provenientes desde JSON
// 3. Validación de campos obligatorios
// 4. State + eventos + mock Jasmine
// 5. Validación de correo
// 6. Datos personales del portafolio
// 7. Botón de navegación a proyectos
// 8. Sección de proyectos
//
// IMPORTANTE:
//
// Se mantienen exactamente 8 pruebas.
//
// Las pruebas NO modifican el diseño.
// Solo comprueban comportamiento y funcionalidades.
//
// ============================================================


import React from "react";


import {

    cleanup,

    fireEvent,

    render,

    screen

} from "@testing-library/react";


import Portafolio
    from "../pages/Portafolio.jsx";



// ============================================================
// LIMPIEZA DEL DOM
// ============================================================

afterEach(
    () => {

        cleanup();

    }
);



// ============================================================
// GRUPO DE PRUEBAS
// ============================================================

describe(

    "Página Portafolio",

    function () {


        // ====================================================
        // TEST 1
        // RENDERIZADO PRINCIPAL
        // ====================================================

        it(

            "debería renderizar el título principal",

            function () {


                render(

                    <Portafolio />

                );


                const titulo =

                    screen.getByText(

                        /Mi Portafolio/i

                    );


                expect(
                    titulo
                ).toBeTruthy();


            }

        );



        // ====================================================
        // TEST 2
        // DATOS CARGADOS DESDE JSON
        // ====================================================

        it(

            "debería mostrar los proyectos cargados desde JSON",

            async function () {


                render(

                    <Portafolio />

                );


                const elementosLifeTrack =

                    await screen.findAllByText(

                        "LifeTrack"

                    );


                expect(

                    elementosLifeTrack.length

                ).toBeGreaterThan(
                    0
                );


                const saltateLaFila =

                    screen.getByText(

                        "Sáltate la Fila"

                    );


                expect(
                    saltateLaFila
                ).toBeTruthy();


            }

        );



        // ====================================================
        // TEST 3
        // CAMPOS OBLIGATORIOS
        //
        // Cubrimos las diferentes ramas del operador ||
        // ====================================================

        it(

            "debería mostrar error si existen campos obligatorios vacíos",

            function () {


                render(

                    <Portafolio />

                );


                const campoNombre =

                    screen.getByLabelText(
                        "Nombre"
                    );


                const campoCorreo =

                    screen.getByLabelText(
                        "Correo electrónico"
                    );


                const campoMensaje =

                    screen.getByLabelText(
                        "Mensaje"
                    );


                const boton =

                    screen.getByText(
                        "Enviar mensaje"
                    );


                const formulario =

                    boton.closest(
                        "form"
                    );



                // ------------------------------------------------
                // CASO 1
                // NOMBRE VACÍO
                // ------------------------------------------------

                fireEvent.submit(
                    formulario
                );


                expect(

                    screen.getByText(
                        "Debes completar todos los campos."
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // CASO 2
                // NOMBRE LLENO
                // CORREO VACÍO
                // ------------------------------------------------

                fireEvent.change(

                    campoNombre,

                    {

                        target: {

                            value:
                                "Mario González"

                        }

                    }

                );


                fireEvent.submit(
                    formulario
                );


                expect(

                    screen.getByText(
                        "Debes completar todos los campos."
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // CASO 3
                // NOMBRE LLENO
                // CORREO LLENO
                // MENSAJE VACÍO
                // ------------------------------------------------

                fireEvent.change(

                    campoCorreo,

                    {

                        target: {

                            value:
                                "mario@email.cl"

                        }

                    }

                );


                fireEvent.submit(
                    formulario
                );


                expect(

                    screen.getByText(
                        "Debes completar todos los campos."
                    )

                ).toBeTruthy();


                /*
                Con estos tres escenarios obligamos
                a JavaScript a evaluar cada parte
                del operador ||.
                */

                expect(
                    campoMensaje.value
                ).toBe("");


            }

        );



        // ====================================================
        // TEST 4
        // STATE + EVENTOS + MOCK
        //
        // También probamos el caso SIN MOCK.
        // ====================================================

        it(

            "debería procesar correctamente un formulario válido",

            function () {


                // ------------------------------------------------
                // CASO 1
                // CON MOCK JASMINE
                // ------------------------------------------------

                const mockEnviar =

                    jasmine.createSpy(
                        "onEnviarMensaje"
                    );


                render(

                    <Portafolio
                        onEnviarMensaje={
                            mockEnviar
                        }
                    />

                );


                const campoNombre =

                    screen.getByLabelText(
                        "Nombre"
                    );


                const campoCorreo =

                    screen.getByLabelText(
                        "Correo electrónico"
                    );


                const campoMensaje =

                    screen.getByLabelText(
                        "Mensaje"
                    );


                fireEvent.change(

                    campoNombre,

                    {

                        target: {

                            value:
                                "Mario González"

                        }

                    }

                );


                fireEvent.change(

                    campoCorreo,

                    {

                        target: {

                            value:
                                "mario@email.cl"

                        }

                    }

                );


                fireEvent.change(

                    campoMensaje,

                    {

                        target: {

                            value:
                                "Mensaje de prueba"

                        }

                    }

                );


                const boton =

                    screen.getByText(
                        "Enviar mensaje"
                    );


                fireEvent.submit(

                    boton.closest(
                        "form"
                    )

                );


                expect(
                    mockEnviar
                ).toHaveBeenCalled();


                expect(

                    mockEnviar

                ).toHaveBeenCalledWith(

                    {

                        nombre:
                            "Mario González",

                        correo:
                            "mario@email.cl",

                        mensaje:
                            "Mensaje de prueba"

                    }

                );


                expect(

                    screen.getByText(
                        "Mensaje enviado correctamente."
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // LIMPIAMOS PARA PROBAR RAMA CONTRARIA
                // ------------------------------------------------

                cleanup();



                // ------------------------------------------------
                // CASO 2
                // FORMULARIO VÁLIDO SIN onEnviarMensaje
                //
                // Esto cubre el FALSE de:
                //
                // if (onEnviarMensaje)
                // ------------------------------------------------

                render(

                    <Portafolio />

                );


                fireEvent.change(

                    screen.getByLabelText(
                        "Nombre"
                    ),

                    {

                        target: {

                            value:
                                "Mario"

                        }

                    }

                );


                fireEvent.change(

                    screen.getByLabelText(
                        "Correo electrónico"
                    ),

                    {

                        target: {

                            value:
                                "mario@email.cl"

                        }

                    }

                );


                fireEvent.change(

                    screen.getByLabelText(
                        "Mensaje"
                    ),

                    {

                        target: {

                            value:
                                "Segundo mensaje"

                        }

                    }

                );


                const botonSinMock =

                    screen.getByText(
                        "Enviar mensaje"
                    );


                fireEvent.submit(

                    botonSinMock.closest(
                        "form"
                    )

                );


                expect(

                    screen.getByText(
                        "Mensaje enviado correctamente."
                    )

                ).toBeTruthy();


            }

        );



        // ====================================================
        // TEST 5
        // VALIDACIÓN DE CORREO
        // ====================================================

        it(

            "debería rechazar un correo electrónico inválido",

            function () {


                render(

                    <Portafolio />

                );


                fireEvent.change(

                    screen.getByLabelText(
                        "Nombre"
                    ),

                    {

                        target: {

                            value:
                                "Mario"

                        }

                    }

                );


                fireEvent.change(

                    screen.getByLabelText(
                        "Correo electrónico"
                    ),

                    {

                        target: {

                            value:
                                "correo-invalido"

                        }

                    }

                );


                fireEvent.change(

                    screen.getByLabelText(
                        "Mensaje"
                    ),

                    {

                        target: {

                            value:
                                "Mensaje de prueba"

                        }

                    }

                );


                const boton =

                    screen.getByText(
                        "Enviar mensaje"
                    );


                fireEvent.submit(

                    boton.closest(
                        "form"
                    )

                );


                expect(

                    screen.getByText(

                        "Debes ingresar un correo electrónico válido."

                    )

                ).toBeTruthy();


            }

        );



        // ====================================================
        // TEST 6
        // DATOS PERSONALES
        // ====================================================

        it(

            "debería mostrar el nombre del desarrollador",

            function () {


                render(

                    <Portafolio />

                );


                const nombres =

                    screen.getAllByText(

                        "Mario González"

                    );


                expect(

                    nombres.length

                ).toBeGreaterThan(
                    0
                );


            }

        );



        // ====================================================
        // TEST 7
        // BOTÓN PROYECTOS
        // ====================================================

        it(

            "debería mostrar el botón para ver los proyectos",

            function () {


                render(

                    <Portafolio />

                );


                const botonProyectos =

                    screen.getByRole(

                        "button",

                        {

                            name:
                                /Ver mis proyectos/i

                        }

                    );


                expect(
                    botonProyectos
                ).toBeTruthy();


                expect(

                    botonProyectos.getAttribute(
                        "href"
                    )

                ).toBe(

                    "#proyectos-portafolio"

                );


            }

        );



        // ====================================================
        // TEST 8
        // SECCIÓN PROYECTOS
        // ====================================================

        it(

            "debería mostrar la sección Mis proyectos",

            function () {


                render(

                    <Portafolio />

                );


                const tituloProyectos =

                    screen.getByRole(

                        "heading",

                        {

                            level:
                                2,

                            name:
                                "Mis proyectos"

                        }

                    );


                expect(
                    tituloProyectos
                ).toBeTruthy();


            }

        );


    }

);