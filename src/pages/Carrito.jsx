/*
============================================================
CARRITO.JSX
LifeTrack
============================================================

Carrito de compras LifeTrack.

Permite:

- Ver productos agregados.
- Aumentar cantidades.
- Disminuir cantidades.
- Eliminar productos.
- Vaciar carrito.
- Calcular subtotales.
- Calcular total general.
- Simular compra exitosa.
- Simular compra rechazada.
- Generar número de orden.
- Guardar historial de compras.
- Asociar compras al usuario autenticado.

IMPORTANTE:

El historial se guarda en localStorage utilizando la clave:

historialComprasLifeTrack

Esto nos permitirá después construir:

- Historial individual.
- Historial general.
- Reportes del administrador.

============================================================
*/


import {
    useState
} from "react";


import {
    Link
} from "react-router-dom";


import {
    useCart
} from "../context/CartContext.jsx";


import {
    useAuth
} from "../context/AuthContext.jsx";


import {
    useProducts
} from "../context/ProductContext.jsx";


import {
    apiCrearBoleta
} from "../services/api.js";


import "./CarritoPremium.css";


function Carrito() {


    /*
    ========================================================
    CARRITO GLOBAL
    ========================================================
    */

    const {

        carrito,

        aumentarCantidad,

        disminuirCantidad,

        eliminarProducto,

        vaciarCarrito,

        cantidadTotal

    } = useCart();



    /*
    ========================================================
    USUARIO AUTENTICADO
    ========================================================
    */

    const {

        usuario,

        estaAutenticado

    } = useAuth();


    /*
    ========================================================
    PRODUCTOS DEL BACKEND
    ========================================================
    */

    const {

        cargarProductos

    } = useProducts();



    /*
    ========================================================
    ESTADOS DEL PROCESO DE COMPRA
    ========================================================

    mostrarCheckout:
    abre la ventana de simulación del pago.

    resultadoCompra:
    guarda el resultado final.

    Puede contener:

    null
    "EXITOSA"
    "RECHAZADA"

    ========================================================
    */

    const [
        mostrarCheckout,
        setMostrarCheckout
    ] = useState(false);


    const [
        resultadoCompra,
        setResultadoCompra
    ] = useState(null);


    const [
        compraFinalizada,
        setCompraFinalizada
    ] = useState(null);



    /*
    ========================================================
    FORMATEAR PRECIO
    ========================================================
    */

    const formatearPrecio = (precio) => {

        return Number(
            precio
        ).toLocaleString(
            "es-CL"
        );

    };



    /*
    ========================================================
    CALCULAR TOTAL
    ========================================================
    */

    const totalCarrito =
        carrito.reduce(

            (
                acumulador,
                producto
            ) => {


                const precio =
                    Number(
                        producto.precio
                    ) || 0;


                const cantidad =
                    Number(
                        producto.cantidad
                    ) || 0;


                return (

                    acumulador +
                    precio * cantidad

                );

            },

            0

        );



    /*
    ========================================================
    GENERAR NÚMERO DE ORDEN
    ========================================================

    Ejemplo:

    LT-1760743222000

    Date.now() utiliza la fecha actual en milisegundos,
    permitiendo obtener un identificador simple y distinto.

    ========================================================
    */

    const generarNumeroOrden = () => {

        return `LT-${Date.now()}`;

    };



    /*
    ========================================================
    OBTENER HISTORIAL
    ========================================================
    */

    const obtenerHistorial = () => {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "historialComprasLifeTrack"
                )
            ) || [];

        }
        catch {

            return [];

        }

    };



    /*
    ========================================================
    GUARDAR COMPRA / INTENTO DE COMPRA
    ========================================================
    */

    const guardarCompra = (
        estado,
        motivo = ""
    ) => {


        const fechaActual =
            new Date();


        const compra = {

            id:
                Date.now(),

            numeroOrden:
                generarNumeroOrden(),

            fechaISO:
                fechaActual.toISOString(),

            fecha:
                fechaActual.toLocaleString(
                    "es-CL"
                ),

            usuario: {

                id:
                    usuario?.id || null,

                nombre:
                    usuario?.nombre ||
                    "Usuario",

                apellido:
                    usuario?.apellido ||
                    "",

                correo:
                    usuario?.correo ||
                    "Sin correo"

            },

            productos:
                carrito.map(
                    producto => ({

                        codigo:
                            producto.codigo,

                        nombre:
                            producto.nombre,

                        categoria:
                            producto.categoria,

                        precio:
                            Number(
                                producto.precio
                            ) || 0,

                        cantidad:
                            Number(
                                producto.cantidad
                            ) || 0,

                        subtotal:
                            (
                                Number(
                                    producto.precio
                                ) || 0
                            ) *
                            (
                                Number(
                                    producto.cantidad
                                ) || 0
                            )

                    })
                ),

            cantidadProductos:
                cantidadTotal,

            total:
                totalCarrito,

            estado,

            motivo

        };


        const historialActual =
            obtenerHistorial();


        const historialActualizado = [

            compra,

            ...historialActual

        ];


        localStorage.setItem(

            "historialComprasLifeTrack",

            JSON.stringify(
                historialActualizado
            )

        );


        return compra;

    };



    /*
    ========================================================
    ABRIR CHECKOUT
    ========================================================
    */

    const abrirCheckout = () => {

        setResultadoCompra(
            null
        );

        setCompraFinalizada(
            null
        );

        setMostrarCheckout(
            true
        );

    };



    /*
    ========================================================
    COMPRA EXITOSA
    ========================================================

    Si la compra resulta exitosa:

    1. Guardamos la compra.
    2. Estado = EXITOSA.
    3. Mostramos confirmación.
    4. Vaciamos el carrito.

    ========================================================
    */

    const procesarCompraExitosa = async () => {


        try {


            /*
            Enviamos al backend únicamente:

            - productoId
            - cantidad

            El backend calcula precios, subtotal, total
            y descuenta el stock de forma segura.
            */

            const items =
                carrito.map(
                    producto => ({

                        productoId:
                            producto.id,

                        cantidad:
                            Number(
                                producto.cantidad
                            ) || 1

                    })
                );


            if (
                items.some(
                    item =>
                        !item.productoId
                )
            ) {

                throw new Error(
                    "Uno de los productos no está sincronizado con el backend."
                );

            }


            const boleta =
                await apiCrearBoleta(
                    items
                );


            /*
            Conservamos el historial visual existente
            para no cambiar el diseño del panel.

            La compra REAL ya quedó guardada en MariaDB.
            */

            const compra =
                guardarCompra(
                    "EXITOSA"
                );


            /*
            Asociamos el ID real de la boleta
            generado por Spring Boot.
            */

            const compraConBackend = {

                ...compra,

                boletaId:
                    boleta?.id || null,

                total:
                    Number(
                        boleta?.total
                    ) || compra.total

            };


            setCompraFinalizada(
                compraConBackend
            );


            setResultadoCompra(
                "EXITOSA"
            );


            vaciarCarrito();


            /*
            Recargamos productos para mostrar
            el nuevo stock descontado.
            */

            await cargarProductos();


        }
        catch (error) {


            console.error(
                "Error procesando compra:",
                error
            );


            const compra =
                guardarCompra(

                    "RECHAZADA",

                    error.message ||
                    "No fue posible registrar la compra."

                );


            setCompraFinalizada(
                compra
            );


            setResultadoCompra(
                "RECHAZADA"
            );

        }

    };



    /*
    ========================================================
    COMPRA RECHAZADA
    ========================================================

    Si la compra resulta rechazada:

    1. Guardamos el intento.
    2. Estado = RECHAZADA.
    3. Guardamos el motivo.
    4. NO vaciamos el carrito.

    Esto permite que el usuario pueda volver a intentar.

    ========================================================
    */

    const procesarCompraRechazada = () => {


        const compra =
            guardarCompra(

                "RECHAZADA",

                "Pago rechazado por la entidad emisora."

            );


        setCompraFinalizada(
            compra
        );


        setResultadoCompra(
            "RECHAZADA"
        );

    };



    /*
    ========================================================
    CERRAR CHECKOUT
    ========================================================
    */

    const cerrarCheckout = () => {

        setMostrarCheckout(
            false
        );

        setResultadoCompra(
            null
        );

        setCompraFinalizada(
            null
        );

    };



    /*
    ========================================================
    RETURN
    ========================================================
    */

    return (

        <section className="seccion-general">


            <div className="container">


                {/* ==================================================
                    CABECERA
                ================================================== */}

                <div className="cabecera-pagina">


                    <span>

                        TIENDA LIFETRACK

                    </span>


                    <h1>

                        Tu carrito

                    </h1>


                    <p>

                        Revisa tus productos antes de finalizar.

                    </p>


                </div>



                {/* ==================================================
                    CARRITO VACÍO
                ================================================== */}

                {

                    carrito.length === 0

                    && resultadoCompra !== "EXITOSA"

                    && (

                        <div className="carrito-vacio">


                            <h2>

                                🛒 Tu carrito está vacío

                            </h2>


                            <p>

                                Agrega productos para comenzar
                                una nueva compra.

                            </p>


                            <Link
                                to="/productos"
                                className="btn btn-primary"
                            >

                                Ir a la tienda

                            </Link>


                        </div>

                    )

                }



                {/* ==================================================
                    CARRITO CON PRODUCTOS
                ================================================== */}

                {

                    carrito.length > 0 && (

                        <div className="carrito-layout">


                            {/* =========================================
                                LISTA
                            ========================================= */}

                            <div className="lista-carrito">


                                {

                                    carrito.map(

                                        producto => {


                                            const precio =
                                                Number(
                                                    producto.precio
                                                ) || 0;


                                            const cantidad =
                                                Number(
                                                    producto.cantidad
                                                ) || 0;


                                            const subtotal =
                                                precio *
                                                cantidad;


                                            return (

                                                <article

                                                    key={
                                                        producto.codigo
                                                    }

                                                    className="carrito-item"

                                                >


                                                    {/* IMAGEN */}

                                                    <img

                                                        src={
                                                            producto.imagen
                                                        }

                                                        alt={
                                                            producto.nombre
                                                        }

                                                    />


                                                    {/* INFORMACIÓN */}

                                                    <div className="carrito-info">


                                                        <strong>

                                                            {
                                                                producto.nombre
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                producto.categoria
                                                            }

                                                        </span>


                                                        <strong>

                                                            $

                                                            {
                                                                formatearPrecio(
                                                                    precio
                                                                )
                                                            }

                                                        </strong>



                                                        {/* CANTIDAD */}

                                                        <div className="control-cantidad">


                                                            <button

                                                                type="button"

                                                                aria-label={
                                                                    `Disminuir ${producto.nombre}`
                                                                }

                                                                onClick={
                                                                    () =>
                                                                        disminuirCantidad(
                                                                            producto.codigo
                                                                        )
                                                                }

                                                            >

                                                                −

                                                            </button>


                                                            <strong>

                                                                {
                                                                    cantidad
                                                                }

                                                            </strong>


                                                            <button

                                                                type="button"

                                                                aria-label={
                                                                    `Aumentar ${producto.nombre}`
                                                                }

                                                                onClick={
                                                                    () =>
                                                                        aumentarCantidad(
                                                                            producto.codigo
                                                                        )
                                                                }

                                                            >

                                                                +

                                                            </button>


                                                        </div>



                                                        {/* ELIMINAR */}

                                                        <button

                                                            type="button"

                                                            className="btn-eliminar"

                                                            onClick={
                                                                () =>
                                                                    eliminarProducto(
                                                                        producto.codigo
                                                                    )
                                                            }

                                                        >

                                                            Eliminar

                                                        </button>


                                                    </div>



                                                    {/* SUBTOTAL */}

                                                    <strong className="subtotal">

                                                        $

                                                        {
                                                            formatearPrecio(
                                                                subtotal
                                                            )
                                                        }

                                                    </strong>


                                                </article>

                                            );

                                        }

                                    )

                                }


                            </div>



                            {/* =========================================
                                RESUMEN
                            ========================================= */}

                            <aside className="resumen-carrito">


                                <h2>

                                    Resumen

                                </h2>


                                <div>


                                    <span>

                                        Productos

                                    </span>


                                    <strong>

                                        {cantidadTotal}

                                    </strong>


                                </div>


                                <hr />


                                <div className="total-carrito">


                                    <span>

                                        Total

                                    </span>


                                    <strong>

                                        $

                                        {
                                            formatearPrecio(
                                                totalCarrito
                                            )
                                        }

                                    </strong>


                                </div>



                                {/* =====================================
                                    FINALIZAR COMPRA
                                ===================================== */}

                                {

                                    estaAutenticado

                                        ? (

                                            <button

                                                type="button"

                                                className="btn btn-primary"

                                                onClick={
                                                    abrirCheckout
                                                }

                                            >

                                                Finalizar compra

                                            </button>

                                        )

                                        : (

                                            <Link

                                                to="/login"

                                                className="btn btn-primary"

                                            >

                                                Inicia sesión para comprar

                                            </Link>

                                        )

                                }



                                {/* VACIAR */}

                                <button

                                    type="button"

                                    className="btn btn-outline-danger"

                                    onClick={
                                        vaciarCarrito
                                    }

                                >

                                    Vaciar carrito

                                </button>



                                {/* SEGUIR COMPRANDO */}

                                <Link to="/productos">

                                    ← Seguir comprando

                                </Link>


                            </aside>


                        </div>

                    )

                }



                {/* ==================================================
                    MODAL / CHECKOUT
                ================================================== */}

                {

                    mostrarCheckout && (

                        <div className="lt-checkout-overlay">


                            <div
                                className="lt-checkout-modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="checkout-title"
                            >


                                {/* =====================================
                                    SIN RESULTADO
                                ===================================== */}

                                {

                                    resultadoCompra === null && (

                                        <>


                                            <button

                                                type="button"

                                                className="lt-checkout-close"

                                                onClick={
                                                    cerrarCheckout
                                                }

                                                aria-label="Cerrar"

                                            >

                                                ×

                                            </button>


                                            <div className="lt-checkout-icon">

                                                💳

                                            </div>


                                            <span className="lt-checkout-label">

                                                PAGO LIFETRACK

                                            </span>


                                            <h2 id="checkout-title">

                                                Confirmar compra

                                            </h2>


                                            <p>

                                                Esta es una simulación académica
                                                del proceso de pago.

                                            </p>



                                            <div className="lt-checkout-user">


                                                <span>

                                                    Cliente

                                                </span>


                                                <strong>

                                                    {
                                                        usuario?.nombre ||
                                                        usuario?.correo
                                                    }

                                                </strong>


                                            </div>



                                            <div className="lt-checkout-summary">


                                                <div>

                                                    <span>

                                                        Productos

                                                    </span>

                                                    <strong>

                                                        {cantidadTotal}

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>

                                                        Total

                                                    </span>

                                                    <strong>

                                                        $

                                                        {
                                                            formatearPrecio(
                                                                totalCarrito
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                            </div>



                                            <div className="lt-checkout-demo">


                                                <p>

                                                    Para demostrar ambos
                                                    casos solicitados en la
                                                    evaluación:

                                                </p>


                                                <button

                                                    type="button"

                                                    className="lt-checkout-success-button"

                                                    onClick={
                                                        procesarCompraExitosa
                                                    }

                                                >

                                                    ✓ Simular compra exitosa

                                                </button>


                                                <button

                                                    type="button"

                                                    className="lt-checkout-error-button"

                                                    onClick={
                                                        procesarCompraRechazada
                                                    }

                                                >

                                                    ✕ Simular compra rechazada

                                                </button>


                                            </div>


                                        </>

                                    )

                                }



                                {/* =====================================
                                    COMPRA EXITOSA
                                ===================================== */}

                                {

                                    resultadoCompra === "EXITOSA"

                                    && compraFinalizada

                                    && (

                                        <div className="lt-checkout-result">


                                            <div className="lt-result-icon lt-result-success">

                                                ✓

                                            </div>


                                            <span className="lt-checkout-label">

                                                COMPRA EXITOSA

                                            </span>


                                            <h2>

                                                ¡Gracias por tu compra!

                                            </h2>


                                            <p>

                                                Tu pedido fue procesado
                                                correctamente.

                                            </p>



                                            <div className="lt-order-card">


                                                <div>

                                                    <span>

                                                        Orden

                                                    </span>

                                                    <strong>

                                                        {
                                                            compraFinalizada
                                                                .numeroOrden
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>

                                                        Fecha

                                                    </span>

                                                    <strong>

                                                        {
                                                            compraFinalizada
                                                                .fecha
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>

                                                        Total pagado

                                                    </span>

                                                    <strong>

                                                        $

                                                        {
                                                            formatearPrecio(
                                                                compraFinalizada
                                                                    .total
                                                            )
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>

                                                        Estado

                                                    </span>

                                                    <strong className="lt-status-success">

                                                        APROBADA

                                                    </strong>

                                                </div>


                                            </div>



                                            <button

                                                type="button"

                                                className="btn btn-primary lt-checkout-main-button"

                                                onClick={
                                                    cerrarCheckout
                                                }

                                            >

                                                Finalizar

                                            </button>


                                        </div>

                                    )

                                }



                                {/* =====================================
                                    COMPRA RECHAZADA
                                ===================================== */}

                                {

                                    resultadoCompra === "RECHAZADA"

                                    && compraFinalizada

                                    && (

                                        <div className="lt-checkout-result">


                                            <div className="lt-result-icon lt-result-error">

                                                !

                                            </div>


                                            <span className="lt-checkout-label">

                                                COMPRA NO EXITOSA

                                            </span>


                                            <h2>

                                                No pudimos procesar el pago

                                            </h2>


                                            <p>

                                                Tu carrito se mantiene
                                                intacto para que puedas
                                                intentarlo nuevamente.

                                            </p>



                                            <div className="lt-order-card">


                                                <div>

                                                    <span>

                                                        Orden

                                                    </span>

                                                    <strong>

                                                        {
                                                            compraFinalizada
                                                                .numeroOrden
                                                        }

                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>

                                                        Estado

                                                    </span>

                                                    <strong className="lt-status-error">

                                                        RECHAZADA

                                                    </strong>

                                                </div>


                                                <div className="lt-order-reason">

                                                    <span>

                                                        Motivo

                                                    </span>

                                                    <strong>

                                                        {
                                                            compraFinalizada
                                                                .motivo
                                                        }

                                                    </strong>

                                                </div>


                                            </div>



                                            <button

                                                type="button"

                                                className="btn btn-primary lt-checkout-main-button"

                                                onClick={
                                                    () => {

                                                        setResultadoCompra(
                                                            null
                                                        );

                                                        setCompraFinalizada(
                                                            null
                                                        );

                                                    }
                                                }

                                            >

                                                Reintentar pago

                                            </button>


                                            <button

                                                type="button"

                                                className="lt-checkout-secondary-button"

                                                onClick={
                                                    cerrarCheckout
                                                }

                                            >

                                                Volver al carrito

                                            </button>


                                        </div>

                                    )

                                }


                            </div>


                        </div>

                    )

                }


            </div>


        </section>

    );

}


export default Carrito;