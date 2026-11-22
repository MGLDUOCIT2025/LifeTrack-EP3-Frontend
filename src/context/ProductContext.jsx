import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import {
  productos as productosIniciales
} from "../data/productos.js";

import {
  useAuth
} from "./AuthContext.jsx";

import {
  apiCrearProducto,
  apiEditarProducto,
  apiEliminarProducto,
  apiListarCategorias,
  apiListarProductos
} from "../services/api.js";

import shaker from "../assets/lifetrack/shaker.png";
import cuaderno from "../assets/lifetrack/cuaderno.png";
import polera from "../assets/lifetrack/polera.png";
import guantes from "../assets/lifetrack/guantes.png";

/*
=========================================================
PRODUCTCONTEXT.JSX
LifeTrack - EP3
=========================================================

Los productos autenticados provienen de Spring Boot.
Cuando no hay sesión se conserva el catálogo local
para no romper la portada/tienda.
=========================================================
*/

const ProductContext = createContext(null);

const imagenesLocales = {
  "LT-001": shaker,
  "LT-002": cuaderno,
  "LT-003": polera,
  "LT-004": guantes
};

function adaptarProductoBackend(producto) {
  const codigo = producto.codigo || "";

  return {
    ...producto,
    categoria:
      producto.categoria?.nombre ||
      producto.categoria ||
      "Sin categoría",
    categoriaId:
      producto.categoria?.id ||
      producto.categoriaId ||
      null,
    precio:
      Number(producto.precio) || 0,
    stock:
      Number(producto.stock) || 0,
    imagen:
      producto.imagen ||
      imagenesLocales[codigo] ||
      "",
    icono:
      producto.icono || "📦"
  };
}

export function ProductProvider({ children }) {
  const {
    estaAutenticado
  } = useAuth();

  const [
    productos,
    setProductos
  ] = useState(productosIniciales);

  const [
    categorias,
    setCategorias
  ] = useState([]);

  const [
    cargandoProductos,
    setCargandoProductos
  ] = useState(false);

  const [
    errorProductos,
    setErrorProductos
  ] = useState("");

  const cargarProductos =
    useCallback(async () => {
      if (!estaAutenticado) {
        setProductos(productosIniciales);
        setCategorias([]);
        setErrorProductos("");
        return;
      }

      setCargandoProductos(true);

      try {
        const [
          respuestaProductos,
          respuestaCategorias
        ] = await Promise.all([
          apiListarProductos(),
          apiListarCategorias()
        ]);

        setProductos(
          (respuestaProductos || [])
            .map(adaptarProductoBackend)
        );

        setCategorias(
          respuestaCategorias || []
        );

        setErrorProductos("");
      } catch (error) {
        console.error(
          "Error cargando productos:",
          error
        );

        setErrorProductos(
          error.message ||
          "No fue posible cargar los productos."
        );

        setProductos(productosIniciales);
      } finally {
        setCargandoProductos(false);
      }
    }, [estaAutenticado]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  function obtenerCategoriaId(
    nombreCategoria
  ) {
    const encontrada =
      categorias.find(
        categoria =>
          categoria.nombre
            ?.toLowerCase() ===
          nombreCategoria
            ?.toLowerCase()
      );

    return encontrada?.id || null;
  }

  function prepararProductoApi(
    producto
  ) {
    const categoriaId =
      producto.categoriaId ||
      obtenerCategoriaId(
        producto.categoria
      );

    if (!categoriaId) {
      throw new Error(
        "No fue posible identificar la categoría del producto."
      );
    }

    return {
      codigo:
        producto.codigo
          .trim()
          .toUpperCase(),
      nombre:
        producto.nombre.trim(),
      descripcion:
        producto.descripcion
          ?.trim() || "",
      precio:
        Number(producto.precio),
      stock:
        Number(producto.stock),
      imagen:
        producto.imagen
          ?.trim() || "",
      icono:
        producto.icono || "📦",
      categoriaId
    };
  }

  async function agregarProducto(
    nuevoProducto
  ) {
    try {
      const codigoExiste =
        productos.some(
          producto =>
            producto.codigo
              ?.toUpperCase() ===
            nuevoProducto.codigo
              ?.toUpperCase()
        );

      if (codigoExiste) {
        return {
          ok: false,
          mensaje:
            "Ya existe un producto con ese código."
        };
      }

      await apiCrearProducto(
        prepararProductoApi(
          nuevoProducto
        )
      );

      await cargarProductos();

      return {
        ok: true,
        mensaje:
          "Producto agregado correctamente."
      };
    } catch (error) {
      return {
        ok: false,
        mensaje:
          error.message ||
          "No fue posible agregar el producto."
      };
    }
  }

  async function editarProducto(
    codigoOriginal,
    productoEditado
  ) {
    try {
      const productoOriginal =
        productos.find(
          producto =>
            producto.codigo ===
            codigoOriginal
        );

      if (!productoOriginal?.id) {
        return {
          ok: false,
          mensaje:
            "No se encontró el producto a editar."
        };
      }

      await apiEditarProducto(
        productoOriginal.id,
        prepararProductoApi(
          productoEditado
        )
      );

      await cargarProductos();

      return {
        ok: true,
        mensaje:
          "Producto actualizado correctamente."
      };
    } catch (error) {
      return {
        ok: false,
        mensaje:
          error.message ||
          "No fue posible editar el producto."
      };
    }
  }

  async function eliminarProducto(
    codigo
  ) {
    try {
      const producto =
        productos.find(
          item =>
            item.codigo === codigo
        );

      if (!producto?.id) {
        return {
          ok: false,
          mensaje:
            "No se encontró el producto."
        };
      }

      await apiEliminarProducto(
        producto.id
      );

      await cargarProductos();

      return {
        ok: true,
        mensaje:
          "Producto eliminado correctamente."
      };
    } catch (error) {
      return {
        ok: false,
        mensaje:
          error.message ||
          "No fue posible eliminar el producto."
      };
    }
  }

  function obtenerProducto(codigo) {
    return productos.find(
      producto =>
        producto.codigo === codigo
    );
  }

  async function restaurarProductos() {
    await cargarProductos();

    return {
      ok: true,
      mensaje:
        "Productos recargados desde el backend."
    };
  }

  const valoresContexto = {
    productos,
    categorias,
    cargandoProductos,
    errorProductos,
    cargarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerProducto,
    restaurarProductos
  };

  return (
    <ProductContext.Provider
      value={valoresContexto}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const contexto =
    useContext(ProductContext);

  if (!contexto) {
    throw new Error(
      "useProducts debe utilizarse dentro de ProductProvider."
    );
  }

  return contexto;
}
