// Accedemos a los métodos:
const usersController = require("../controllers/usersController");
const passport = require("passport");

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

  // RUTAS PUT para Actualizar:
  app.put(
    "/api/users/update",
    passport.authenticate("jwt", { session: false }),
    upload.array("image", 1),
    usersController.updateWithImage
  );

  app.put(
    "/api/users/updateWithoutImage",
    passport.authenticate("jwt", { session: false }),
    usersController.updateWithoutImage
  );
  // Recuerda: 401 -> UNAUTHORIZED, se le debe mandar el SESSION TOKEN
};
