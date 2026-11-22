/*
============================================================
MAIN.JSX
Punto de entrada principal de LifeTrack
============================================================

Este archivo inicia la aplicación React.

También configura:

- React Router.
- Bootstrap.
- Contexto de autenticación.
- Contexto de productos.
- Contexto del carrito.
- Estilos generales.

IMPORTANTE:

Para que LifeTrack funcione tanto en:

- Vercel
- GitHub Pages
- localhost

utilizamos import.meta.env.BASE_URL para obtener
automáticamente la ruta base configurada por Vite.

============================================================
*/


import React from "react";
import ReactDOM from "react-dom/client";


/*
============================================================
REACT ROUTER
============================================================
*/

import {
    BrowserRouter
} from "react-router-dom";


/*
============================================================
BOOTSTRAP
============================================================
*/

import "bootstrap/dist/css/bootstrap.min.css";


/*
============================================================
CONTEXTOS DE LIFETRACK
============================================================
*/

import {
    AuthProvider
} from "./context/AuthContext.jsx";


import {
    CartProvider
} from "./context/CartContext.jsx";


import {
    ProductProvider
} from "./context/ProductContext.jsx";


/*
============================================================
APP PRINCIPAL
============================================================
*/

import App from "./App.jsx";


/*
============================================================
ESTILOS GENERALES
============================================================
*/

import "./styles.css";


/*
============================================================
BASE DEL ROUTER
============================================================

Vite entrega automáticamente la ruta base mediante:

import.meta.env.BASE_URL

Ejemplos:

GitHub Pages:
    /LifeTrack-Formativa2/

Vercel:
    /

Para React Router quitamos solamente la "/" final.

============================================================
*/

const baseRouter =

    import.meta.env.BASE_URL === "/"

        ? "/"

        : import.meta.env.BASE_URL.replace(
            /\/$/,
            ""
        );


/*
============================================================
RENDER PRINCIPAL
============================================================
*/

ReactDOM.createRoot(

    document.getElementById(
        "root"
    )

).render(

    <React.StrictMode>

        <BrowserRouter
            basename={baseRouter}
        >

            <AuthProvider>

                <ProductProvider>

                    <CartProvider>

                        <App />

                    </CartProvider>

                </ProductProvider>

            </AuthProvider>

        </BrowserRouter>

    </React.StrictMode>

);