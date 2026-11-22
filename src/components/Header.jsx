/*
============================================================
HEADER.JSX
LifeTrack
============================================================

Header principal de LifeTrack.

Incluye:

- Logo
- Navegación
- Carrito
- Login
- Registro
- Usuario conectado
- Panel Admin
- Cerrar sesión

============================================================
*/


import {
    NavLink,
    Link,
    useNavigate
} from "react-router-dom";


import {
    useCart
} from "../context/CartContext.jsx";


import {
    useAuth
} from "../context/AuthContext.jsx";


import "./HeaderPremium.css";


function Header() {


    /*
    ========================================================
    NAVEGACIÓN
    ========================================================
    */

    const navigate =
        useNavigate();


    /*
    ========================================================
    CARRITO GLOBAL
    ========================================================
    */

    const {
        cantidadTotal
    } = useCart();


    /*
    ========================================================
    AUTENTICACIÓN
    ========================================================
    */

    const {

        usuario,

        logout,

        estaAutenticado,

        esAdmin

    } = useAuth();


    /*
    ========================================================
    CERRAR SESIÓN
    ========================================================
    */

    const cerrarSesion = () => {


        logout();


        /*
        Después de cerrar sesión enviamos
        al usuario al Inicio.
        */

        navigate(
            "/"
        );

    };


    /*
    ========================================================
    NOMBRE A MOSTRAR
    ========================================================
    */

    const nombreUsuario =

        usuario?.nombre ||

        usuario?.correo
            ?.split("@")[0] ||

        "Usuario";


    /*
    ========================================================
    RETURN
    ========================================================
    */

    return (

        <header className="lifetrack-header">


            <div className="lifetrack-header-container">


                {/* =================================================
                    LOGO
                ================================================= */}

                <Link

                    to="/"

                    className="lifetrack-logo"

                >


                    <div className="lifetrack-logo-icon">

                        ✓

                    </div>


                    <div className="lifetrack-logo-text">


                        <strong>

                            LifeTrack

                        </strong>


                        <span>

                            Organiza tu día. Cumple tus metas.

                        </span>


                    </div>


                </Link>


                {/* =================================================
                    MENÚ PRINCIPAL
                ================================================= */}

                <nav className="lifetrack-nav">


                    <NavLink

                        to="/"

                        end

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Inicio

                    </NavLink>


                    <NavLink

                        to="/mi-dia"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Mi Día

                    </NavLink>


                    <NavLink

                        to="/tareas"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Mis Tareas

                    </NavLink>


                    <NavLink

                        to="/productos"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Tienda

                    </NavLink>


                    <NavLink

                        to="/blog"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Blog

                    </NavLink>


                    <NavLink

                        to="/nosotros"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Nosotros

                    </NavLink>


                    <NavLink

                        to="/contacto"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >

                        Contacto

                    </NavLink>


                    <NavLink

                        to="/portafolio"

                        className={
                            ({ isActive }) =>

                                isActive

                                    ? "lifetrack-nav-link active"

                                    : "lifetrack-nav-link"
                        }

                    >


                        <span className="portfolio-icon">

                            💼

                        </span>


                        Portafolio


                    </NavLink>


                </nav>


                {/* =================================================
                    ACCIONES DERECHA
                ================================================= */}

                <div className="lifetrack-header-actions">


                    {/* =============================================
                        CARRITO
                    ============================================= */}

                    <Link

                        to="/carrito"

                        className="header-cart-button"

                        aria-label="Ir al carrito"

                        title="Carrito LifeTrack"

                    >


                        🛒


                        {

                            cantidadTotal > 0 && (

                                <span className="header-cart-count">

                                    {cantidadTotal}

                                </span>

                            )

                        }


                    </Link>


                    {/* =================================================
                        USUARIO NO AUTENTICADO
                    ================================================= */}

                    {

                        !estaAutenticado && (

                            <>


                                {/* =====================================
                                    INICIAR SESIÓN
                                ===================================== */}

                                <Link

                                    to="/login"

                                    className="header-login-button"

                                >


                                    <span className="header-login-icon">

                                        👤

                                    </span>


                                    <span>

                                        Iniciar sesión

                                    </span>


                                </Link>


                                {/* =====================================
                                    COMENZAR GRATIS
                                ===================================== */}

                                <Link

                                    to="/registro"

                                    className="header-start-button"

                                >


                                    <span>

                                        Comenzar gratis

                                    </span>


                                    <span className="header-arrow">

                                        →

                                    </span>


                                </Link>


                            </>

                        )

                    }


                    {/* =================================================
                        USUARIO AUTENTICADO
                    ================================================= */}

                    {

                        estaAutenticado && (

                            <>


                                {/* =====================================
                                    NOMBRE DEL USUARIO
                                ===================================== */}

                                <div
                                    className="header-login-button"
                                    title={
                                        usuario?.correo
                                    }
                                >


                                    <span className="header-login-icon">

                                        👤

                                    </span>


                                    <span>

                                        Hola {nombreUsuario}

                                    </span>


                                </div>


                                {/* =====================================
                                    PANEL ADMINISTRADOR
                                ===================================== */}

                                {

                                    esAdmin && (

                                        <Link

                                            to="/admin"

                                            className="header-start-button"

                                        >


                                            <span>

                                                Panel Admin

                                            </span>


                                        </Link>

                                    )

                                }


                                {/* =====================================
                                    CERRAR SESIÓN
                                ===================================== */}

                                <button

                                    type="button"

                                    className="header-start-button"

                                    onClick={
                                        cerrarSesion
                                    }

                                >


                                    <span>

                                        Cerrar sesión

                                    </span>


                                    <span className="header-arrow">

                                        →

                                    </span>


                                </button>


                            </>

                        )

                    }


                </div>


            </div>


        </header>

    );

}


export default Header;