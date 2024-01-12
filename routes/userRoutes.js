// Accedemos a los métodos:
const usersController = require("../controllers/usersController");

module.exports = (app, upload) => {
  // Ejecutamos una petición POST:
  app.post("/api/users/create", usersController.register);
  // Otra ruta para hacer un createWithImage
  app.post(
    "/api/users/createWithImage",
    upload.array("image", 1),
    usersController.registerWithImage
  );
  // Creamos la ruta para ejecutar el login:
  app.post("/api/users/login", usersController.login);
};
