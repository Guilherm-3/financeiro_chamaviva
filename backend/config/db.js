// backend/config/db.js

const mysql = require('mysql2');
// 1. IMPORTAR E CONFIGURAR O DOTENV
// Isso vai carregar as variáveis do arquivo .env para process.env
require('dotenv').config();

const pool = mysql.createPool({
  // 2. SUBSTITUIR OS VALORES FIXOS PELAS VARIÁVEIS DE AMBIENTE
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

const db = pool.promise();

module.exports = db;