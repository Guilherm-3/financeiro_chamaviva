// src/components/FormularioLancamento.jsx

import { useState } from 'react';
import './FormularioLancamento.css'; 


function DeletarLancamento({ id, api, aoSubmeter, aoFechar }) {
  const [motivo, setMotivo] = useState('');
  
  const handleSubmit = async (evento) => {
    evento.preventDefault(); // Impede que a página recarregue ao submeter o formulário

    try {
      
      const body = { motivo };
      const response = await api.put(`/lancamentos/deletar/${id}`, body);

      // Recarrega a pagina
      aoSubmeter(window.location.reload());

      // Limpa os campos do formulário após o envio
      setMotivo('');
    } catch (error) {
      console.error("Erro ao deletar lançamento:", error);
      alert("Falha ao deletar o lançamento. Tente novamente.");
    }
  };

  return (
    <div className="formulario-backdrop">
      <div className="formulario-container">
        <h2>Motivo para Deletar o Lançamento</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo"
          />
          <div className="formulario-botoes">
            <button type="cancel">Deletar</button>
            <button type="button" onClick={aoFechar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeletarLancamento;