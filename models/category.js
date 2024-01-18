const db = require("../config/config");
const Category = {};

Category.getAll = (result) => {
  const sql = `
    SELECT
      id,
      name,
      description,
      image
    FROM
      categories
    ORDER BY
      name
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
    } else {
      console.log("Id de la nueva categoría:", data);
      // Como result, solo se manda el id de la categoría registrada
      result(null, data);
    }
  });
};

Category.create = (category, result) => {
  const sql = `
    INSERT INTO
        categories(
            name,
            description,
            image,
            created_at,
            updated_at
        )
    VALUES(?, ?, ?, ?, ?)
    `;

  db.query(
    sql,
    [
      category.name,
      category.description,
      category.image,
      new Date(),
      new Date(),
    ],
    (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null);
      } else {
        console.log("Id de la nueva categoría:", res.insertId);
        // Como result, solo se manda el id de la categoría registrada
        result(null, res.insertId);
      }
    }
  );
};

module.exports = Category;
