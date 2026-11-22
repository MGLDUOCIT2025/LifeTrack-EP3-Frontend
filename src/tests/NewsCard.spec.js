// ============================================================
// NEWSCARD.SPEC.JS
// Evaluación Parcial N°2
// Proyecto LifeTrack
//
// OBJETIVO:
//
// Verificar que NewsCard:
// - reciba información mediante props;
// - muestre titulo;
// - muestre fecha;
// - acepte "descripcion";
// - acepte "contenido";
// - soporte ausencia de ambos textos.
//
// IMPORTANTE:
//
// Seguimos teniendo UNA sola prueba para NewsCard.
// Dentro de la misma prueba ejecutamos varios escenarios
// para aumentar la cobertura de BRANCHES.
// ============================================================


import React from "react";


import {

    cleanup,

    render,

    screen

} from "@testing-library/react";


import NewsCard
    from "../components/NewsCard.jsx";



// ============================================================
// LIMPIAR DOM DESPUÉS DE CADA PRUEBA
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

    "Componente NewsCard",

    function () {


        // ====================================================
        // TEST 1
        //
        // Probamos las tres posibilidades de:
        //
        // noticia.descripcion ||
        // noticia.contenido ||
        // ""
        //
        // ====================================================

        it(

            "debería mostrar correctamente una noticia recibida por props",

            function () {


                // ------------------------------------------------
                // CASO 1
                // NOTICIA CON DESCRIPCIÓN
                // ------------------------------------------------

                const noticiaConDescripcion = {

                    id: 1,

                    categoria:
                        "Tecnología",

                    titulo:
                        "Noticia con descripción",

                    fecha:
                        "06-10-2026",

                    descripcion:
                        "Descripción utilizada para probar el componente."

                };


                render(

                    <NewsCard
                        noticia={
                            noticiaConDescripcion
                        }
                    />

                );


                expect(

                    screen.getByText(
                        "Noticia con descripción"
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "06-10-2026"
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "Descripción utilizada para probar el componente."
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // LIMPIEZA PARA SEGUNDO ESCENARIO
                // ------------------------------------------------

                cleanup();



                // ------------------------------------------------
                // CASO 2
                // SIN DESCRIPCIÓN, PERO CON CONTENIDO
                // ------------------------------------------------

                const noticiaConContenido = {

                    id: 2,

                    categoria:
                        "React",

                    titulo:
                        "Noticia de prueba",

                    fecha:
                        "07-10-2026",

                    contenido:
                        "Contenido utilizado para probar el componente."

                };


                render(

                    <NewsCard
                        noticia={
                            noticiaConContenido
                        }
                    />

                );


                expect(

                    screen.getByText(
                        "Noticia de prueba"
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "Contenido utilizado para probar el componente."
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // LIMPIEZA PARA TERCER ESCENARIO
                // ------------------------------------------------

                cleanup();



                // ------------------------------------------------
                // CASO 3
                // SIN DESCRIPCIÓN Y SIN CONTENIDO
                //
                // Aquí se ejecuta el último fallback:
                //
                // ""
                // ------------------------------------------------

                const noticiaSinTexto = {

                    id: 3,

                    categoria:
                        "LifeTrack",

                    titulo:
                        "Noticia sin descripción",

                    fecha:
                        "08-10-2026"

                };


                const resultado = render(

                    <NewsCard
                        noticia={
                            noticiaSinTexto
                        }
                    />

                );


                expect(

                    screen.getByText(
                        "Noticia sin descripción"
                    )

                ).toBeTruthy();


                /*
                Comprobamos que el componente
                sigue renderizándose correctamente
                aunque no exista descripcion
                ni contenido.
                */

                expect(
                    resultado.container
                ).toBeTruthy();


            }

        );


    }

);