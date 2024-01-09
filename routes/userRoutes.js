// Accedemos a los métodos:
const usersController = require("../controllers/usersController");

module.exports = (app) => {
  // Ejecutamos una petición POST:
  app.post("/api/users/create", usersController.register);
};
