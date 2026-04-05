import mysql from 'mysql2/promise'

const {
  MYSQL_HOST = 'localhost',
  MYSQL_PORT = '3306',
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env

export const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER ?? 'root',
  password: MYSQL_PASSWORD ?? '',
  database: MYSQL_DATABASE ?? 'portfolio_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
