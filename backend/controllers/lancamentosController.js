// backend/controllers/lancamentosController.js

const db = require('../config/db'); // Importando nosso pool de conexões

// Função para LISTAR todos os lançamentos
exports.listarLancamentos = async (req, res) => {
  try {
    const [lancamentos] = await db.query('SELECT * FROM lancamentos WHERE IFNULL(status, " ") <> "EXCLUIDO" ORDER BY data DESC');
    res.status(200).json(lancamentos);
  } catch (error) {
    console.error('Erro ao listar lançamentos:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

exports.teste = async (req, res) => {
  try {
    console.log("ENTROU");
    const [lancamentos] = await db.query('SELECT * FROM lancamentos ORDER BY data DESC');
    res.status(200).json(lancamentos);
  } catch (error) {
    console.error('Erro ao listar lançamentos:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para CRIAR um novo lançamento
exports.criarLancamento = async (req, res) => {
  // Pega os dados do corpo da requisição
  const { descricao, valor, data, tipo } = req.body;

  // Validação simples para garantir que todos os campos foram enviados
  if (!descricao || !valor || !data || !tipo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // A '?' previne SQL Injection. Os valores no array substituem as '?' na ordem.
    const sql = 'INSERT INTO lancamentos (descricao, valor, data, tipo) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [descricao, valor, data, tipo]);
    // Retorna uma resposta de sucesso com o ID do novo lançamento
    res.status(201).json({ id: result.insertId, message: 'Lançamento criado com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para ATUALIZAR um lançamento existente
exports.atualizarLancamento = async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  const { descricao, valor, data, tipo } = req.body; // Pega os novos dados do corpo

  if (!descricao || !valor || !data || !tipo) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const sql = 'UPDATE lancamentos SET descricao = ?, valor = ?, data = ?, tipo = ? WHERE id = ?';
    const [result] = await db.query(sql, [descricao, valor, data, tipo, id]);

    // Verifica se alguma linha foi de fato alterada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lançamento não encontrado.' });
    }

    res.status(200).json({ message: 'Lançamento atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para ATUALIZAR um lançamento existente
exports.atualizarLancamentoDeletar = async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  const { motivo } = req.body; // Pega os novos dados do corpo

  try {
    const sql = 'UPDATE lancamentos SET status = ?, motivo = ? WHERE id = ?';
    const [result] = await db.query(sql, ["EXCLUIDO", motivo, id]);

    // Verifica se alguma linha foi de fato alterada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lançamento não encontrado.' });
    }

    res.status(200).json({ message: 'Lançamento atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Função para APAGAR um lançamento
exports.apagarLancamento = async (req, res) => {
  const { id } = req.params; // Pega o ID da URL

  try {
    const sql = 'DELETE FROM lancamentos WHERE id = ?';
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Lançamento não encontrado.' });
    }

    res.status(200).json({ message: 'Lançamento apagado com sucesso!' });
  } catch (error) {
    console.error('Erro ao apagar lançamento:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};