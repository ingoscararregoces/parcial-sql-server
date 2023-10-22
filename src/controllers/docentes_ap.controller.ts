import { Request, Response } from "express";
import { getConnection, sql } from "../config/server";

const findDocentes = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (pool === undefined)
    return res.status(500).send({ error: "Error internal server" });
  const result = await pool.request().query("SELECT * FROM docentes_ap");
  return res.status(200).send(result.recordset);
};
const findDocente = async ({ params }: Request, res: Response) => {
  const { id } = params;
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM docentes_ap WHERE Id = @id");

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
const createDocente = async ({ body }: Request, res: Response) => {
  const { nombre, programa, sexo, profesion, estado } = body;
  if (!nombre || !programa || !sexo || !profesion || !estado)
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("programa", sql.VarChar, programa)
      .input("sexo", sql.VarChar, sexo)
      .input("profesion", sql.VarChar, profesion)
      .input("estado", sql.Bit, estado)
      .query(
        "INSERT INTO docentes_ap (nombre,programa,sexo,profesion,estado) VALUES (@nombre,@programa,@sexo,@profesion,@estado)"
      );
    return res.status(200).send({ message: "Creado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const updateDocente = async ({ params, body }: Request, res: Response) => {
  const { id } = params;
  const { nombre, programa, sexo, profesion, estado } = body;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  if (!nombre || !programa || !sexo || !profesion || !estado)
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.VarChar, nombre)
      .input("programa", sql.VarChar, programa)
      .input("sexo", sql.VarChar, sexo)
      .input("profesion", sql.VarChar, profesion)
      .input("estado", sql.Bit, estado)
      .query(
        "UPDATE docentes_ap SET nombre = @nombre, programa = @programa, sexo = @sexo, profesion = @profesion, estado = @estado WHERE ID = @id"
      );
    return res
      .status(200)
      .send({ message: "Registro actualizado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteDocente = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM docentes_ap WHERE Id = @id");
    return res.status(200).send({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteDocentes = async (req: Request, res: Response) => {
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool.request().query("DELETE FROM docentes_ap");
    return res.status(200).send({
      message: "Todos los registros han sido eliminados exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};

export {
  findDocentes,
  findDocente,
  createDocente,
  updateDocente,
  deleteDocente,
  deleteDocentes,
};
