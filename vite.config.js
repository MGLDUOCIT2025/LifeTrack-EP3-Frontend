import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/*
============================================================
VITE.CONFIG.JS
LifeTrack
============================================================

Esta configuración permite usar LifeTrack tanto en:

1. Desarrollo local
2. GitHub Pages
3. Vercel

GitHub Pages necesita:
    /LifeTrack-Formativa2/

Vercel necesita:
    /

Cuando Vercel construye el proyecto, crea automáticamente
la variable VERCEL=1.

De esta forma no tenemos que cambiar manualmente el "base"
cada vez que publicamos.
============================================================
*/

const esVercel =
    process.env.VERCEL === "1";


export default defineConfig({

    /*
    ========================================================
    REACT
    ========================================================
    */

    plugins: [
        react()
    ],


    /*
    ========================================================
    RUTA BASE
    ========================================================

    VERCEL:
    https://life-track-formativa2.vercel.app/

    GITHUB PAGES / LOCAL:
    /LifeTrack-Formativa2/
    ========================================================
    */

    base:
        esVercel
            ? "/"
            : "/LifeTrack-Formativa2/",


    /*
    ========================================================
    SERVIDOR LOCAL
    ========================================================

    Mantendremos el puerto 5174 que estamos utilizando
    durante el desarrollo de LifeTrack.

    strictPort evita que Vite cambie automáticamente
    a 5175, 5176, etc.
    ========================================================
    */

    server: {

        port: 5174,

        strictPort: true

    }

});