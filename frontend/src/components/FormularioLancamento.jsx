// src/components/FormularioLancamento.jsx

import { useState } from 'react';
import './FormularioLancamento.css'; // Vamos criar este arquivo de estilo a seguir

// Recebemos a função 'aoSubmeter' e 'aoFechar' como propriedades (props) do componente App
function FormularioLancamento({ api, aoSubmeter, aoFechar }) {
  // Criamos um estado para cada campo do formulário
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('saida'); // Valor padrão

  const handleSubmit = async (evento) => {
    evento.preventDefault(); // Impede que a página recarregue ao submeter o formulário

    // Validação simples
    if (!descricao || !valor || !data) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Monta o objeto com os dados do novo lançamento
      const novoLancamento = { descricao, valor: parseFloat(valor), data, tipo };
      
      // Envia os dados para a API (POST request)
      const response = await api.post('/lancamentos', novoLancamento);

      // Adiciona o novo lançamento (que vem da resposta da API) à lista no componente App
      // aoSubmeter({ ...novoLancamento, id: response.data.id });
      aoSubmeter(window.location.reload());

      // Limpa os campos do formulário após o envio
      setDescricao('');
      setValor('');
      setData('');
      setTipo('saida');

    } catch (error) {
      console.error("Erro ao criar lançamento:", error);
      alert("Falha ao criar o lançamento. Tente novamente.");
    }
  };

  return (
    <div className="formulario-backdrop">
      <div className="formulario-container">
        <h2>Adicionar Novo Lançamento</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            required
          />
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor (R$)"
            required
          />
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="saida">Saída</option>
            <option value="entrada">Entrada</option>
          </select>
          <div className="formulario-botoes">
            <button type="submit">Adicionar</button>
            <button type="button" onClick={aoFechar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioLancamento;