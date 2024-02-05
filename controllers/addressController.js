const Address = require("../models/address");
const storage = require("../utils/cloud_storage");

module.exports = {
  create(req, res) {
    const address = req.body;
    console.log("ADDRESS:", address);
    Address.create(address, (err, id) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro de la dirección",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "La dirección se creó correctamente",
        data: `${id}`,
      });
    });
  },
};
