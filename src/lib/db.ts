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
  user: MYSQL_USER ?? 'u630175796_nodeusr',
  password: MYSQL_PASSWORD ?? 'Rk7!9pQ2#vT6xL4m',
  database: MYSQL_DATABASE ?? 'u630175796_nodeappdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
