/*
============================================================
API.JS
LifeTrack - Integración Frontend / Backend
============================================================

Centraliza todas las llamadas REST al backend Spring Boot.
============================================================
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api/v1";

const TOKEN_KEY = "lifetrackToken";

export function obtenerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function guardarToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(ruta, opciones = {}) {
  const token = obtenerToken();

  const headers = {
    "Content-Type": "application/json",
    ...(opciones.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(
    `${API_URL}${ruta}`,
    {
      ...opciones,
      headers
    }
  );

  const contentType =
    respuesta.headers.get("content-type") || "";

  let datos = null;

  if (contentType.includes("application/json")) {
    datos = await respuesta.json();
  } else {
    const texto = await respuesta.text();
    datos = texto || null;
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.message ||
      datos?.mensaje ||
      (typeof datos === "string" ? datos : null) ||
      `Error HTTP ${respuesta.status}.`;

    const error = new Error(mensaje);
    error.status = respuesta.status;
    error.data = datos;
    throw error;
  }

  return datos;
}

export async function apiLogin(correo, password) {
  return request(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        correo,
        password
      })
    }
  );
}

export async function apiRegistro(usuario) {
  return request(
    "/auth/registro",
    {
      method: "POST",
      body: JSON.stringify(usuario)
    }
  );
}

export async function apiListarProductos() {
  return request("/productos");
}

export async function apiObtenerProducto(id) {
  return request(`/productos/${id}`);
}

export async function apiCrearProducto(producto) {
  return request(
    "/productos",
    {
      method: "POST",
      body: JSON.stringify(producto)
    }
  );
}

export async function apiEditarProducto(id, producto) {
  return request(
    `/productos/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(producto)
    }
  );
}

export async function apiEliminarProducto(id) {
  return request(
    `/productos/${id}`,
    {
      method: "DELETE"
    }
  );
}

export async function apiListarCategorias() {
  return request("/categorias");
}

export async function apiCrearBoleta(items) {
  return request(
    "/boletas",
    {
      method: "POST",
      body: JSON.stringify({
        items
      })
    }
  );
}

export async function apiListarBoletas() {
  return request("/boletas");
}

export async function apiListarUsuarios() {
  return request("/usuarios");
}

export {
  API_URL
};
