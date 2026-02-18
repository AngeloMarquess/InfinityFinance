const form = document.getElementById('form');
const descricao = document.getElementById('descricao');
const valor = document.getElementById('valor');
const tipo = document.getElementById('tipo');
const lista = document.getElementById('lista');
const saldoEl = document.getElementById('saldo');

let transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

function atualizarTela() {
  lista.innerHTML = '';
  let saldo = 0;

  transacoes.forEach((transacao, index) => {
    const li = document.createElement('li');
    li.textContent = `${transacao.descricao} - R$ ${transacao.valor}`;
    lista.appendChild(li);

    saldo += transacao.tipo === 'receita'
      ? Number(transacao.valor)
      : -Number(transacao.valor);
  });

  saldoEl.textContent = `R$ ${saldo.toFixed(2)}`;
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const novaTransacao = {
    descricao: descricao.value,
    valor: valor.value,
    tipo: tipo.value
  };

  transacoes.push(novaTransacao);
  atualizarTela();
  form.reset();
});

atualizarTela();
