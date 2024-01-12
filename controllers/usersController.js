// Llamamos al modelo user y a los métodos de los que dispone:
const User = require("../models/user");
// Requerimos el modelo del rol:
const Rol = require("../models/rol");
// Para comparar las passwords ingresadas por el usuario y las encriptadas:
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
// Requerimos el storage:
const storage = require("../utils/cloud_storage");

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
          // Devolvemos los roles tambien:
          roles: JSON.parse(myUser.roles),
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
  // Nuevo método para registrar el usuario con su imagen:
  async registerWithImage(req, res) {
    // Obtenemos el usuario de distinta manera:
    const user = JSON.parse(req.body.user);

    // Almacenamos la imagen:
    const files = req.files; // Estos son los archivos que va a enviar el usuario.

    // Validamos que tengamos archivos:
    if (files.length > 0) {
      const path = `image_${Date.now()}`; // Este es el nombre con el que se creará la imagen (no se repetirá) en firebase
      const url = await storage(files[0], path); // Mandamos el único archivo que mandaremos (la imagen del usuario)

      if (url != undefined && url != null) {
        // Si el file vino como no nulo y como no undefined:
        // Pasaremos la url generada al guardar la imagen como la prop image de user:
        user.image = url;
      }
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      user.id = `${data}`;
      // Una vez que el usuario se registra, también hacemos que automáticamente inicie sesión y genere su token:
      const token = jwt.sign(
        { id: user.id, email: user.email },
        keys.secretOrKey,
        {}
      );
      // Añadimos el session token al user que se retornará:
      user.session_token = `JWT ${token}`;
      // Creamos el rol por defecto:
      Rol.create(
        user.id,
        3,
        (err,
        (data) => {
          if (err) {
            return res.status(501).json({
              success: false,
              message: "Hubo un error con el registro del usuario",
              error: err,
            });
          }
          return res.status(201).json({
            success: true,
            message: "El registro se realizó correctamente",
            // Vamos a retornar todo el usuario, no solo su id:
            data: user,
          });
        })
      ); // Pasamos el id del user, y el id de CLIENTE, que siempre será 3 (tabla roles)
    });

    //   User.create(user, (err, data) => {
    //     if (err) {
    //       return res.status(501).json({
    //         success: false,
    //         message: "Hubo un error con el registro del usuario",
    //         error: err,
    //       });
    //     }

    //     user.id = data;

    //     return res.status(201).json({
    //       success: true,
    //       message: "El registro se realizo correctamente",
    //       data: user,
    //     });
    //   });
  },
};
