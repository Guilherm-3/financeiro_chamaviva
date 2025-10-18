// backend/index.js

const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // <-- IMPORTAR A CONEXÃO

const app = express();
const PORT = 3001;

const lancamentosRoutes = require('./routes/lancamentosRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Financeiro Chamaviva está funcionando!');
});

// ROTA NOVA PARA TESTAR A CONEXÃO COM O BANCO DE DADOS
app.get('/testar-conexao', async (req, res) => {
  try {
    // Tenta fazer uma consulta simples no banco de dados
    const [results, fields] = await db.query('SELECT 1 + 1 AS solution');
    // Se der certo, envia uma mensagem de sucesso
    res.status(200).json({
      message: 'Conexão com o banco de dados bem-sucedida!!!',
      solution: results[0].solution
    });
  } catch (error) {
    // Se der errado, envia uma mensagem de erro
    console.error('Erro ao conectar com o banco de dados:', error);
    res.status(500).json({ message: 'Erro ao conectar com o banco de dados.' });
  }
});

// Usar rotas criadas no/lancamentos
app.use('/lancamentos', lancamentosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});