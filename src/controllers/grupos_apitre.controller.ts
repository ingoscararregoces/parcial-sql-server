import { Request, Response } from "express";
import { getConnection, sql } from "../config/server";

const findGrupos = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (pool === undefined) return res.status(500).send({ error: "Error internal server" });
  const result = await pool.request().query("SELECT * FROM grupos_apitre");
  return res.status(200).send(result.recordset);
};
const findGrupo = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    const result = await pool.request().input("id", sql.Int, id).query("SELECT * FROM grupos_apitre WHERE id = @id")
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
const createGrupo = async ({ body }: Request, res: Response) => {
  const { nombre, director, estado, lineas_apitre_id } = body;
  if (!nombre || !director || !lineas_apitre_id || estado === null) {
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  }

  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("director", sql.VarChar, director)
      .input("estado", sql.Bit, estado)
      .input("lineas_apitre_id", sql.Int, lineas_apitre_id)
      .query(
        "INSERT INTO grupos_apitre (nombre,director,estado,lineas_apitre_id) VALUES (@nombre,@director,@estado,@lineas_apitre_id)"
      );
    return res.status(200).send({ message: "Creado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const updateGrupo = async ({ params, body }: Request, res: Response) => {
  const { id } = params;
  const { nombre, director, estado, lineas_apitre_id } = body;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  if (!nombre || !director || !lineas_apitre_id || estado === null) {
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  }
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.VarChar, nombre)
      .input("director", sql.VarChar, director)
      .input("estado", sql.Bit, estado)
      .input("lineas_apitre_id", sql.Int, lineas_apitre_id)
      .query(
        "UPDATE grupos_apitre SET nombre = @nombre, director = @director, estado = @estado, lineas_apitre_id = @lineas_apitre_id WHERE ID = @id"
      );
    return res
      .status(200)
      .send({ message: "Registro actualizado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteGrupo = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM grupos_apitre WHERE Id = @id");
    return res.status(200).send({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteGrupos = async (req: Request, res: Response) => {
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool.request().query("DELETE FROM grupos_apitre");
    return res.status(200).send({
      message: "Todos los registros han sido eliminados exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};

export {
  findGrupo,
  findGrupos,
  createGrupo,
  updateGrupo,
  deleteGrupo,
  deleteGrupos,
};
