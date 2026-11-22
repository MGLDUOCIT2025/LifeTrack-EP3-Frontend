// ============================================================
// PORTFOLIOPROJECTCARD.SPEC.JS
// Evaluación Parcial N°2
// Proyecto LifeTrack
//
// OBJETIVO:
//
// Verificar que PortfolioProjectCard:
// - reciba datos mediante props;
// - utilice "nombre" cuando exista;
// - utilice "titulo" como alternativa;
// - soporte ausencia de ambos.
//
// IMPORTANTE:
//
// Seguimos teniendo UNA sola prueba.
// Dentro de esa prueba cubrimos las diferentes ramas.
// ============================================================


import React from "react";


import {

    cleanup,

    render,

    screen

} from "@testing-library/react";


import PortfolioProjectCard
    from "../components/PortfolioProjectCard.jsx";



// ============================================================
// LIMPIEZA
// ============================================================

afterEach(
    () => {

        cleanup();

    }
);



// ============================================================
// PRUEBAS
// ============================================================

describe(

    "Componente PortfolioProjectCard",

    function () {


        it(

            "debería mostrar los datos del proyecto recibidos por props",

            function () {


                // ------------------------------------------------
                // CASO 1
                // UTILIZAMOS proyecto.nombre
                // ------------------------------------------------

                const proyectoConNombre = {

                    id: 1,

                    nombre:
                        "LifeTrack",

                    descripcion:
                        "Proyecto LifeTrack utilizado durante una prueba unitaria.",

                    tecnologias:
                        "React y JavaScript",

                    imagen:
                        "https://example.com/lifetrack.jpg",

                    enlace:
                        "https://github.com/"

                };


                render(

                    <PortfolioProjectCard
                        proyecto={
                            proyectoConNombre
                        }
                    />

                );


                expect(

                    screen.getByText(
                        "LifeTrack"
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "Proyecto LifeTrack utilizado durante una prueba unitaria."
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "React y JavaScript"
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "Ver proyecto"
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // LIMPIAMOS EL DOM
                // ------------------------------------------------

                cleanup();



                // ------------------------------------------------
                // CASO 2
                // NO EXISTE nombre
                // UTILIZAMOS proyecto.titulo
                // ------------------------------------------------

                const proyectoConTitulo = {

                    id: 2,

                    titulo:
                        "LifeTrack Test",

                    descripcion:
                        "Proyecto utilizado durante una prueba unitaria.",

                    tecnologias:
                        "React Bootstrap",

                    imagen:
                        "https://example.com/imagen.jpg",

                    enlace:
                        "https://github.com/"

                };


                render(

                    <PortfolioProjectCard
                        proyecto={
                            proyectoConTitulo
                        }
                    />

                );


                expect(

                    screen.getByText(
                        "LifeTrack Test"
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "Proyecto utilizado durante una prueba unitaria."
                    )

                ).toBeTruthy();


                expect(

                    screen.getByText(
                        "React Bootstrap"
                    )

                ).toBeTruthy();



                // ------------------------------------------------
                // LIMPIAMOS EL DOM
                // ------------------------------------------------

                cleanup();



                // ------------------------------------------------
                // CASO 3
                // NO EXISTE nombre
                // NO EXISTE titulo
                //
                // Se ejecuta:
                //
                // ""
                // ------------------------------------------------

                const proyectoSinNombre = {

                    id: 3,

                    descripcion:
                        "Proyecto sin nombre.",

                    tecnologias:
                        "JavaScript",

                    imagen:
                        "https://example.com/sin-nombre.jpg",

                    enlace:
                        "https://github.com/"

                };


                const resultado = render(

                    <PortfolioProjectCard
                        proyecto={
                            proyectoSinNombre
                        }
                    />

                );


                expect(

                    screen.getByText(
                        "Proyecto sin nombre."
                    )

                ).toBeTruthy();


                expect(
                    resultado.container
                ).toBeTruthy();


            }

        );


    }

);