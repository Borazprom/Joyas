const { Pool } = require("pg");
require("dotenv").config();
const format = require("pg-format");
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  allowExitOnIdle: true,
});

const obtenerJoyas = async ({ limit = 3, order_by = "id_ASC", page = 1 }) => {
  try {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limit;
    const formattedQuery = format(
      "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
      campo,
      direccion,
      limit,
      offset
    );
    const { rows: inventario } = await pool.query(formattedQuery);
    return inventario;
  } catch (error) {
    throw new Error("No se pudo obtener la Joya");
  }
};

const obtenerJoyasPorFiltro = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {
  try {
    let filtros = [];
    let values = [];
    const agregarFiltro = (campo, comparador, valor) => {
      values.push(valor);
      const { length } = filtros;
      filtros.push(`${campo} ${comparador} $${filtros.length + 1} `);
    };

    if (precio_min) {
      agregarFiltro("precio", ">=", precio_min);
    }
    if (precio_max) {
      agregarFiltro("precio", "<=", precio_max);
    }
    if (categoria) {
      agregarFiltro("categoria", "===", categoria);
    }
    if (metal) {
      agregarFiltro("metal", "===", metal);
    }

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }
    let result = await pool.query(consulta.values);
    return result.rows;
  } catch (error) {
    throw new Error("Error al filtrar");
  }
};

module.exports = {
  obtenerJoyas,
  obtenerJoyasPorFiltro,
};
