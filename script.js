const form = document.getElementById("form");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

function salvar() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function formatarMoeda(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function calcularSaldo() {
  return transacoes.reduce((acc, t) => {
    const v = Number(t.valor);
    return t.tipo === "receita" ? acc + v : acc - v;
  }, 0);
}

function removerTransacao(id) {
  transacoes = transacoes.filter((t) => t.id !== id);
  salvar();
  renderizar();
}

function criarItem(transacao) {
  const li = document.createElement("li");
  li.className = `item ${transacao.tipo}`;

  const info = document.createElement("div");
  info.className = "info";
  info.innerHTML = `
    <strong>${transacao.descricao}</strong>
    <span>${formatarMoeda(Number(transacao.valor))}</span>
  `;

  const btn = document.createElement("button");
  btn.className = "remover";
  btn.type = "button";
  btn.textContent = "🗑";
  btn.title = "Remover transação";
  btn.addEventListener("click", () => removerTransacao(transacao.id));

  li.appendChild(info);
  li.appendChild(btn);

  return li;
}

function renderizar() {
  lista.innerHTML = "";

  transacoes.forEach((t) => {
    lista.appendChild(criarItem(t));
  });

  const saldo = calcularSaldo();
  saldoEl.textContent = formatarMoeda(saldo);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descricao.value.trim();
  const val = Number(valor.value);

  if (!desc || !val || val <= 0) return;

  const novaTransacao = {
    id: crypto.randomUUID(),
    descricao: desc,
    valor: val,
    tipo: tipo.value,
  };

  transacoes.push(novaTransacao);
  salvar();
  renderizar();
  form.reset();
  descricao.focus();
});

renderizar();
