
/*
====================================================
LIFETRACK - EVALUACIÓN PARCIAL 3
APP.JSX - RUTAS PRINCIPALES
====================================================
*/

import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

// Componentes generales
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Páginas principales
import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import MiDia from "./pages/MiDia.jsx";
import Tareas from "./pages/Tareas.jsx";
import Blog from "./pages/Blog.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Contacto from "./pages/Contacto.jsx";

// Autenticación
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Tienda y administración
import Carrito from "./pages/Carrito.jsx";
import Admin from "./pages/Admin.jsx";
import Vendedor from "./pages/Vendedor.jsx";

// Portafolio de Evaluación 2
import Portafolio from "./pages/Portafolio.jsx";

function App() {

  // Obtenemos el rol desde el contexto de autenticación.
  const {
    esAdmin,
    esVendedor,
    estaAutenticado
  } = useAuth();

  const location = useLocation();

  // El vendedor solamente puede acceder a su panel.
  // Los permisos reales de la API se controlan
  // adicionalmente desde Spring Security.
  if (
    esVendedor &&
    location.pathname !== "/vendedor"
  ) {
    return <Navigate to="/vendedor" replace />;
  }

  return (
    <div className="app">

      <Header />

      <main>
        <Routes>

          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Tienda */}
          <Route
            path="/productos"
            element={<Productos />}
          />

          <Route
            path="/producto/:codigo"
            element={<ProductoDetalle />}
          />

          {/* Organización personal */}
          <Route path="/mi-dia" element={<MiDia />} />
          <Route path="/tareas" element={<Tareas />} />

          {/* Información */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Acceso y registro */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Carrito */}
          <Route path="/carrito" element={<Carrito />} />

          {/* Solo administrador */}
          <Route
            path="/admin"
            element={
              esAdmin
                ? <Admin />
                : <Navigate to="/" replace />
            }
          />

          {/* Solo vendedor */}
          <Route
            path="/vendedor"
            element={
              esVendedor
                ? <Vendedor />
                : <Navigate
                    to={estaAutenticado ? "/" : "/login"}
                    replace
                  />
            }
          />

          {/* Portafolio */}
          <Route
            path="/portafolio"
            element={<Portafolio />}
          />

          {/* Rutas no existentes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      <Footer />

    </div>
  );
}

export default App;
