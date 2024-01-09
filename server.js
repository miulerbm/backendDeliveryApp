// Este es el archivo para configurar el primer servidor

// Definimos las variables para el server:

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const port = process.env.PORT || 3000;
app.set("port", port);

server.listen(3000, "192.168.1.7", "localhost", function () {
  console.log(
    "Aplicacion de NodeJS " + process.pid + " Iniciada en el puerto " + port
  );
}); //ipconfig -> Ipv4
