/*
============================================================
ADMIN.JSX
Panel de administración LifeTrack
============================================================

FUNCIONALIDADES:

1. Resumen general.
2. Reportes de ventas.
3. Gestión de productos.
4. Listado de usuarios.
5. Historial general de compras.
6. Historial por usuario.
7. Filtro por estado de compra.
8. Métricas de ventas aprobadas y rechazadas.

DATOS UTILIZADOS:

- usuarios
- historialComprasLifeTrack

Ambos se obtienen desde localStorage.

============================================================
*/


import {
    useEffect,
    useState
} from "react";


import {
    Link
} from "react-router-dom";


import {
    useAuth
} from "../context/AuthContext.jsx";


import {
    useProducts
} from "../context/ProductContext.jsx";


import {
    apiListarBoletas,
    apiListarUsuarios
} from "../services/api.js";


import "./AdminPremium.css";



/*
============================================================
PRODUCTO VACÍO
============================================================
*/

const productoVacio = {

    codigo: "",

    nombre: "",

    categoria: "Fitness",

    precio: "",

    stock: "",

    icono: "📦",

    imagen: "",

    descripcion: ""

};



function Admin() {


    /*
    ========================================================
    CONTEXTO DE AUTENTICACIÓN
    ========================================================
    */

    const {
        usuario
    } = useAuth();



    /*
    ========================================================
    CONTEXTO DE PRODUCTOS
    ========================================================
    */

    const {

        productos,

        agregarProducto,

        editarProducto,

        eliminarProducto,

        restaurarProductos

    } = useProducts();



    /*
    ========================================================
    ESTADO DE NAVEGACIÓN
    ========================================================
    */

    const [
        seccion,
        setSeccion
    ] = useState(
        "resumen"
    );



    /*
    ========================================================
    FORMULARIO PRODUCTOS
    ========================================================
    */

    const [
        formularioVisible,
        setFormularioVisible
    ] = useState(false);


    const [
        modoEdicion,
        setModoEdicion
    ] = useState(false);


    const [
        codigoOriginal,
        setCodigoOriginal
    ] = useState("");


    const [
        formulario,
        setFormulario
    ] = useState(
        productoVacio
    );


    const [
        mensaje,
        setMensaje
    ] = useState("");



    /*
    ========================================================
    FILTROS HISTORIAL
    ========================================================
    */

    const [
        filtroUsuario,
        setFiltroUsuario
    ] = useState(
        "TODOS"
    );


    const [
        filtroEstado,
        setFiltroEstado
    ] = useState(
        "TODAS"
    );


    /*
    ========================================================
    DATOS ADMINISTRATIVOS DESDE SPRING BOOT
    ========================================================
    */

    const [
        usuarios,
        setUsuarios
    ] = useState([]);


    const [
        historialCompras,
        setHistorialCompras
    ] = useState([]);


    const [
        errorAdmin,
        setErrorAdmin
    ] = useState("");


    useEffect(
        () => {

            if (
                !usuario ||
                usuario.rol !== "admin"
            ) {

                return;

            }


            async function cargarDatosAdmin() {

                try {

                    const [
                        respuestaUsuarios,
                        respuestaBoletas
                    ] = await Promise.all([
                        apiListarUsuarios(),
                        apiListarBoletas()
                    ]);


                    setUsuarios(
                        (
                            respuestaUsuarios ||
                            []
                        ).map(
                            usuarioBackend => ({

                                ...usuarioBackend,

                                rol:
                                    String(
                                        usuarioBackend.rol ||
                                        "CLIENTE"
                                    ).toLowerCase()

                            })
                        )
                    );


                    const historial =
                        (
                            respuestaBoletas ||
                            []
                        ).map(
                            boleta => {

                                const productosCompra =
                                    (
                                        boleta.detalles ||
                                        []
                                    ).map(
                                        detalle => ({

                                            codigo:
                                                detalle.producto?.codigo ||
                                                "",

                                            nombre:
                                                detalle.producto?.nombre ||
                                                "Producto",

                                            categoria:
                                                detalle.producto?.categoria?.nombre ||
                                                "Sin categoría",

                                            precio:
                                                Number(
                                                    detalle.precioUnitario
                                                ) || 0,

                                            cantidad:
                                                Number(
                                                    detalle.cantidad
                                                ) || 0,

                                            subtotal:
                                                Number(
                                                    detalle.subtotal
                                                ) || 0

                                        })
                                    );


                                return {

                                    id:
                                        boleta.id,

                                    numeroOrden:
                                        `BOLETA-${boleta.id}`,

                                    fechaISO:
                                        boleta.fecha,

                                    fecha:
                                        boleta.fecha
                                            ? new Date(
                                                boleta.fecha
                                            ).toLocaleString(
                                                "es-CL"
                                            )
                                            : "",

                                    usuario: {

                                        id:
                                            boleta.usuario?.id ||
                                            null,

                                        nombre:
                                            boleta.usuario?.nombre ||
                                            "",

                                        apellido:
                                            boleta.usuario?.apellido ||
                                            "",

                                        correo:
                                            boleta.usuario?.correo ||
                                            ""

                                    },

                                    productos:
                                        productosCompra,

                                    cantidadProductos:
                                        productosCompra.reduce(
                                            (
                                                total,
                                                producto
                                            ) =>
                                                total +
                                                (
                                                    Number(
                                                        producto.cantidad
                                                    ) || 0
                                                ),
                                            0
                                        ),

                                    total:
                                        Number(
                                            boleta.total
                                        ) || 0,

                                    estado:
                                        boleta.estado ===
                                        "APROBADA"
                                            ? "EXITOSA"
                                            : "RECHAZADA",

                                    motivo:
                                        boleta.estado ===
                                        "RECHAZADA"
                                            ? "Compra rechazada."
                                            : ""

                                };

                            }
                        );


                    setHistorialCompras(
                        historial
                    );


                    setErrorAdmin(
                        ""
                    );

                }
                catch (error) {

                    console.error(
                        "Error cargando panel administrativo:",
                        error
                    );


                    setErrorAdmin(
                        error.message ||
                        "No fue posible cargar los datos administrativos."
                    );


                    /*
                    Respaldo visual:
                    si usuarios falla por una ruta no disponible,
                    mantenemos al menos el historial local previo.
                    */
                    try {

                        const historialLocal =
                            JSON.parse(
                                localStorage.getItem(
                                    "historialComprasLifeTrack"
                                )
                            ) || [];


                        setHistorialCompras(
                            historialLocal
                        );

                    }
                    catch {

                        setHistorialCompras(
                            []
                        );

                    }

                }

            }


            cargarDatosAdmin();

        },
        [
            usuario
        ]
    );



    /*
    ========================================================
    SEGURIDAD
    ========================================================

    Solo un usuario con rol admin puede acceder.

    ========================================================
    */

    if (
        !usuario ||
        usuario.rol !== "admin"
    ) {

        return (

            <section className="seccion-general">

                <div className="container">

                    <div className="alert alert-danger">

                        No tienes permisos para acceder
                        al panel administrador.

                    </div>

                    <Link
                        to="/login"
                        className="btn btn-primary"
                    >

                        Iniciar sesión

                    </Link>

                </div>

            </section>

        );

    }



    /*
    ========================================================
    ORDENAR HISTORIAL
    ========================================================
    */

    const historialOrdenado = [

        ...historialCompras

    ].sort(

        (
            compraA,
            compraB
        ) => {

            const fechaA =
                new Date(
                    compraA.fechaISO ||
                    0
                ).getTime();


            const fechaB =
                new Date(
                    compraB.fechaISO ||
                    0
                ).getTime();


            return fechaB - fechaA;

        }

    );



    /*
    ========================================================
    MÉTRICAS
    ========================================================
    */


    /*
    Todas las operaciones realizadas.
    Incluye aprobadas y rechazadas.
    */

    const totalOperaciones =
        historialCompras.length;



    /*
    Solo compras exitosas.
    */

    const comprasAprobadas =
        historialCompras.filter(

            compra =>
                compra.estado ===
                "EXITOSA"

        );



    /*
    Compras rechazadas.
    */

    const comprasRechazadas =
        historialCompras.filter(

            compra =>
                compra.estado ===
                "RECHAZADA"

        );



    /*
    Cantidad de ventas aprobadas.
    */

    const totalVentas =
        comprasAprobadas.length;



    /*
    Total de intentos rechazados.
    */

    const totalRechazadas =
        comprasRechazadas.length;



    /*
    Ingresos.

    IMPORTANTE:

    Solo sumamos compras aprobadas.
    Una compra rechazada no genera ingresos.
    */

    const ingresosTotales =
        comprasAprobadas.reduce(

            (
                acumulador,
                compra
            ) => {

                return (

                    acumulador +
                    (
                        Number(
                            compra.total
                        ) || 0
                    )

                );

            },

            0

        );



    /*
    Unidades vendidas.
    */

    const unidadesVendidas =
        comprasAprobadas.reduce(

            (
                acumulador,
                compra
            ) => {

                return (

                    acumulador +
                    (
                        Number(
                            compra.cantidadProductos
                        ) || 0
                    )

                );

            },

            0

        );



    /*
    ========================================================
    PRODUCTO MÁS VENDIDO
    ========================================================
    */

    const ventasPorProducto = {};


    comprasAprobadas.forEach(

        compra => {

            (
                compra.productos || []
            ).forEach(

                producto => {

                    const clave =
                        producto.codigo ||
                        producto.nombre;


                    if (
                        !ventasPorProducto[
                            clave
                        ]
                    ) {

                        ventasPorProducto[
                            clave
                        ] = {

                            nombre:
                                producto.nombre,

                            cantidad:
                                0

                        };

                    }


                    ventasPorProducto[
                        clave
                    ].cantidad +=

                        Number(
                            producto.cantidad
                        ) || 0;

                }

            );

        }

    );


    const productosVendidos =
        Object.values(
            ventasPorProducto
        );


    const productoMasVendido =
        productosVendidos.length > 0

            ? productosVendidos.reduce(

                (
                    mayor,
                    producto
                ) => {

                    return (

                        producto.cantidad >
                        mayor.cantidad

                            ? producto

                            : mayor

                    );

                }

            )

            : null;



    /*
    ========================================================
    USUARIOS DISPONIBLES PARA FILTRO
    ========================================================

    Se genera una lista utilizando:

    - usuarios registrados;
    - usuarios encontrados en compras.

    Así podemos consultar compras incluso si
    un usuario fue eliminado del registro local.

    ========================================================
    */

    const mapaUsuarios = new Map();


    usuarios.forEach(

        usuarioRegistrado => {

            if (
                usuarioRegistrado.correo
            ) {

                mapaUsuarios.set(

                    usuarioRegistrado.correo,

                    {

                        correo:
                            usuarioRegistrado.correo,

                        nombre:
                            `${usuarioRegistrado.nombre || ""} ${usuarioRegistrado.apellido || ""}`
                                .trim()

                    }

                );

            }

        }

    );


    historialCompras.forEach(

        compra => {

            const correo =
                compra.usuario?.correo;


            if (
                correo &&
                !mapaUsuarios.has(
                    correo
                )
            ) {

                mapaUsuarios.set(

                    correo,

                    {

                        correo,

                        nombre:
                            `${compra.usuario?.nombre || ""} ${compra.usuario?.apellido || ""}`
                                .trim() ||
                            correo

                    }

                );

            }

        }

    );


    const usuariosParaFiltro =
        Array.from(
            mapaUsuarios.values()
        );



    /*
    ========================================================
    HISTORIAL FILTRADO
    ========================================================
    */

    const historialFiltrado =
        historialOrdenado.filter(

            compra => {


                const coincideUsuario =

                    filtroUsuario ===
                    "TODOS"

                    ||

                    compra.usuario?.correo ===
                    filtroUsuario;



                const coincideEstado =

                    filtroEstado ===
                    "TODAS"

                    ||

                    compra.estado ===
                    filtroEstado;



                return (

                    coincideUsuario &&
                    coincideEstado

                );

            }

        );



    /*
    ========================================================
    FORMATEAR PRECIO
    ========================================================
    */

    function formatearPrecio(
        valor
    ) {

        return Number(
            valor || 0
        ).toLocaleString(
            "es-CL"
        );

    }



    /*
    ========================================================
    CONTAR COMPRAS POR USUARIO
    ========================================================
    */

    function obtenerComprasUsuario(
        correo
    ) {

        return comprasAprobadas.filter(

            compra =>
                compra.usuario?.correo ===
                correo

        );

    }



    /*
    ========================================================
    TOTAL GASTADO POR USUARIO
    ========================================================
    */

    function obtenerTotalUsuario(
        correo
    ) {

        return obtenerComprasUsuario(
            correo
        ).reduce(

            (
                acumulador,
                compra
            ) => {

                return (

                    acumulador +
                    (
                        Number(
                            compra.total
                        ) || 0
                    )

                );

            },

            0

        );

    }



    /*
    ========================================================
    CAMBIO INPUT PRODUCTO
    ========================================================
    */

    function cambiarCampo(
        event
    ) {

        const {
            name,
            value
        } = event.target;


        setFormulario({

            ...formulario,

            [name]:
                value

        });

    }



    /*
    ========================================================
    NUEVO PRODUCTO
    ========================================================
    */

    function abrirNuevoProducto() {

        setModoEdicion(
            false
        );

        setCodigoOriginal(
            ""
        );

        setFormulario(
            productoVacio
        );

        setMensaje(
            ""
        );

        setFormularioVisible(
            true
        );

    }



    /*
    ========================================================
    EDITAR PRODUCTO
    ========================================================
    */

    function abrirEditar(
        producto
    ) {

        setModoEdicion(
            true
        );

        setCodigoOriginal(
            producto.codigo
        );

        setFormulario({
            ...producto
        });

        setMensaje(
            ""
        );

        setFormularioVisible(
            true
        );

    }



    /*
    ========================================================
    CANCELAR FORMULARIO
    ========================================================
    */

    function cancelarFormulario() {

        setFormularioVisible(
            false
        );

        setModoEdicion(
            false
        );

        setCodigoOriginal(
            ""
        );

        setFormulario(
            productoVacio
        );

        setMensaje(
            ""
        );

    }



    /*
    ========================================================
    GUARDAR PRODUCTO
    ========================================================
    */

    async function guardarProducto(
        event
    ) {

        event.preventDefault();



        /*
        Validaciones básicas.
        */

        if (

            !formulario.codigo.trim() ||

            !formulario.nombre.trim() ||

            !formulario.descripcion.trim()

        ) {

            setMensaje(
                "Debes completar los campos obligatorios."
            );

            return;

        }



        if (
            Number(
                formulario.precio
            ) <= 0
        ) {

            setMensaje(
                "El precio debe ser mayor que cero."
            );

            return;

        }



        if (
            Number(
                formulario.stock
            ) < 0
        ) {

            setMensaje(
                "El stock no puede ser negativo."
            );

            return;

        }



        /*
        Preparamos el producto antes de enviarlo
        al ProductContext.
        */

        const productoPreparado = {

            codigo:
                formulario.codigo
                    .trim()
                    .toUpperCase(),

            nombre:
                formulario.nombre
                    .trim(),

            categoria:
                formulario.categoria,

            precio:
                Number(
                    formulario.precio
                ),

            stock:
                Number(
                    formulario.stock
                ),

            icono:
                formulario.icono ||
                "📦",

            imagen:
                formulario.imagen
                    .trim(),

            descripcion:
                formulario.descripcion
                    .trim()

        };



        /*
        Edición.
        */

        if (
            modoEdicion
        ) {

            const resultado =
                await editarProducto(

                    codigoOriginal,

                    productoPreparado

                );


            setMensaje(
                resultado.mensaje
            );


            if (!resultado.ok) {

                return;

            }

        }

        else {


            /*
            Nuevo producto.
            */

            const resultado =
                await agregarProducto(
                    productoPreparado
                );


            if (
                !resultado.ok
            ) {

                setMensaje(
                    resultado.mensaje
                );

                return;

            }


            setMensaje(
                "Producto agregado correctamente."
            );

        }



        setFormulario(
            productoVacio
        );

        setModoEdicion(
            false
        );

        setCodigoOriginal(
            ""
        );

        setFormularioVisible(
            false
        );

    }



    /*
    ========================================================
    ELIMINAR PRODUCTO
    ========================================================
    */

    async function confirmarEliminar(
        producto
    ) {

        const confirmar =
            window.confirm(

                `¿Deseas eliminar "${producto.nombre}"?`

            );


        if (
            !confirmar
        ) {

            return;

        }


        const resultado =
            await eliminarProducto(
                producto.codigo
            );


        setMensaje(
            resultado.mensaje
        );

    }



    /*
    ========================================================
    RENDER
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

                        LIFETRACK ADMIN

                    </span>


                    <h1>

                        Panel de control

                    </h1>


                    <p>

                        Administración, ventas,
                        usuarios y reportes de LifeTrack.

                    </p>


                </div>



                {
                    errorAdmin && (

                        <div className="alert alert-warning">

                            {errorAdmin}

                        </div>

                    )
                }


                {/* ==================================================
                    MENÚ ADMINISTRADOR
                ================================================== */}

                <div className="lt-admin-menu">


                    <button

                        type="button"

                        className={

                            seccion ===
                            "resumen"

                                ? "btn btn-primary"

                                : "btn btn-outline-primary"

                        }

                        onClick={
                            () =>
                                setSeccion(
                                    "resumen"
                                )
                        }

                    >

                        📊 Resumen

                    </button>



                    <button

                        type="button"

                        className={

                            seccion ===
                            "historial"

                                ? "btn btn-primary"

                                : "btn btn-outline-primary"

                        }

                        onClick={
                            () =>
                                setSeccion(
                                    "historial"
                                )
                        }

                    >

                        🧾 Historial de compras

                    </button>



                    <button

                        type="button"

                        className={

                            seccion ===
                            "productos"

                                ? "btn btn-primary"

                                : "btn btn-outline-primary"

                        }

                        onClick={
                            () =>
                                setSeccion(
                                    "productos"
                                )
                        }

                    >

                        📦 Productos

                    </button>



                    <button

                        type="button"

                        className={

                            seccion ===
                            "usuarios"

                                ? "btn btn-primary"

                                : "btn btn-outline-primary"

                        }

                        onClick={
                            () =>
                                setSeccion(
                                    "usuarios"
                                )
                        }

                    >

                        👥 Usuarios

                    </button>


                </div>



                {/* ==================================================
                    RESUMEN
                ================================================== */}

                {

                    seccion ===
                    "resumen"

                    && (

                        <>


                            <div className="lt-admin-report-grid">


                                <article className="lt-admin-report-card">


                                    <span className="lt-admin-report-icon">

                                        🧾

                                    </span>


                                    <p>

                                        Operaciones

                                    </p>


                                    <strong>

                                        {totalOperaciones}

                                    </strong>


                                    <small>

                                        Aprobadas + rechazadas

                                    </small>


                                </article>



                                <article className="lt-admin-report-card">


                                    <span className="lt-admin-report-icon">

                                        ✅

                                    </span>


                                    <p>

                                        Ventas aprobadas

                                    </p>


                                    <strong>

                                        {totalVentas}

                                    </strong>


                                    <small>

                                        Compras exitosas

                                    </small>


                                </article>



                                <article className="lt-admin-report-card">


                                    <span className="lt-admin-report-icon">

                                        ❌

                                    </span>


                                    <p>

                                        Rechazadas

                                    </p>


                                    <strong>

                                        {totalRechazadas}

                                    </strong>


                                    <small>

                                        Pagos no procesados

                                    </small>


                                </article>



                                <article className="lt-admin-report-card">


                                    <span className="lt-admin-report-icon">

                                        💰

                                    </span>


                                    <p>

                                        Ingresos

                                    </p>


                                    <strong>

                                        $

                                        {
                                            formatearPrecio(
                                                ingresosTotales
                                            )
                                        }

                                    </strong>


                                    <small>

                                        Solo ventas aprobadas

                                    </small>


                                </article>



                                <article className="lt-admin-report-card">


                                    <span className="lt-admin-report-icon">

                                        📦

                                    </span>


                                    <p>

                                        Unidades vendidas

                                    </p>


                                    <strong>

                                        {unidadesVendidas}

                                    </strong>


                                    <small>

                                        Productos aprobados

                                    </small>


                                </article>



                                <article className="lt-admin-report-card">


                                    <span className="lt-admin-report-icon">

                                        👥

                                    </span>


                                    <p>

                                        Usuarios

                                    </p>


                                    <strong>

                                        {usuarios.length}

                                    </strong>


                                    <small>

                                        Registrados

                                    </small>


                                </article>


                            </div>



                            {/* ======================================
                                PRODUCTO MÁS VENDIDO
                            ====================================== */}

                            <div className="lt-admin-highlight">


                                <div>


                                    <span className="lt-admin-small-label">

                                        PRODUCTO DESTACADO

                                    </span>


                                    <h2>

                                        🏆 Producto más vendido

                                    </h2>


                                    {

                                        productoMasVendido

                                            ? (

                                                <p>

                                                    {
                                                        productoMasVendido.nombre
                                                    }

                                                    {" · "}

                                                    <strong>

                                                        {
                                                            productoMasVendido.cantidad
                                                        }

                                                        {" "}

                                                        unidad
                                                        {
                                                            productoMasVendido.cantidad === 1
                                                                ? ""
                                                                : "es"
                                                        }

                                                    </strong>

                                                </p>

                                            )

                                            : (

                                                <p>

                                                    Aún no existen ventas
                                                    aprobadas.

                                                </p>

                                            )

                                    }


                                </div>


                            </div>



                            {/* ======================================
                                ÚLTIMAS COMPRAS
                            ====================================== */}

                            <div className="admin-tabla lt-admin-block">


                                <div className="lt-admin-title-row">


                                    <div>


                                        <span className="lt-admin-small-label">

                                            ACTIVIDAD RECIENTE

                                        </span>


                                        <h2>

                                            Últimas operaciones

                                        </h2>


                                    </div>


                                    <button

                                        type="button"

                                        className="btn btn-outline-primary"

                                        onClick={
                                            () =>
                                                setSeccion(
                                                    "historial"
                                                )
                                        }

                                    >

                                        Ver historial completo

                                    </button>


                                </div>



                                {

                                    historialOrdenado.length ===
                                    0

                                        ? (

                                            <p>

                                                Aún no existen compras
                                                registradas.

                                            </p>

                                        )

                                        : (

                                            <div className="lt-admin-table-scroll">


                                                <table>


                                                    <thead>


                                                        <tr>

                                                            <th>
                                                                Orden
                                                            </th>

                                                            <th>
                                                                Cliente
                                                            </th>

                                                            <th>
                                                                Fecha
                                                            </th>

                                                            <th>
                                                                Total
                                                            </th>

                                                            <th>
                                                                Estado
                                                            </th>

                                                        </tr>


                                                    </thead>


                                                    <tbody>


                                                        {

                                                            historialOrdenado
                                                                .slice(
                                                                    0,
                                                                    5
                                                                )
                                                                .map(

                                                                    compra => (

                                                                        <tr
                                                                            key={
                                                                                compra.id ||
                                                                                compra.numeroOrden
                                                                            }
                                                                        >

                                                                            <td>

                                                                                {
                                                                                    compra.numeroOrden
                                                                                }

                                                                            </td>


                                                                            <td>

                                                                                {
                                                                                    compra.usuario?.nombre ||
                                                                                    compra.usuario?.correo ||
                                                                                    "Usuario"
                                                                                }

                                                                            </td>


                                                                            <td>

                                                                                {
                                                                                    compra.fecha
                                                                                }

                                                                            </td>


                                                                            <td>

                                                                                $

                                                                                {
                                                                                    formatearPrecio(
                                                                                        compra.total
                                                                                    )
                                                                                }

                                                                            </td>


                                                                            <td>

                                                                                <span
                                                                                    className={
                                                                                        compra.estado ===
                                                                                        "EXITOSA"

                                                                                            ? "lt-admin-status success"

                                                                                            : "lt-admin-status rejected"
                                                                                    }
                                                                                >

                                                                                    {
                                                                                        compra.estado ===
                                                                                        "EXITOSA"

                                                                                            ? "APROBADA"

                                                                                            : "RECHAZADA"
                                                                                    }

                                                                                </span>

                                                                            </td>

                                                                        </tr>

                                                                    )

                                                                )

                                                        }


                                                    </tbody>


                                                </table>


                                            </div>

                                        )

                                }


                            </div>


                        </>

                    )

                }



                {/* ==================================================
                    HISTORIAL DE COMPRAS
                ================================================== */}

                {

                    seccion ===
                    "historial"

                    && (

                        <div className="admin-tabla lt-admin-block">


                            <div className="lt-admin-history-header">


                                <div>


                                    <span className="lt-admin-small-label">

                                        REPORTES

                                    </span>


                                    <h2>

                                        Historial de compras

                                    </h2>


                                    <p>

                                        Consulta todas las operaciones
                                        o filtra por usuario y estado.

                                    </p>


                                </div>


                            </div>



                            {/* ======================================
                                FILTROS
                            ====================================== */}

                            <div className="lt-admin-filters">


                                <div>


                                    <label htmlFor="filtroUsuario">

                                        Usuario

                                    </label>


                                    <select

                                        id="filtroUsuario"

                                        className="form-control"

                                        value={
                                            filtroUsuario
                                        }

                                        onChange={
                                            event =>
                                                setFiltroUsuario(
                                                    event.target.value
                                                )
                                        }

                                    >


                                        <option value="TODOS">

                                            Todos los usuarios

                                        </option>


                                        {

                                            usuariosParaFiltro.map(

                                                usuarioFiltro => (

                                                    <option

                                                        key={
                                                            usuarioFiltro.correo
                                                        }

                                                        value={
                                                            usuarioFiltro.correo
                                                        }

                                                    >

                                                        {
                                                            usuarioFiltro.nombre
                                                        }

                                                        {" · "}

                                                        {
                                                            usuarioFiltro.correo
                                                        }

                                                    </option>

                                                )

                                            )

                                        }


                                    </select>


                                </div>



                                <div>


                                    <label htmlFor="filtroEstado">

                                        Estado

                                    </label>


                                    <select

                                        id="filtroEstado"

                                        className="form-control"

                                        value={
                                            filtroEstado
                                        }

                                        onChange={
                                            event =>
                                                setFiltroEstado(
                                                    event.target.value
                                                )
                                        }

                                    >


                                        <option value="TODAS">

                                            Todas

                                        </option>


                                        <option value="EXITOSA">

                                            Aprobadas

                                        </option>


                                        <option value="RECHAZADA">

                                            Rechazadas

                                        </option>


                                    </select>


                                </div>


                            </div>



                            <div className="lt-admin-filter-result">


                                <strong>

                                    {
                                        historialFiltrado.length
                                    }

                                </strong>

                                {" "}

                                operación

                                {
                                    historialFiltrado.length === 1
                                        ? ""
                                        : "es"
                                }

                                {" "}

                                encontrada

                                {
                                    historialFiltrado.length === 1
                                        ? ""
                                        : "s"
                                }.


                            </div>



                            {/* ======================================
                                TABLA HISTORIAL
                            ====================================== */}

                            {

                                historialFiltrado.length ===
                                0

                                    ? (

                                        <div className="lt-admin-empty">

                                            <span>
                                                🧾
                                            </span>

                                            <h3>

                                                No hay compras para
                                                mostrar

                                            </h3>

                                            <p>

                                                Cambia los filtros o
                                                realiza nuevas compras
                                                desde la tienda.

                                            </p>

                                        </div>

                                    )

                                    : (

                                        <div className="lt-admin-table-scroll">


                                            <table>


                                                <thead>


                                                    <tr>

                                                        <th>
                                                            Orden
                                                        </th>

                                                        <th>
                                                            Usuario
                                                        </th>

                                                        <th>
                                                            Correo
                                                        </th>

                                                        <th>
                                                            Fecha
                                                        </th>

                                                        <th>
                                                            Productos
                                                        </th>

                                                        <th>
                                                            Total
                                                        </th>

                                                        <th>
                                                            Estado
                                                        </th>

                                                    </tr>


                                                </thead>


                                                <tbody>


                                                    {

                                                        historialFiltrado.map(

                                                            compra => (

                                                                <tr
                                                                    key={
                                                                        compra.id ||
                                                                        compra.numeroOrden
                                                                    }
                                                                >


                                                                    <td>

                                                                        {
                                                                            compra.numeroOrden
                                                                        }

                                                                    </td>


                                                                    <td>

                                                                        {
                                                                            `${compra.usuario?.nombre || ""} ${compra.usuario?.apellido || ""}`
                                                                                .trim()
                                                                            ||
                                                                            "Usuario"
                                                                        }

                                                                    </td>


                                                                    <td>

                                                                        {
                                                                            compra.usuario?.correo ||
                                                                            "Sin correo"
                                                                        }

                                                                    </td>


                                                                    <td>

                                                                        {
                                                                            compra.fecha
                                                                        }

                                                                    </td>


                                                                    <td>

                                                                        <div className="lt-admin-products-list">


                                                                            {

                                                                                (
                                                                                    compra.productos ||
                                                                                    []
                                                                                ).map(

                                                                                    producto => (

                                                                                        <span
                                                                                            key={
                                                                                                `${compra.numeroOrden}-${producto.codigo}`
                                                                                            }
                                                                                        >

                                                                                            {
                                                                                                producto.nombre
                                                                                            }

                                                                                            {" × "}

                                                                                            {
                                                                                                producto.cantidad
                                                                                            }

                                                                                        </span>

                                                                                    )

                                                                                )

                                                                            }


                                                                        </div>

                                                                    </td>


                                                                    <td>

                                                                        <strong>

                                                                            $

                                                                            {
                                                                                formatearPrecio(
                                                                                    compra.total
                                                                                )
                                                                            }

                                                                        </strong>

                                                                    </td>


                                                                    <td>

                                                                        <span
                                                                            className={
                                                                                compra.estado ===
                                                                                "EXITOSA"

                                                                                    ? "lt-admin-status success"

                                                                                    : "lt-admin-status rejected"
                                                                            }
                                                                        >

                                                                            {
                                                                                compra.estado ===
                                                                                "EXITOSA"

                                                                                    ? "APROBADA"

                                                                                    : "RECHAZADA"
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                </tr>

                                                            )

                                                        )

                                                    }


                                                </tbody>


                                            </table>


                                        </div>

                                    )

                            }


                        </div>

                    )

                }



                {/* ==================================================
                    PRODUCTOS
                ================================================== */}

                {

                    seccion ===
                    "productos"

                    && (

                        <>


                            <div className="lt-admin-section-heading">


                                <div>


                                    <span className="lt-admin-small-label">

                                        CATÁLOGO

                                    </span>


                                    <h2>

                                        Gestión de productos

                                    </h2>


                                    <p>

                                        Agrega, edita o elimina
                                        productos de LifeTrack.

                                    </p>


                                </div>



                                <button

                                    type="button"

                                    className="btn btn-primary"

                                    onClick={
                                        abrirNuevoProducto
                                    }

                                >

                                    + Nuevo producto

                                </button>


                            </div>



                            {/* ======================================
                                FORMULARIO PRODUCTO
                            ====================================== */}

                            {

                                formularioVisible && (

                                    <div className="admin-tabla lt-admin-block">


                                        <h2>

                                            {

                                                modoEdicion

                                                    ? "Editar producto"

                                                    : "Agregar producto"

                                            }

                                        </h2>



                                        {

                                            mensaje && (

                                                <div className="alert alert-warning">

                                                    {mensaje}

                                                </div>

                                            )

                                        }



                                        <form
                                            onSubmit={
                                                guardarProducto
                                            }
                                        >


                                            <div className="lt-admin-product-form-grid">


                                                <div>


                                                    <label>
                                                        Código
                                                    </label>


                                                    <input

                                                        className="form-control"

                                                        name="codigo"

                                                        value={
                                                            formulario.codigo
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                        placeholder="Ej: BOX002"

                                                    />


                                                </div>



                                                <div>


                                                    <label>
                                                        Nombre
                                                    </label>


                                                    <input

                                                        className="form-control"

                                                        name="nombre"

                                                        value={
                                                            formulario.nombre
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                        placeholder="Nombre del producto"

                                                    />


                                                </div>



                                                <div>


                                                    <label>
                                                        Precio
                                                    </label>


                                                    <input

                                                        className="form-control"

                                                        name="precio"

                                                        type="number"

                                                        min="1"

                                                        value={
                                                            formulario.precio
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                    />


                                                </div>



                                                <div>


                                                    <label>
                                                        Stock
                                                    </label>


                                                    <input

                                                        className="form-control"

                                                        name="stock"

                                                        type="number"

                                                        min="0"

                                                        value={
                                                            formulario.stock
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                    />


                                                </div>



                                                <div>


                                                    <label>
                                                        Categoría
                                                    </label>


                                                    <select

                                                        className="form-control"

                                                        name="categoria"

                                                        value={
                                                            formulario.categoria
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                    >


                                                        <option value="Fitness">
                                                            Fitness
                                                        </option>

                                                        <option value="Estudio">
                                                            Estudio
                                                        </option>

                                                        <option value="Trabajo">
                                                            Trabajo
                                                        </option>

                                                        <option value="Boxeo">
                                                            Boxeo
                                                        </option>


                                                    </select>


                                                </div>



                                                <div>


                                                    <label>
                                                        Icono
                                                    </label>


                                                    <input

                                                        className="form-control"

                                                        name="icono"

                                                        value={
                                                            formulario.icono
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                        placeholder="Ej: 🥊"

                                                    />


                                                </div>



                                                <div className="lt-admin-form-full">


                                                    <label>

                                                        URL de imagen

                                                    </label>


                                                    <input

                                                        className="form-control"

                                                        name="imagen"

                                                        value={
                                                            formulario.imagen
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                        placeholder="https://..."

                                                    />


                                                </div>



                                                <div className="lt-admin-form-full">


                                                    <label>

                                                        Descripción

                                                    </label>


                                                    <textarea

                                                        className="form-control"

                                                        rows="4"

                                                        name="descripcion"

                                                        value={
                                                            formulario.descripcion
                                                        }

                                                        onChange={
                                                            cambiarCampo
                                                        }

                                                    />


                                                </div>


                                            </div>



                                            <div className="lt-admin-form-actions">


                                                <button

                                                    type="submit"

                                                    className="btn btn-primary"

                                                >

                                                    {

                                                        modoEdicion

                                                            ? "Guardar cambios"

                                                            : "Guardar producto"

                                                    }

                                                </button>



                                                <button

                                                    type="button"

                                                    className="btn btn-outline-secondary"

                                                    onClick={
                                                        cancelarFormulario
                                                    }

                                                >

                                                    Cancelar

                                                </button>


                                            </div>


                                        </form>


                                    </div>

                                )

                            }



                            {/* ======================================
                                TABLA PRODUCTOS
                            ====================================== */}

                            <div className="admin-tabla lt-admin-block">


                                <div className="lt-admin-table-scroll">


                                    <table>


                                        <thead>


                                            <tr>

                                                <th>
                                                    Código
                                                </th>

                                                <th>
                                                    Producto
                                                </th>

                                                <th>
                                                    Categoría
                                                </th>

                                                <th>
                                                    Precio
                                                </th>

                                                <th>
                                                    Stock
                                                </th>

                                                <th>
                                                    Acciones
                                                </th>

                                            </tr>


                                        </thead>


                                        <tbody>


                                            {

                                                productos.map(

                                                    producto => (

                                                        <tr
                                                            key={
                                                                producto.codigo
                                                            }
                                                        >


                                                            <td>

                                                                {
                                                                    producto.codigo
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    producto.icono
                                                                }

                                                                {" "}

                                                                {
                                                                    producto.nombre
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    producto.categoria
                                                                }

                                                            </td>


                                                            <td>

                                                                $

                                                                {
                                                                    Number(
                                                                        producto.precio
                                                                    ).toLocaleString(
                                                                        "es-CL"
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    producto.stock
                                                                }

                                                            </td>


                                                            <td>


                                                                <div className="lt-admin-actions">


                                                                    <button

                                                                        type="button"

                                                                        className="btn btn-sm btn-outline-primary"

                                                                        onClick={
                                                                            () =>
                                                                                abrirEditar(
                                                                                    producto
                                                                                )
                                                                        }

                                                                    >

                                                                        Editar

                                                                    </button>


                                                                    <button

                                                                        type="button"

                                                                        className="btn btn-sm btn-outline-danger"

                                                                        onClick={
                                                                            () =>
                                                                                confirmarEliminar(
                                                                                    producto
                                                                                )
                                                                        }

                                                                    >

                                                                        Eliminar

                                                                    </button>


                                                                </div>


                                                            </td>


                                                        </tr>

                                                    )

                                                )

                                            }


                                        </tbody>


                                    </table>


                                </div>



                                <div className="lt-admin-restore">


                                    <button

                                        type="button"

                                        className="btn btn-outline-secondary"

                                        onClick={
                                            restaurarProductos
                                        }

                                    >

                                        Restaurar productos originales

                                    </button>


                                </div>


                            </div>


                        </>

                    )

                }



                {/* ==================================================
                    USUARIOS
                ================================================== */}

                {

                    seccion ===
                    "usuarios"

                    && (

                        <div className="admin-tabla lt-admin-block">


                            <span className="lt-admin-small-label">

                                CLIENTES

                            </span>


                            <h2>

                                Usuarios registrados

                            </h2>


                            <p>

                                Visualiza los clientes registrados,
                                sus compras y su gasto acumulado.

                            </p>



                            {

                                usuarios.length ===
                                0

                                    ? (

                                        <p>

                                            No existen usuarios
                                            registrados.

                                        </p>

                                    )

                                    : (

                                        <div className="lt-admin-table-scroll">


                                            <table>


                                                <thead>


                                                    <tr>

                                                        <th>
                                                            RUN
                                                        </th>

                                                        <th>
                                                            Nombre
                                                        </th>

                                                        <th>
                                                            Correo
                                                        </th>

                                                        <th>
                                                            Región
                                                        </th>

                                                        <th>
                                                            Comuna
                                                        </th>

                                                        <th>
                                                            Rol
                                                        </th>

                                                        <th>
                                                            Compras
                                                        </th>

                                                        <th>
                                                            Total gastado
                                                        </th>

                                                        <th>
                                                            Historial
                                                        </th>

                                                    </tr>


                                                </thead>


                                                <tbody>


                                                    {

                                                        usuarios.map(

                                                            usuarioRegistrado => {


                                                                const comprasUsuario =
                                                                    obtenerComprasUsuario(
                                                                        usuarioRegistrado.correo
                                                                    );


                                                                const totalUsuario =
                                                                    obtenerTotalUsuario(
                                                                        usuarioRegistrado.correo
                                                                    );


                                                                return (

                                                                    <tr
                                                                        key={
                                                                            usuarioRegistrado.id ||
                                                                            usuarioRegistrado.correo
                                                                        }
                                                                    >


                                                                        <td>

                                                                            {
                                                                                usuarioRegistrado.run
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            {
                                                                                usuarioRegistrado.nombre
                                                                            }

                                                                            {" "}

                                                                            {
                                                                                usuarioRegistrado.apellido
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            {
                                                                                usuarioRegistrado.correo
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            {
                                                                                usuarioRegistrado.region
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            {
                                                                                usuarioRegistrado.comuna
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            {
                                                                                usuarioRegistrado.rol
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            {
                                                                                comprasUsuario.length
                                                                            }

                                                                        </td>


                                                                        <td>

                                                                            <strong>

                                                                                $

                                                                                {
                                                                                    formatearPrecio(
                                                                                        totalUsuario
                                                                                    )
                                                                                }

                                                                            </strong>

                                                                        </td>


                                                                        <td>


                                                                            <button

                                                                                type="button"

                                                                                className="btn btn-sm btn-outline-primary"

                                                                                onClick={
                                                                                    () => {

                                                                                        setFiltroUsuario(
                                                                                            usuarioRegistrado.correo
                                                                                        );

                                                                                        setFiltroEstado(
                                                                                            "TODAS"
                                                                                        );

                                                                                        setSeccion(
                                                                                            "historial"
                                                                                        );

                                                                                    }
                                                                                }

                                                                            >

                                                                                Ver compras

                                                                            </button>


                                                                        </td>


                                                                    </tr>

                                                                );

                                                            }

                                                        )

                                                    }


                                                </tbody>


                                            </table>


                                        </div>

                                    )

                            }


                        </div>

                    )

                }


            </div>


        </section>

    );

}


export default Admin;