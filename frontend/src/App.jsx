// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FormularioLancamento from './components/FormularioLancamento';
import DeletarLancamento from './components/DeletarLancamento';

//  LOCALHOST
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// PRODUÇÃO
// const api = axios.create({
//   baseURL: '/api',
// });

function App() {
  // variaveis
  const [lancamentos, setLancamentos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [deletaLancamento, setDeletaLancamento] = useState(false);
  const [id, setId] = useState('');
  const [data, setData] = useState(new Date());

  const [total, setTotal] = useState(0);
  const [totalEntrada, setTotalEntrada] = useState(0);
  const [totalSaida, setTotalSaida] = useState(0);

  // carrega lista
  useEffect(() => {
    const fetchLancamentos = async () => {
      try {

        // TODO -> busca por periodo e passar data atual como periodo padrão se campo de periodo tiver nulo
        if(data === null){
           data = new Date(); 
        }

        console.log(data);
        const dataInicial = new Date(data.getYear()+"-"+(data.getMonth()+1)+"-01");
        const dataFinal = new Date(data.getYear()+"-"+(data.getMonth()+1)+"-31");
        const dataPesquisa = { dataInicial, dataFinal };

        const response = await api.get('/lancamentos', dataPesquisa);
        setLancamentos(response.data);

        // for para calcular total
        let calcTotal = 0, calcTotalSaida = 0, calcTotalEntrada = 0;
        for(let lancamento of response.data){
          if(lancamento.tipo === 'entrada'){
            calcTotalEntrada += Number(lancamento.valor);
          }
          if(lancamento.tipo === 'saida'){
            calcTotalSaida += Number(lancamento.valor);
          }
        }

        setTotalEntrada(calcTotalEntrada);
        setTotalSaida(calcTotalSaida);
        setTotal(calcTotalEntrada - calcTotalSaida);

      } catch (error) {
        console.error("Erro ao buscar lançamentos:", error);
      }
    };
    fetchLancamentos();
  }, []);

  // metodos
  const handleNovoLancamento = (novoLancamento) => {
    setLancamentos([novoLancamento, ...lancamentos]);
    setMostrarFormulario(false);
  };

  const handleDeletarLancamento = async (id) => {
    setDeletaLancamento(true);
    setId(id);
  };

  const search = () => {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("pesquisa");
    filter = input.value.toUpperCase();
    table = document.getElementById("tabela");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }


  return (
    <div>
      <div className="header">
        <h1>Chama Viva - Financeiro</h1>
      </div>

      {mostrarFormulario && (
        <FormularioLancamento
          api={api}
          aoSubmeter={handleNovoLancamento}
          aoFechar={() => setMostrarFormulario(false)}
        />
      )}

      {deletaLancamento && (
        <DeletarLancamento
          id={id}
          api={api}
          aoSubmeter={() => window.location.reload()}
          aoFechar={() => setDeletaLancamento(false)}
        />
      )}

      <hr/>

        <div class="w3-row">
          <div class="w3-col m3">
            <input
              class="w3-input"
              type="month"
              required
            />
            <label>Busca por Período</label>
          </div>  
          <div class="w3-col m1">
            <button class="w3-button w3-gray">
              <i class="fa fa-search"></i>
            </button>
          </div>  
          <div class="w3-col m4">
            <button
              class="w3-button w3-cobalt"
              onClick={() => setMostrarFormulario(true)}>Adicionar Lançamento</button>
          </div>  
        </div>


      <div className="w3-responsive w3-panel w3-card">
        <h2>Lançamentos</h2>
        <table id="tabela" className="w3-table-all">
          <thead>
            <tr>
              <th colSpan="5">Descrição
                <input 
                  type="text" 
                  id="pesquisa" 
                  placeholder="Pesquisa..."
                />
              </th>
              <th colSpan="3">Valor</th>
              <th colSpan="2">Data</th>
              <th colSpan="1">Tipo</th>
              <th colSpan="1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.length > 0 ? (
              lancamentos.map((lancamento) => (

                <tr key={lancamento.id} className="w3-hoverable">
                  <td colSpan="5">
                    {lancamento.descricao}
                  </td>
                  <td colSpan="3" className={lancamento.tipo === 'entrada' ? 'valor-entrada' : 'valor-saida'}>
                    {Number(lancamento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td colSpan="2">
                    {new Date(lancamento.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                  </td>
                  <td colSpan="1">
                    {lancamento.tipo}
                  </td>
                  <td colSpan="1">
                    <button
                      onClick={() => handleDeletarLancamento(lancamento.id)}
                      className="w3-btn botao-acao botao-apagar">
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
          <tfoot>
            <td colSpan="1">
                <div>Total Saida:</div>
            </td>
            <td>              
              <div className="valor-saida-total">
                {Number(totalSaida).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </td>

            <td colSpan="1">
              <div>Total Entrada:</div>
            </td>
            <td>              
              <div className="valor-entrada-total">
                {Number(totalEntrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </td>

            <td colSpan="1">
              <div>Total Caixa:</div>
            </td>
            <td>
              <div className="valor-total">
                {Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </td>

          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default App;