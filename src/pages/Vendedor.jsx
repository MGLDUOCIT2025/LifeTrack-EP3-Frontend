
/*
====================================================
LIFETRACK - EVALUACIÓN PARCIAL 3
VENDEDOR.JSX

Panel exclusivo para el rol VENDEDOR.

Permite:
- Consultar productos y sus detalles.
- Consultar órdenes y sus detalles.
- Visualizar precios, stock y cantidades.

No permite:
- Crear productos.
- Editar productos.
- Eliminar productos.
- Administrar usuarios.
- Realizar compras.
====================================================
*/

import { useEffect, useState } from "react";

import {
  apiListarProductos,
  apiListarBoletas
} from "../services/api.js";

// Formatear precios en pesos chilenos.
function dinero(valor) {
  return Number(valor || 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
}

function Vendedor() {

  const [productos, setProductos] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consultar los endpoints reales de Spring Boot.
  useEffect(() => {

    let activo = true;

    async function cargarDatos() {

      try {

        const [datosProductos, datosBoletas] =
          await Promise.all([
            apiListarProductos(),
            apiListarBoletas()
          ]);

        if (!activo) return;

        setProductos(
          Array.isArray(datosProductos)
            ? datosProductos
            : []
        );

        setBoletas(
          Array.isArray(datosBoletas)
            ? datosBoletas
            : []
        );

      } catch (err) {

        if (activo) {
          setError(
            err.message ||
            "No fue posible cargar los datos."
          );
        }

      } finally {

        if (activo) setCargando(false);

      }
    }

    cargarDatos();

    return () => {
      activo = false;
    };

  }, []);

  return (
    <section className="container py-5">

      <h1>Panel Vendedor</h1>

      <p className="text-muted">
        Bienvenido a LifeTrack.
        Aquí puedes consultar productos y órdenes.
        Tu usuario tiene permisos de solo lectura.
      </p>

      {/* ESTADOS DE CARGA */}
      {cargando && (
        <p role="status">
          Cargando información del backend...
        </p>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!cargando && !error && (
        <>

          {/* PRODUCTOS */}
          <h2 className="h4 mt-4">
            Productos ({productos.length})
          </h2>

          <div className="table-responsive">
            <table className="table table-striped table-bordered">

              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Detalle</th>
                </tr>
              </thead>

              <tbody>

                {productos.map((producto) => (
                  <tr key={producto.id}>

                    <td>{producto.codigo}</td>

                    <td>{producto.nombre}</td>

                    <td>
                      {producto.categoria?.nombre || "—"}
                    </td>

                    <td>
                      {dinero(producto.precio)}
                    </td>

                    <td>{producto.stock}</td>

                    <td>
                      <details>
                        <summary>Ver detalle</summary>

                        <p>
                          {producto.descripcion ||
                            "Sin descripción"}
                        </p>

                        <p>
                          Precio: {dinero(producto.precio)}
                        </p>

                        <p>
                          Stock: {producto.stock}
                        </p>
                      </details>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* ÓRDENES / BOLETAS */}
          <h2 className="h4 mt-5">
            Órdenes / boletas ({boletas.length})
          </h2>

          {boletas.length === 0 && (
            <p>No hay órdenes registradas.</p>
          )}

          {boletas.map((boleta) => (

            <details
              key={boleta.id}
              className="border rounded p-3 mb-3"
            >

              <summary>
                <strong>
                  Boleta #{boleta.id}
                </strong>

                {" — "}

                {boleta.fecha
                  ? new Date(boleta.fecha).toLocaleString("es-CL")
                  : "Sin fecha"}

                {" — "}

                {dinero(boleta.total)}

                {" — "}

                {boleta.estado}
              </summary>

              <p className="mt-2 mb-2">
                Cliente: {boleta.usuario?.nombre || "—"}{" "}
                {boleta.usuario?.apellido || ""}

                {" ("}
                {boleta.usuario?.correo || "—"}
                {")"}
              </p>

              <div className="table-responsive">
                <table className="table table-sm">

                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio unitario</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>

                    {(boleta.detalles || []).map(
                      (detalle) => (
                        <tr key={detalle.id}>

                          <td>
                            {detalle.producto?.nombre ||
                              "Producto"}
                          </td>

                          <td>{detalle.cantidad}</td>

                          <td>
                            {dinero(detalle.precioUnitario)}
                          </td>

                          <td>
                            {dinero(detalle.subtotal)}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>
                </table>
              </div>

            </details>
          ))}

        </>
      )}

    </section>
  );
}

export default Vendedor;
