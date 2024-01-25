// Este es el archivo para configurar el primer servidor

// Definimos las variables para el server:

const { error } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

// Empecemos a probar solicitudes al backend
const logger = require("morgan");
const cors = require("cors");

// Vamos a configurar la parte final de la respuesta para login:
const passport = require("passport");

// Importamos librerías para manejar imágenes en el backend:
const multer = require("multer");

/**
 * Aquí se van a importar las rutas:
 */

const usersRoutes = require("./routes/userRoutes");
const categoriesRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

const port = process.env.PORT || 3000;

// Configuraciones del backend para debugging y seguridad:

// Config para la autenticación web:
app.use(logger("dev"));
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.disable("x-powered-by");

//Asignación del puerto para la ejecución del sv:
app.set("port", port);

// Utilizamos el multer:

const upload = multer({
  storage: multer.memoryStorage(),
});

/**
 * Llamado de las rutas:
 */

usersRoutes(app, upload);
categoriesRoutes(app, upload);
productRoutes(app, upload);

// Siempre revisar la ip que tiene el PC, al reiniciar.
server.listen(3000, "192.168.1.7", "localhost", function () {
  console.log(
    "Aplicacion de NodeJS " + process.pid + " Iniciada en el puerto " + port
  );
}); //ipconfig -> Ipv4

// Vamos a crear la primera ruta:
app.get("/", (req, res) => {
  // Al lanzar la petición, esperamos recibir este mensaje:
  res.send("Ruta raíz del backend");
});

app.get("/test", (req, res) => {
  // Al lanzar la petición, esperamos recibir este mensaje:
  res.send("Esta es la ruta test");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

// 200 - RESPUESTA EXITOSA
// 404 - LA URL NO EXISTE
// 500 - ERROR INTERNO DEL SV
