// backend/config/db.js

// 1. Importar a biblioteca mysql2
const mysql = require('mysql2');

// 2. Criar um "Pool de Conexões"
// Um Pool é mais eficiente que uma única conexão porque gerencia e reutiliza conexões,
// o que é ótimo para uma aplicação web com múltiplos usuários.
const pool = mysql.createPool({
  host: 'localhost', // O endereço do seu servidor MySQL. 'localhost' se estiver na sua máquina.
  user: 'guilherme',      // O usuário do seu banco de dados. 'root' é o padrão.
  password: 'gui123', // A senha do seu usuário do banco de dados.
  database: 'financeiro_chamaviva' // O nome do banco de dados que criamos.
});

// 3. Usar a versão com "Promises" do pool, que nos permite usar async/await (código mais limpo)
const db = pool.promise();

// 4. Exportar a conexão para que possamos usá-la em outros arquivos
module.exports = db;