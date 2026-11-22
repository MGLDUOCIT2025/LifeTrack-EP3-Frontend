import {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext.jsx";


/*
============================================================
LOGIN.JSX
LifeTrack
============================================================

Página de inicio de sesión.

Permite:

- Ingresar correo.
- Ingresar contraseña.
- Validar credenciales.
- Mostrar errores.
- Iniciar sesión.
- Redirigir al usuario.
- Redirigir al administrador.
============================================================
*/


function Login() {


  /*
  ==========================================================
  AUTENTICACIÓN
  ==========================================================
  */

  const {
    login
  } = useAuth();


  /*
  ==========================================================
  NAVEGACIÓN
  ==========================================================
  */

  const navigate =
    useNavigate();


  /*
  ==========================================================
  ESTADOS DEL FORMULARIO
  ==========================================================
  */

  const [
    correo,
    setCorreo
  ] = useState("");


  const [
    password,
    setPassword
  ] = useState("");


  const [
    mensaje,
    setMensaje
  ] = useState("");


  const [
    tipoMensaje,
    setTipoMensaje
  ] = useState(
    "danger"
  );


  /*
  ==========================================================
  INICIAR SESIÓN
  ==========================================================
  */

  async function iniciarSesion(
    event
  ) {

    event.preventDefault();


    /*
    ----------------------------------------------------------
    LIMPIAR CORREO
    ----------------------------------------------------------
    */

    const correoLimpio =

      correo
        .trim()
        .toLowerCase();


    /*
    ----------------------------------------------------------
    VALIDAR CAMPOS VACÍOS
    ----------------------------------------------------------
    */

    if (

      !correoLimpio ||

      !password

    ) {

      setTipoMensaje(
        "danger"
      );


      setMensaje(

        "Debes ingresar correo y contraseña."

      );


      return;

    }


    /*
    ----------------------------------------------------------
    INTENTAR INICIAR SESIÓN
    ----------------------------------------------------------
    */

    const resultado =

      await login(

        correoLimpio,

        password

      );


    /*
    ----------------------------------------------------------
    LOGIN INCORRECTO
    ----------------------------------------------------------
    */

    if (!resultado.ok) {

      setTipoMensaje(
        "danger"
      );


      setMensaje(
        resultado.mensaje
      );


      return;

    }


    /*
    ----------------------------------------------------------
    LOGIN CORRECTO
    ----------------------------------------------------------
    */

    setTipoMensaje(
      "success"
    );


    setMensaje(

      "Inicio de sesión correcto."

    );


    /*
    ----------------------------------------------------------
    REDIRECCIÓN SEGÚN ROL
    ----------------------------------------------------------
    */

    setTimeout(

      () => {


        if (

          resultado.usuario.rol ===
          "admin"

        ) {

          navigate(
            "/admin"
          );

        } else {

          navigate(
            "/"
          );

        }

      },

      500

    );

  }


  /*
  ==========================================================
  RETURN
  ==========================================================
  */

  return (

    <section className="pagina-formulario">


      <div className="formulario-layout">


        {/* ==================================================
            PANEL IZQUIERDO
        ================================================== */}

        <div className="formulario-panel">


          <span>

            BIENVENIDO

          </span>


          <h1>

            Sigue avanzando
            hacia tus metas

          </h1>


          <p>

            Inicia sesión y continúa
            organizando tu día con LifeTrack.

          </p>


        </div>


        {/* ==================================================
            FORMULARIO
        ================================================== */}

        <div className="formulario-card">


          <h2>

            Iniciar sesión

          </h2>


          <p>

            Ingresa tu correo y contraseña.

          </p>


          {/* ================================================
              MENSAJE
          ================================================ */}

          {

            mensaje && (

              <div

                className={
                  `alert alert-${tipoMensaje}`
                }

              >

                {mensaje}

              </div>

            )

          }


          {/* ================================================
              FORMULARIO LOGIN
          ================================================ */}

          <form

            onSubmit={
              iniciarSesion
            }

          >


            <label>

              Correo electrónico

            </label>


            <input

              type="email"

              placeholder="correo@ejemplo.cl"

              value={
                correo
              }

              required

              autoComplete="email"

              onChange={

                event =>

                  setCorreo(
                    event.target.value
                  )

              }

            />


            <label>

              Contraseña

            </label>


            <input

              type="password"

              placeholder="Ingrese su contraseña"

              value={
                password
              }

              required

              autoComplete="current-password"

              onChange={

                event =>

                  setPassword(
                    event.target.value
                  )

              }

            />


            <button

              type="submit"

              className="btn btn-primary"

            >

              Iniciar sesión

            </button>


          </form>


          {/* =================================================
              REGISTRO
          ================================================= */}

          <p className="form-enlace">


            ¿No tienes cuenta?


            {" "}


            <Link to="/registro">

              Registrarse

            </Link>


          </p>


        </div>

      </div>

    </section>

  );

}


export default Login;