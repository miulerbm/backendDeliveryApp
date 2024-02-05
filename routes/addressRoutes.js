const addressController = require("../controllers/addressController");
const passport = require("passport");

module.exports = (app, upload) => {
  // app.get(
  //   "/api/categories/getAll",
  //   passport.authenticate("jwt", { session: false }),
  //   categoriesController.getAll
  // );
  app.post(
    "/api/address/create",
    passport.authenticate("jwt", { session: false }),
    addressController.create
  );
};
