const express = require("express");
const cors = require("cors");
const {
  obtenerJoyas,
  obtenerJoyasPorFiltro,
  prepararHeateos,
} = require("./consultas.js");

const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, console.log("¡Servidor encendido!"));

app.get("/inventario", async (req, res) => {
  try {
    const inventario = await obtenerJoyas(req.query);
    const HATEOAS = await prepararHeateos(inventario);
    res.status(200).json(HATEOAS, inventario);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get("/inventario/filtro", async (req, res) => {
  try {
    const queryString = req.query;
    const inventarioFiltro = await obtenerJoyasPorFiltro(queryString);
    const HATEOAS = await prepararHeateos(inventario);
    req.status(200).json(inventarioFiltro, HATEOAS);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
