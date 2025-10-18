// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FormularioLancamento from './components/FormularioLancamento';

//  LOCALHOST
// const api = axios.create({
//   baseURL: 'http://localhost:3001',
// });

// Para isto:
const api = axios.create({
  baseURL: '/api',
});

function App() {
  const [lancamentos, setLancamentos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const fetchLancamentos = async () => {
      try {
        const response = await api.get('/lancamentos');
        setLancamentos(response.data);
      } catch (error) {
        console.error("Erro ao buscar lançamentos:", error);
      }
    };
    fetchLancamentos();
  }, []);

  const handleNovoLancamento = (novoLancamento) => {
    setLancamentos([novoLancamento, ...lancamentos]);
    setMostrarFormulario(false);
  };

  // NOVA FUNÇÃO AQUI
  const handleDeletarLancamento = async (id) => {
      let motivo = window.prompt("Digite o motivo de deletar o lançamento:");
      const body = { motivo };
    
      try {
        // await api.delete(`/lancamentos/${id}`);
        await api.put(`/lancamentos/deletar/${id}`, body);
        setLancamentos(lancamentos.filter(lancamento => lancamento.id !== id));
      } catch (error) {
        console.error("Erro ao apagar lançamento:", error);
        alert("Falha ao apagar o lançamento. Tente novamente.");
      }
    
  };

  return (
    <div>
      <div className="header">
        <h1>Financeiro Chamaviva</h1>
        <button onClick={() => setMostrarFormulario(true)}>Adicionar Lançamento</button>
      </div>

      {mostrarFormulario && (
        <FormularioLancamento
          api={api}
          aoSubmeter={handleNovoLancamento}
          aoFechar={() => setMostrarFormulario(false)}
        />
      )}

      <div className="lista-container">
        <h2>Lançamentos</h2>
        <table className="tabela-lancamentos">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.length > 0 ? (
              lancamentos.map((lancamento) => (
                <tr key={lancamento.id}>
                  <td>{lancamento.descricao}</td>
                  <td className={lancamento.tipo === 'entrada' ? 'valor-entrada' : 'valor-saida'}>
                    {Number(lancamento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td>
                    {new Date(lancamento.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  <td>{lancamento.tipo}</td>
                  <td>
                    {/* BOTÃO ADICIONADO AQUI */}
                    <button
                      onClick={() => handleDeletarLancamento(lancamento.id)}
                      className="botao-acao botao-apagar"
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="nenhum-lancamento">Nenhum lançamento encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;