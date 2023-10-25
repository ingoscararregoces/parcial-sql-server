import { Request, Response } from "express";
import { getConnection, sql } from "../config/server";

const findLineas = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (pool === undefined) return res.status(500).send({ error: "Error internal server" });
  const result = await pool.request().query("SELECT * FROM lineas_apitre");
  return res.status(200).send(result.recordset);
};
const findLinea = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM lineas_apitre WHERE id = @id");

    return res
      .status(200)
      .send(
        result.recordset.length === 0
          ? { message: "No se encontro ningun resultado" }
          : result.recordset
      );
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const createLinea = async ({ body }: Request, res: Response) => {
  const { nombre, estado } = body;
  if (!nombre || estado === null)
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("estado", sql.Bit, estado)
      .query(
        "INSERT INTO lineas_apitre (nombre,estado) VALUES (@nombre,@estado)"
      );
    return res.status(200).send({ message: "Creado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const updateLinea = async ({ params, body }: Request, res: Response) => {
  const { id } = params;
  const { nombre, estado } = body;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  if (!nombre || estado === null)
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.VarChar, nombre)
      .input("estado", sql.Bit, estado)
      .query(
        "UPDATE lineas_apitre SET nombre = @nombre, estado = @estado WHERE id = @id"
      );
    return res
      .status(200)
      .send({ message: "Registro actualizado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteLinea = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM lineas_apitre WHERE id = @id");
    return res.status(200).send({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteLineas = async (req: Request, res: Response) => {
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool.request().query("DELETE FROM lineas_apitre");
    return res.status(200).send({
      message: "Todos los registros han sido eliminados exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};

export {
  findLineas,
  findLinea,
  createLinea,
  updateLinea,
  deleteLinea,
  deleteLineas,
};
