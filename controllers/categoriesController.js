const Category = require("../models/category");
const storage = require("../utils/cloud_storage");

module.exports = {
  async getAll(req, res) {
    Category.getAll((err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error al momento de listar las categorías",
          error: err,
        });
      }
      return res.status(201).json(data);
    });
  },

  async create(req, res) {
    const category = JSON.parse(req.body.category);
    const files = req.files;
    if (files.length > 0) {
      const path = `image_${Date.now()}`;
      const url = await storage(files[0], path);

      if (url != undefined && url != null) {
        category.image = url;
      }
    }

    Category.create(category, (err, id) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con la creación de la categoría",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "La categoría se creó correctamente",
        data: `${id}`,
      });
    });
  },

  async updateWithImage(req, res) {
    const category = JSON.parse(req.body.category); // SE CAPTURAN LOS DATOS DE PARTE DEL CLIENTE QUE VIENE CON IMAGEN (FILE)
    // PARTE DE LAS IMÁGENES:
    const files = req.files; // SE RECIBE UN ARCHIVO
    if (files.length > 0) {
      const path = `image_${Date.now()}`;
      const url = await storage(files[0], path); // SE UTILIZA EL cloud_storage

      if (url != undefined && url != null) {
        category.image = url;
      }
    }

    Category.update(category, (err, id) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con la actualización de la categoría",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "La categoría se actualizó correctamente",
        data: `${id}`,
      });
    });
  },

  async update(req, res) {
    // SOLO TRAEMOS INFORMACIÓN (NO ARCHIVOS)
    const category = req.body; // SE CAPTURAN LOS DATOS DE PARTE DEL CLIENTE SIN IMAGEN (SIN FILE)
    // Se llama al mismo método SQL, la imagen será la misma que tenía.

    Category.update(category, (err, id) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con la actualización de la categoría",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "La categoría se actualizó correctamente",
        data: `${id}`,
      });
    });
  },

  async delete(req, res) {
    const id = req.params.id;
    Category.delete(id, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error al momento de eliminar una categoria",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "La categoría se eliminó correctamente",
        data: `${id}`,
      });
    });
  },
};
