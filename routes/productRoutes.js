const productsController = require("../controllers/productsController");
const passport = require("passport");

module.exports = (app, upload) => {
  // app.get(
  //   "/api/product/getAll",
  //   passport.authenticate("jwt", { session: false }),
  //   categoriesController.getAll
  // );
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
  // app.delete(
  //   "/api/categories/delete/:id",
  //   passport.authenticate("jwt", { session: false }),
  //   categoriesController.delete
  // );
};
