const Product = require("../models/product");
const storage = require("../utils/cloud_storage");
const asyncForEach = require("../utils/async_foreach");

module.exports = {
  async findByCategory(req, res) {
    const id_category = req.params.id_category;
    Product.findByCategory(id_category, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error al momento de listar los productos",
          error: err,
        });
      }
      return res.status(201).json(data);
    });
  },

  async create(req, res) {
    const product = JSON.parse(req.body.product);

    // DEBEMOS INSERTAR 3 IMÁGENES EN UNA SOLA PETICIÓN
    const files = req.files; // Estos son los archivos que va a enviar el producto.

    let inserts = 0;
    if (files.length === 0) {
      return res.status(501).json({
        success: false,
        message: "Error al registrar el producto, no tiene imágenes",
        error: err,
      });
    } else {
      // Si pasó la validación quiere decir que tiene imágenes
      Product.create(product, (err, id_product) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "Hubo un error con el registro del producto",
            error: err,
          });
        }

        // Como al mandar las imágenes llamamos al update product, le debemos pasar el id
        // para que sepa qué producto actualizar (id_product era res.insertId que es el id del product)
        product.id = id_product;

        // Ahora creamos la constante start para las funciones asíncronas:

        const start = async () => {
          await asyncForEach(files, async (file) => {
            // Empezamos la rutina de almacenar las imágenes:
            const path = `image_${Date.now()}`;
            const url = await storage(file, path);

            if (url != undefined && url != null) {
              // Validamos que se creó la imagen en firebase.

              if (inserts === 0) {
                // Si inserts es 0, se está almacenando recién la imagen nro 1.
                product.image1 = url;
              } else if (inserts === 1) {
                // Se está almacenando la imagen 2
                product.image2 = url;
              } else if (inserts === 2) {
                // Se está almacenando la imagen 3
                product.image3 = url;
              }
            }
            // Debemos considerar que las imágenes, cuando recién se cree el producto, serán nulas.
            await Product.update(product, (err, data) => {
              if (err) {
                return res.status(501).json({
                  success: false,
                  message: "Hubo un error con el registro del producto",
                  error: err,
                });
              }

              // Si no hay error y una vez se actualizó el producto:
              inserts = inserts + 1;
              // Así sabemos a qué campo asignarle la url de firebase.

              if (inserts == files.length) {
                // Terminó de almacenar las 3 imágenes
                return res.status(201).json({
                  success: true,
                  message: "El producto se almacenó correctamente",
                  data: data,
                });
              }
            });
          });
        };
        // Llamamos al método start
        start();
      });
    }
  },

  async update(req, res) {
    // Recibimos los datos de un producto a través del req.body:
    const product = req.body;

    // Llammos al modelo Product y ejecutamos el método update del producto que pasamos por param
    Product.update(product, (err, data) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error al momento de actualizar el producto",
          error: err,
        });
      }
      return res.status(201).json({
        success: true,
        message: "El producto se actualizó correctamente",
        data: data,
      });
    });
  },

  // Actualizar con imagen:
  async updateWithImage(req, res) {
    const product = JSON.parse(req.body.product);

    // DEBEMOS INSERTAR 3 IMÁGENES EN UNA SOLA PETICIÓN
    const files = req.files; // Estos son los archivos que va a enviar el producto.

    let inserts = 0;
    if (files.length === 0) {
      return res.status(501).json({
        success: false,
        message: "Error al registrar el producto, no tiene imágenes",
        error: err,
      });
    } else {
      // Si pasó la validación quiere decir que tiene imágenes
      Product.update(product, (err, id_product) => {
        if (err) {
          return res.status(501).json({
            success: false,
            message: "Hubo un error con la actualización del producto",
            error: err,
          });
        }

        // Como al mandar las imágenes llamamos al update product, le debemos pasar el id
        // para que sepa qué producto actualizar (id_product era res.insertId que es el id del product)
        product.id = id_product;

        // Ahora creamos la constante start para las funciones asíncronas:

        const start = async () => {
          await asyncForEach(files, async (file) => {
            // Empezamos la rutina de almacenar las imágenes:
            const path = `image_${Date.now()}`;
            const url = await storage(file, path);

            if (url != undefined && url != null) {
              // Validamos que se creó la imagen en firebase.

              if (inserts === 0) {
                // Si inserts es 0, se está almacenando recién la imagen nro 1.
                product.image1 = url;
              } else if (inserts === 1) {
                // Se está almacenando la imagen 2
                product.image2 = url;
              } else if (inserts === 2) {
                // Se está almacenando la imagen 3
                product.image3 = url;
              }
            }
            // Debemos considerar que las imágenes, cuando recién se cree el producto, serán nulas.
            await Product.update(product, (err, data) => {
              if (err) {
                return res.status(501).json({
                  success: false,
                  message: "Hubo un error con la actualización del producto",
                  error: err,
                });
              }

              // Si no hay error y una vez se actualizó el producto:
              inserts = inserts + 1;
              // Así sabemos a qué campo asignarle la url de firebase.

              if (inserts == files.length) {
                // Terminó de almacenar las 3 imágenes
                return res.status(201).json({
                  success: true,
                  message: "El producto se actualizó correctamente",
                  data: data,
                });
              }
            });
          });
        };
        // Llamamos al método start
        start();
      });
    }
  },

  // Método para eliminar producto por id:
  async delete(req, res) {
    const id = req.params.id;
    Product.delete(id, (err, id) => {
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error al momento de eliminar el producto",
          error: err,
        });
      }
      return res.status(201).json({
        success: true,
        message: "El producto se eliminó correctamente",
        data: `${id}`,
      });
    });
  },
};
