import {
  createContext,
  useContext,
  useState
} from "react";

import {
  apiLogin,
  apiRegistro,
  eliminarToken,
  guardarToken,
  obtenerToken
} from "../services/api.js";

/*
==========================================================
AUTHCONTEXT.JSX
LifeTrack - EP3
==========================================================

La autenticación ahora utiliza Spring Boot + JWT.
Las contraseñas ya no se guardan en el navegador.
==========================================================
*/

const AuthContext = createContext();

function normalizarUsuario(datos) {
  if (!datos) {
    return null;
  }

  return {
    id: datos.id ?? null,
    nombre: datos.nombre || "",
    apellido: datos.apellido || "",
    correo: datos.correo || "",
    rol: String(datos.rol || "CLIENTE").toLowerCase()
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = obtenerToken();
    const usuarioGuardado =
      localStorage.getItem("usuarioActivo");

    if (!token || !usuarioGuardado) {
      return null;
    }

    try {
      return JSON.parse(usuarioGuardado);
    } catch (error) {
      console.error(
        "No fue posible recuperar la sesión:",
        error
      );

      localStorage.removeItem("usuarioActivo");
      eliminarToken();
      return null;
    }
  });

  const token = obtenerToken();

  async function login(correo, password) {
    try {
      const datos = await apiLogin(
        correo.trim().toLowerCase(),
        password
      );

      guardarToken(datos.token);

      const usuarioSesion =
        normalizarUsuario(datos);

      localStorage.setItem(
        "usuarioActivo",
        JSON.stringify(usuarioSesion)
      );

      setUsuario(usuarioSesion);

      return {
        ok: true,
        usuario: usuarioSesion
      };
    } catch (error) {
      return {
        ok: false,
        mensaje:
          error.message ||
          "Correo o contraseña incorrectos."
      };
    }
  }

  async function registrar(datosUsuario) {
    try {
      const respuesta =
        await apiRegistro(datosUsuario);

      return {
        ok: true,
        data: respuesta
      };
    } catch (error) {
      return {
        ok: false,
        mensaje:
          error.message ||
          "No fue posible crear la cuenta."
      };
    }
  }

  function logout() {
    eliminarToken();
    localStorage.removeItem("usuarioActivo");
    setUsuario(null);
  }

  const estaAutenticado =
    Boolean(usuario && token);

  const esAdmin =
    usuario?.rol === "admin";

  const esVendedor =
    usuario?.rol === "vendedor";

  const esCliente =
    usuario?.rol === "cliente";

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        registrar,
        logout,
        estaAutenticado,
        esAdmin,
        esVendedor,
        esCliente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
