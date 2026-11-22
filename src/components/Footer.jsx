
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Footer() {

    // Identificar si el usuario tiene rol VENDEDOR.
    const { esVendedor } = useAuth();

    return (

        <footer className="footer-principal">

            <div className="container">

                <div className="row py-5 g-4">

                    {/* INFORMACIÓN GENERAL */}
                    <div className="col-12 col-lg-4">

                        <h3>
                            LifeTrack
                        </h3>

                        <p>
                            Organiza tu día.
                            Cumple tus metas.
                        </p>

                        <p>
                            Trabajo, estudios,
                            gimnasio, boxeo y vida
                            personal en un solo lugar.
                        </p>

                    </div>

                    {/* NAVEGACIÓN SEGÚN ROL */}
                    <div className="col-6 col-lg-2">

                        <h5>
                            Navegación
                        </h5>

                        {esVendedor ? (

                            // El vendedor solo ve su panel.
                            <Link to="/vendedor">
                                Panel Vendedor
                            </Link>

                        ) : (

                            // Navegación normal para los demás.
                            <>
                                <Link to="/">
                                    Inicio
                                </Link>

                                <Link to="/mi-dia">
                                    Mi Día
                                </Link>

                                <Link to="/tareas">
                                    Mis Tareas
                                </Link>

                                <Link to="/productos">
                                    Tienda
                                </Link>

                                <Link to="/blog">
                                    Blog
                                </Link>
                            </>
                        )}

                    </div>

                    {/* INFORMACIÓN: OCULTA PARA VENDEDOR */}
                    {!esVendedor && (

                        <div className="col-6 col-lg-3">

                            <h5>
                                Información
                            </h5>

                            <Link to="/nosotros">
                                Nosotros
                            </Link>

                            <Link to="/contacto">
                                Contacto
                            </Link>

                            <Link to="/portafolio">
                                Portafolio
                            </Link>

                        </div>

                    )}

                    {/* INFORMACIÓN DE LIFETRACK */}
                    <div className="col-12 col-lg-3">

                        <h5>
                            LifeTrack
                        </h5>

                        <p>
                            💼 Trabajo
                            <br />
                            📚 Estudios
                            <br />
                            🏋️ Gimnasio
                            <br />
                            🥊 Boxeo
                        </p>

                    </div>

                </div>

            </div>

            <div className="footer-final">

                © 2026 LifeTrack ·
                Organiza tu día.
                Cumple tus metas.

            </div>

        </footer>
    );
}

export default Footer;
