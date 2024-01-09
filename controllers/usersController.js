// Llamamos al modelo user y a los métodos de los que dispone:
const User = require("../models/user");

module.exports = {
  // Definimos el método register
  register(req, res) {
    // Creamos una constante user para capturar los datos que envíe el cliente:
    const user = req.body;
    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
        // Errores 500: fallos en el sv
      }

      // Si no hubo error:
      return res.status(201).json({
        success: true,
        message: "El registro se realizó correctamente",
        data: data, // DATA es solo la ID del usuario que se registró, según definimos en user.js
      });
    });
  },
};
