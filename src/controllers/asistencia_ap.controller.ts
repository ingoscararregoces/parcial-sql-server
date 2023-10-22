import { Request, Response } from "express";
import { getConnection, sql } from "../config/server";

const findAsistencias = async (req: Request, res: Response) => {
  const pool = await getConnection();
  if (pool === undefined)
    return res.status(500).send({ error: "Error internal server" });
  // const result = await pool.request().query("SELECT * FROM asistencias_ap");
  const result = await pool.request().query(`
  SELECT
    a.id AS asistenciaId,
    a.fecha,
    a.curso,
    a.codigoqr,
    a.estado,
    JSON_QUERY(
        (
            SELECT
                d.id AS id,
                d.nombre AS nombre,
                d.programa AS programa,
                d.sexo AS sexo,
                d.profesion AS profesion,
                d.estado AS estado
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        )
    ) AS docente_ap
FROM asistencias_ap a
JOIN docentes_ap d ON a.docente_ap = d.id;
  `);
  result.recordset.forEach((item) => {
    item.docente_ap = JSON.parse(item.docente_ap);
  });
  return res.status(200).send(result.recordset);
};
const findAsistencia = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    const result =
      await // .query("SELECT * FROM asistencias_ap WHERE Id = @id");
      pool.request().input("id", sql.Int, id).query(`
      SELECT
      a.id AS asistenciaId,
      a.fecha,
      a.curso,
      a.codigoqr,
      a.estado,
          JSON_QUERY(
              (
                  SELECT
                      d.id AS id,
                      d.nombre AS nombre,
                      d.programa AS programa,
                      d.sexo AS sexo,
                      d.profesion AS profesion,
                      d.estado AS estado
                  FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
              )
          ) AS docente_ap
      FROM asistencias_ap a
      JOIN docentes_ap d ON a.docente_ap = d.id
      WHERE a.id = @id;
      `);

    result.recordset.forEach((item) => {
      item.docente_ap = JSON.parse(item.docente_ap);
    });

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
const createAsistencia = async ({ body }: Request, res: Response) => {
  const { fecha, curso, codigoqr, estado, docente_ap } = body;
  if (!fecha || !curso || !codigoqr || estado == null || !docente_ap) {
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  }

  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("fecha", sql.VarChar, fecha)
      .input("curso", sql.VarChar, curso)
      .input("codigoqr", sql.VarChar, codigoqr)
      .input("estado", sql.Bit, estado)
      .input("docente", sql.Int, docente_ap)
      .query(
        "INSERT INTO asistencias_ap (fecha,curso,codigoqr,estado,docente_ap) VALUES (@fecha,@curso,@codigoqr,@estado,@docente)"
      );
    return res.status(200).send({ message: "Creado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const updateAsistencia = async ({ params, body }: Request, res: Response) => {
  const { id } = params;
  const { fecha, curso, codigoqr, estado, docente_ap } = body;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  if (!fecha || !curso || !codigoqr || estado == null || !docente_ap) {
    return res.status(400).send({ error: "Todos los campos son requeridos" });
  }
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ error: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("fecha", sql.VarChar, fecha)
      .input("curso", sql.VarChar, curso)
      .input("codigoqr", sql.VarChar, codigoqr)
      .input("estado", sql.Bit, estado)
      .input("docente", sql.Int, docente_ap)
      .query(
        "UPDATE asistencias_ap SET fecha = @fecha, curso = @curso, codigoqr = @codigoqr, estado = @estado, docente_ap = @docente WHERE ID = @id"
      );
    return res
      .status(200)
      .send({ message: "Registro actualizado existosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteAsistencia = async ({ params }: Request, res: Response) => {
  const { id } = params;
  if (!id) return res.status(400).send({ error: "Se requiere una ID" });
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM asistencias_ap WHERE Id = @id");
    return res.status(200).send({ message: "Registro eliminado exitosamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};
const deleteAsistencias = async (req: Request, res: Response) => {
  try {
    const pool = await getConnection();
    if (pool === undefined)
      return res.status(500).send({ message: "Error internal server" });
    await pool.request().query("DELETE FROM asistencias_ap");
    return res.status(200).send({
      message: "Todos los registros han sido eliminados exitosamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Error en consulta" });
  }
};

export {
  findAsistencia,
  findAsistencias,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  deleteAsistencias,
};
