// ============================================================
// KARMA.CONF.CJS
// Evaluación Formativa N°2
// Proyecto LifeTrack
//
// Jasmine:
// define y organiza nuestras pruebas.
//
// Karma:
// ejecuta las pruebas dentro de un navegador.
//
// Webpack:
// procesa JSX, imports, CSS e imágenes.
//
// Babel:
// transforma JavaScript moderno y JSX.
//
// Coverage:
// genera el informe de cobertura.
//
// IMPORTANTE:
//
// Esta configuración corresponde solamente al entorno
// de pruebas.
//
// NO modifica:
// - Vite
// - Vercel
// - el diseño real de LifeTrack
// - las imágenes originales del proyecto
//
// Durante los tests las imágenes se convierten en recursos
// embebidos para evitar solicitudes 404 innecesarias.
// ============================================================


const webpack = require("webpack");


module.exports = function (config) {


    config.set({


        // ====================================================
        // CARPETA BASE
        // ====================================================

        basePath: "",



        // ====================================================
        // FRAMEWORK
        // ====================================================

        frameworks: [

            "jasmine"

        ],



        // ====================================================
        // ARCHIVOS
        // ====================================================

        files: [


            /*
            ----------------------------------------------------
            PRUEBAS UNITARIAS
            ----------------------------------------------------
            */

            {
                pattern:
                    "src/tests/**/*.spec.js",

                watched:
                    false
            },



            /*
            ----------------------------------------------------
            CARPETA PUBLIC
            ----------------------------------------------------

            Permitimos que Karma sirva los archivos existentes
            dentro de public.

            Esto es necesario, por ejemplo, para:

            public/mario.jpg
            */

            {
                pattern:
                    "public/**/*",

                included:
                    false,

                served:
                    true,

                watched:
                    false,

                nocache:
                    false
            }


        ],



        // ====================================================
        // PREPROCESADORES
        // ====================================================

        preprocessors: {


            /*
            Todos los archivos de pruebas son enviados
            a Webpack antes de ejecutarse.
            */

            "src/tests/**/*.spec.js": [

                "webpack"

            ]


        },



        // ====================================================
        // CONFIGURACIÓN DE WEBPACK
        // ====================================================

        webpack: {


            mode:
                "development",



            // =================================================
            // EXTENSIONES
            // =================================================

            resolve: {


                extensions: [

                    ".js",

                    ".jsx"

                ]


            },



            // =================================================
            // REGLAS / LOADERS
            // =================================================

            module: {


                rules: [


                    // =========================================
                    // JAVASCRIPT Y JSX
                    // =========================================

                    {

                        test:
                            /\.(js|jsx)$/,

                        exclude:
                            /node_modules/,

                        use: {


                            loader:
                                "babel-loader",


                            options: {


                                presets: [


                                    /*
                                    JavaScript moderno.
                                    */

                                    [

                                        "@babel/preset-env",

                                        {

                                            targets:
                                                "defaults"

                                        }

                                    ],



                                    /*
                                    React / JSX.
                                    */

                                    [

                                        "@babel/preset-react",

                                        {

                                            runtime:
                                                "automatic"

                                        }

                                    ]


                                ],



                                // ---------------------------------
                                // ISTANBUL
                                // ---------------------------------
                                //
                                // Permite calcular:
                                //
                                // Statements
                                // Branches
                                // Functions
                                // Lines
                                //
                                // Los archivos de tests no se
                                // consideran dentro de la cobertura.
                                // ---------------------------------

                                plugins: [


                                    [

                                        "babel-plugin-istanbul",

                                        {

                                            exclude: [

                                                "src/tests/**"

                                            ]

                                        }

                                    ]


                                ]


                            }


                        }


                    },



                    // =========================================
                    // CSS
                    // =========================================

                    {

                        test:
                            /\.css$/,

                        use: [

                            "style-loader",

                            "css-loader"

                        ]

                    },



                    // =========================================
                    // IMÁGENES
                    // =========================================
                    //
                    // IMPORTANTE:
                    //
                    // Utilizamos asset/inline.
                    //
                    // Esto convierte las imágenes utilizadas
                    // durante las pruebas a Data URI.
                    //
                    // Así ChromeHeadless NO necesita solicitar:
                    //
                    // /_karma_webpack_/assets/hero-montanas.png
                    //
                    // y evitamos los WARN 404.
                    //
                    // Esto afecta SOLAMENTE a Karma.
                    // La web real sigue funcionando con Vite.
                    // =========================================

                    {

                        test:
                            /\.(png|jpe?g|gif|webp|svg)$/i,

                        type:
                            "asset/inline"

                    }


                ]


            },



            // =================================================
            // PLUGINS
            // =================================================

            plugins: [


                /*
                ------------------------------------------------
                BASE_URL DE VITE DURANTE LAS PRUEBAS
                ------------------------------------------------

                La aplicación real utiliza:

                import.meta.env.BASE_URL

                En producción/local Vite lo reemplaza.

                Karma trabaja con Webpack, por eso durante
                testing definimos BASE_URL como "/".
                */

                new webpack.DefinePlugin({

                    "import.meta.env.BASE_URL":
                        JSON.stringify("/")

                })


            ],



            // =================================================
            // SALIDA
            // =================================================

            stats:
                "errors-only"


        },



        // ====================================================
        // PROXY PARA ARCHIVO PÚBLICO
        // ====================================================
        //
        // Portafolio.jsx utiliza:
        //
        // /mario.jpg
        //
        // Karma debe redirigirlo a:
        //
        // public/mario.jpg
        // ====================================================

        proxies: {


            "/mario.jpg":

                "/base/public/mario.jpg"


        },



        // ====================================================
        // REPORTES
        // ====================================================

        reporters: [

            "progress",

            "coverage"

        ],



        // ====================================================
        // COVERAGE
        // ====================================================

        coverageReporter: {


            dir:
                "coverage",


            reporters: [


                /*
                Reporte visual navegable.
                */

                {

                    type:
                        "html",

                    subdir:
                        "html"

                },



                /*
                Resumen mostrado en la terminal.
                */

                {

                    type:
                        "text-summary"

                }


            ]


        },



        // ====================================================
        // NAVEGADOR
        // ====================================================

        browsers: [

            "ChromeHeadless"

        ],



        // ====================================================
        // EJECUCIÓN
        // ====================================================

        singleRun:
            true,



        // ====================================================
        // CLIENTE
        // ====================================================

        client: {


            clearContext:
                false


        }


    });


};