import sql from "mssql";

const sqlConfig = {
  user: "oscar",
  password: "12345",
  database: "sqlserver",
  server: "localhost",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    return pool;
  } catch (error) {
    console.error(error);
  }
};

export { sql };
