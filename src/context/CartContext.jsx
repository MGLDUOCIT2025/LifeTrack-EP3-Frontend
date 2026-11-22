import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";


/*
======================================================
CARTCONTEXT.JSX
LifeTrack

Contexto global del carrito.

Permite:
- Agregar productos.
- Aumentar cantidad.
- Disminuir cantidad.
- Eliminar productos.
- Vaciar carrito.
- Contar productos.
- Calcular total.
- Guardar carrito en localStorage.
======================================================
*/


const CartContext = createContext();


export function CartProvider({ children }) {


  /*
  ====================================================
  RECUPERAR CARRITO DESDE LOCALSTORAGE
  ====================================================
  */

  const [carrito, setCarrito] = useState(() => {

    const carritoGuardado =
      localStorage.getItem(
        "carritoLifeTrack"
      );


    if (!carritoGuardado) {

      return [];

    }


    try {

      const carritoRecuperado =
        JSON.parse(
          carritoGuardado
        );


      /*
      Normalizamos los valores numéricos.

      Esto evita que precio o cantidad puedan
      quedar almacenados como texto.
      */

      return carritoRecuperado.map(
        producto => ({

          ...producto,

          precio:
            Number(
              producto.precio
            ) || 0,

          cantidad:
            Number(
              producto.cantidad
            ) || 1

        })
      );

    } catch (error) {

      console.error(
        "Error recuperando carrito:",
        error
      );

      return [];

    }

  });


  /*
  ====================================================
  GUARDAR CARRITO AUTOMÁTICAMENTE
  ====================================================
  */

  useEffect(() => {

    localStorage.setItem(

      "carritoLifeTrack",

      JSON.stringify(
        carrito
      )

    );

  }, [carrito]);


  /*
  ====================================================
  AGREGAR PRODUCTO
  ====================================================
  */

  function agregarProducto(producto) {

    setCarrito(

      carritoActual => {


        const productoExistente =
          carritoActual.find(

            item =>
              item.codigo ===
              producto.codigo

          );


        /*
        Si el producto ya existe,
        aumentamos su cantidad.
        */

        if (productoExistente) {

          return carritoActual.map(

            item => {

              if (
                item.codigo ===
                producto.codigo
              ) {

                return {

                  ...item,

                  precio:
                    Number(
                      item.precio
                    ) || 0,

                  cantidad:
                    (
                      Number(
                        item.cantidad
                      ) || 0
                    ) + 1

                };

              }


              return item;

            }

          );

        }


        /*
        Si es un producto nuevo,
        lo agregamos con cantidad 1.
        */

        return [

          ...carritoActual,

          {

            ...producto,

            precio:
              Number(
                producto.precio
              ) || 0,

            cantidad: 1

          }

        ];

      }

    );

  }


  /*
  ====================================================
  AUMENTAR CANTIDAD
  ====================================================
  */

  function aumentarCantidad(codigo) {

    setCarrito(

      carritoActual =>

        carritoActual.map(

          producto => {

            if (
              producto.codigo === codigo
            ) {

              return {

                ...producto,

                cantidad:
                  (
                    Number(
                      producto.cantidad
                    ) || 0
                  ) + 1

              };

            }


            return producto;

          }

        )

    );

  }


  /*
  ====================================================
  DISMINUIR CANTIDAD
  ====================================================
  */

  function disminuirCantidad(codigo) {

    setCarrito(

      carritoActual =>

        carritoActual.map(

          producto => {

            if (
              producto.codigo === codigo
            ) {

              const cantidadActual =
                Number(
                  producto.cantidad
                ) || 1;


              return {

                ...producto,

                cantidad:
                  Math.max(
                    1,
                    cantidadActual - 1
                  )

              };

            }


            return producto;

          }

        )

    );

  }


  /*
  ====================================================
  ELIMINAR PRODUCTO
  ====================================================
  */

  function eliminarProducto(codigo) {

    setCarrito(

      carritoActual =>

        carritoActual.filter(

          producto =>
            producto.codigo !== codigo

        )

    );

  }


  /*
  ====================================================
  VACIAR CARRITO
  ====================================================
  */

  function vaciarCarrito() {

    setCarrito([]);

  }


  /*
  ====================================================
  CANTIDAD TOTAL DE PRODUCTOS
  ====================================================
  */

  const cantidadTotal =
    carrito.reduce(

      (
        acumulador,
        producto
      ) => {

        return (

          acumulador +

          (
            Number(
              producto.cantidad
            ) || 0
          )

        );

      },

      0

    );


  /*
  ====================================================
  PRECIO TOTAL DEL CARRITO
  ====================================================

  precio × cantidad de cada producto.
  ====================================================
  */

  const total =
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
  ====================================================
  PROVIDER
  ====================================================
  */

  return (

    <CartContext.Provider

      value={{

        carrito,

        agregarProducto,

        aumentarCantidad,

        disminuirCantidad,

        eliminarProducto,

        vaciarCarrito,

        cantidadTotal,

        total

      }}

    >

      {children}

    </CartContext.Provider>

  );

}


/*
======================================================
HOOK PERSONALIZADO
======================================================
*/

export function useCart() {

  return useContext(
    CartContext
  );

}