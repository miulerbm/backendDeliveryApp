// Llamamos al modelo user y a los métodos de los que dispone:
const User = require("../models/user");
// Para comparar las passwords ingresadas por el usuario y las encriptadas:
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = {
  // Definimos el método login para mandarle al cliente la respuesta del inicio de sesión:
  login(req, res) {
    // Necesito el email y el password:
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
      console.log("Error ", err);
      console.log("USUARIO", myUser);

      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      // Si no viene la data:
      if (!myUser) {
        return res.status(401).json({
          // El cliente no tiene autorización para realizar esta petición
          success: false,
          message: "El email no fue encontrado",
          error: err,
        });
      }
      // Comparamos el password que ingresa el usuario en el login, con lo que está en la DB (encriptado):
      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email },
          keys.secretOrKey,
          {}
        );
        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          image: myUser.image,
          // Nuevo campo:
          session_token: `JWT ${token}`,
        };

        // Si no hubo error:
        return res.status(201).json({
          success: true,
          message: "El usuario fue autenticado",
          data: data, // Mandamos todo el objeto con la info del usuario y su token incluido.
        });
      } else {
        return res.status(401).json({
          // El cliente no tiene autorización para realizar esta petición
          success: false,
          message: "La contraseña es incorrecta",
          error: err,
        });
      }
    });
  },

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
