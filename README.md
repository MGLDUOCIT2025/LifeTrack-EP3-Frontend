# LifeTrack - Evaluación Formativa N°2

Proyecto desarrollado para la asignatura **Desarrollo Full Stack II**.

## Autor

**Mario González**  
Estudiante de Ingeniería en Informática

---

## Descripción

LifeTrack es una aplicación desarrollada en React orientada a la organización de actividades personales.

Para la Evaluación Formativa N°2 se creó un portafolio personal reutilizando la estructura visual y tecnológica de LifeTrack.

El portafolio incorpora:

- presentación personal
- fotografía
- biografía
- proyectos
- noticias
- formulario de contacto
- componentes reutilizables
- carga de información desde JSON
- manejo de State
- Props
- React Bootstrap
- diseño responsivo
- pruebas unitarias
- mocks
- cobertura de código

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- React
- React Router
- React Bootstrap
- Context API
- JSON
- Jasmine
- Karma
- Testing Library
- Webpack
- Babel
- Git
- GitHub

---

## Instalación

Clonar el repositorio:

`git clone URL_DEL_REPOSITORIO`

Ingresar al proyecto:

`cd LifeTrack-Formativa2`

Instalar dependencias:

`npm install`

Ejecutar el proyecto:

`npm run dev`

La aplicación estará disponible normalmente en:

`http://localhost:5173`

El portafolio se encuentra en:

`http://localhost:5173/portafolio`

---

## Pruebas

Para ejecutar las pruebas:

`npm test`

Resultado actual:

`TOTAL: 7 SUCCESS`

---

## Cobertura

Resultados obtenidos:

- Statements: 100%
- Branches: 92.3%
- Functions: 100%
- Lines: 100%

El informe de cobertura es generado automáticamente dentro de la carpeta:

`coverage/`

---

## Componentes principales

### AboutMe

Muestra la información personal y las tecnologías utilizadas.

### PortfolioProjectCard

Componente reutilizable que recibe información de proyectos mediante props.

### NewsCard

Componente reutilizable que muestra noticias cargadas dinámicamente.

### Portafolio

Página principal de la Evaluación Formativa N°2.

Incluye:

- State
- useEffect
- eventos
- validaciones
- carga de archivos JSON
- formulario controlado
- mock para testing

---

## Estructura del proyecto

```text
src/
├── components/
│   ├── AboutMe.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── NewsCard.jsx
│   ├── PortfolioProjectCard.jsx
│   └── ProductCard.jsx
│
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ProductContext.jsx
│
├── data/
│   ├── noticias.json
│   ├── productos.js
│   └── proyectos.json
│
├── pages/
│   ├── Portafolio.jsx
│   └── ...
│
├── tests/
│   ├── NewsCard.spec.js
│   ├── Portafolio.spec.js
│   └── PortfolioProjectCard.spec.js
│
├── App.jsx
├── main.jsx
├── portfolio.css
└── styles.css

---

# Evaluación Parcial 3 - Integración Full Stack

Esta versión conecta el frontend React con el backend Spring Boot de LifeTrack.

## Backend requerido

El backend debe estar ejecutándose en:

`http://localhost:8080`

Swagger:

`http://localhost:8080/swagger-ui/index.html`

API base:

`http://localhost:8080/api/v1`

## Configuración opcional

Crear un archivo `.env.local` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Funcionalidades integradas

- Login real contra Spring Security.
- JWT guardado para autenticar llamadas REST.
- Registro de clientes en MariaDB.
- Productos y categorías desde Spring Boot.
- CRUD de productos desde el panel ADMIN.
- Compra real mediante `POST /api/v1/boletas`.
- Descuento de stock en backend.
- Historial administrativo desde `GET /api/v1/boletas`.
- Usuarios administrativos desde `GET /api/v1/usuarios`.
- Conservación del diseño React existente.

## Usuarios de prueba

- ADMIN: `admin@lifetrack.cl`
- VENDEDOR: `vendedor@lifetrack.cl`
- CLIENTE: `cliente@lifetrack.cl`

La contraseña de prueba definida en el backend es `1234`.

## Inicio local

1. Levantar XAMPP / MariaDB.
2. Levantar Spring Boot.
3. En el frontend:

```bash
npm install
npm run dev
```

4. Abrir la URL indicada por Vite.
