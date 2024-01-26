const productsController = require("../controllers/productsController");
const passport = require("passport");

module.exports = (app, upload) => {
  // app.get(
  //   "/api/product/getAll",
  //   passport.authenticate("jwt", { session: false }),
  //   categoriesController.getAll
  // );
  app.get(
    "/api/products/findByCategory/:id_category", // En la ruta recibimos el id_category en los params (no en el body)
    // Si es put o post, los datos van en el body, si es delete o get por convención en los params.
    passport.authenticate("jwt", { session: false }),
    // Ahora viene el método a disparar cuando el cliente hace un petición a esta ruta:
    productsController.findByCategory
  );
  app.post(
    "/api/products/create",
    passport.authenticate("jwt", { session: false }),
    upload.array("image", 3), // Pasamos 3 imágenes que son las que estamos manejando.
    // Ahora viene el método a disparar cuando el cliente hace un petición a esta ruta:
    productsController.create
  );
  // app.put(
  //   "/api/categories/updateWithImage",
  //   passport.authenticate("jwt", { session: false }),
  //   upload.array("image", 1),
  //   categoriesController.updateWithImage
  // );
  // app.put(
  //   "/api/categories/update",
  //   passport.authenticate("jwt", { session: false }),
  //   categoriesController.update
  // );
  app.delete(
    "/api/products/delete/:id",
    passport.authenticate("jwt", { session: false }),
    productsController.delete
  );
};
