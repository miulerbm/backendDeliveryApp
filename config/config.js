// Configurando la conexión con mysql
const mysql = require("mysql");

// Definimos la variable que tendrá las configuraciones:
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "delivery",
});

// Manejo de errores básico:
db.connect(function (err) {
  if (err) throw err;
  console.log("DATABASE CONNECTED!");
});

// Exportamos db para tenerla disponible desde cualquier archivo
module.exports = db;
