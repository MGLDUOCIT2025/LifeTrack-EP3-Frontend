
/*
====================================================
LIFETRACK - EVALUACIÓN PARCIAL 3
HEADER.JSX - MENÚ PRINCIPAL CON ROLES
====================================================
*/

import {
  NavLink,
  Link,
  useNavigate
} from "react-router-dom";

import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import "./HeaderPremium.css";

function Header() {

  const navigate = useNavigate();

  // Información del carrito
  const { cantidadTotal } = useCart();

  // Información del usuario conectado
  const {
    usuario,
    logout,
    estaAutenticado,
    esAdmin,
    esVendedor
  } = useAuth();

  // Cerrar sesión
  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const nombreUsuario =
    usuario?.nombre ||
    usuario?.correo?.split("@")[0] ||
    "Usuario";

  // Estilo de navegación activa
  const estiloNav = ({ isActive }) =>
    isActive
      ? "lifetrack-nav-link active"
      : "lifetrack-nav-link";

  return (
    <header className="lifetrack-header">

      <div className="lifetrack-header-container">

        {/* LOGO */}
        <Link
          to={esVendedor ? "/vendedor" : "/"}
          className="lifetrack-logo"
        >
          <div className="lifetrack-logo-icon">
            ✓
          </div>

          <div className="lifetrack-logo-text">
            <strong>LifeTrack</strong>
            <span>
              Organiza tu día. Cumple tus metas.
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN SEGÚN ROL */}
        <nav className="lifetrack-nav">

          {esVendedor ? (

            // El vendedor solamente ve su panel.
            <NavLink
              to="/vendedor"
              className={estiloNav}
            >
              Panel Vendedor
            </NavLink>

          ) : (

            // Navegación habitual de LifeTrack.
            <>
              <NavLink
                to="/"
                end
                className={estiloNav}
              >
                Inicio
              </NavLink>

              <NavLink
                to="/mi-dia"
                className={estiloNav}
              >
                Mi Día
              </NavLink>

              <NavLink
                to="/tareas"
                className={estiloNav}
              >
                Mis Tareas
              </NavLink>

              <NavLink
                to="/productos"
                className={estiloNav}
              >
                Tienda
              </NavLink>

              <NavLink
                to="/blog"
                className={estiloNav}
              >
                Blog
              </NavLink>

              <NavLink
                to="/nosotros"
                className={estiloNav}
              >
                Nosotros
              </NavLink>

              <NavLink
                to="/contacto"
                className={estiloNav}
              >
                Contacto
              </NavLink>

              <NavLink
                to="/portafolio"
                className={estiloNav}
              >
                <span className="portfolio-icon">
                  💼
                </span>
                Portafolio
              </NavLink>
            </>
          )}

        </nav>

        {/* ACCIONES DERECHA */}
        <div className="lifetrack-header-actions">

          {/* El vendedor no utiliza carrito */}
          {!esVendedor && (
            <Link
              to="/carrito"
              className="header-cart-button"
              aria-label="Ir al carrito"
              title="Carrito LifeTrack"
            >
              🛒

              {cantidadTotal > 0 && (
                <span className="header-cart-count">
                  {cantidadTotal}
                </span>
              )}
            </Link>
          )}

          {/* USUARIO NO AUTENTICADO */}
          {!estaAutenticado && (
            <>
              <Link
                to="/login"
                className="header-login-button"
              >
                <span className="header-login-icon">
                  👤
                </span>
                <span>Iniciar sesión</span>
              </Link>

              <Link
                to="/registro"
                className="header-start-button"
              >
                <span>Comenzar gratis</span>
                <span className="header-arrow">→</span>
              </Link>
            </>
          )}

          {/* USUARIO AUTENTICADO */}
          {estaAutenticado && (
            <>
              <div
                className="header-login-button"
                title={usuario?.correo}
              >
                <span className="header-login-icon">
                  👤
                </span>
                <span>Hola {nombreUsuario}</span>
              </div>

              {/* Acceso exclusivo del ADMIN */}
              {esAdmin && (
                <Link
                  to="/admin"
                  className="header-start-button"
                >
                  <span>Panel Admin</span>
                </Link>
              )}

              {/* Acceso exclusivo del VENDEDOR */}
              {esVendedor && (
                <Link
                  to="/vendedor"
                  className="header-start-button"
                >
                  <span>Panel Vendedor</span>
                </Link>
              )}

              {/* CERRAR SESIÓN */}
              <button
                type="button"
                className="header-start-button"
                onClick={cerrarSesion}
              >
                <span>Cerrar sesión</span>
                <span className="header-arrow">→</span>
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;
