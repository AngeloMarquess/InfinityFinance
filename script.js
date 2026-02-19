const form = document.getElementById("form");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const categoriaEl = document.getElementById("categoria");

const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");
const totalReceitasEl = document.getElementById("totalReceitas");
const totalDespesasEl = document.getElementById("totalDespesas");

const botoesFiltro = document.querySelectorAll(".filtro");
const filtroCategoriaEl = document.getElementById("filtroCategoria");

const btnLimparTudo = document.getElementById("limparTudo");
const btnExportar = document.getElementById("exportar");
const inputImportar = document.getElementById("importarArquivo");

const ctxGrafico = document.getElementById("graficoFinanceiro");
const ctxCategoria = document.getElementById("graficoCategoria");

let grafico;
let graficoCategoria;

let filtroAtual = "todas";
let categoriaAtual = "todas";

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

// MIGRAÇÃO V8: garante categoria e garante valor numérico
transacoes = transacoes.map((t) => ({
  ...t,
  categoria: t.categoria || "Outros",
  valor: Number(t.valor),
}));
localStorage.setItem("transacoes", JSON.stringify(transacoes));

function salvar() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function formatarMoeda(n) {
  return Number(n || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function calcularSaldo(listaTransacoes) {
  return listaTransacoes.reduce((acc, t) => {
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
    <span>${transacao.categoria} • ${formatarMoeda(transacao.valor)}</span>
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

function aplicarFiltros(listaTransacoes) {
  let result = listaTransacoes;

  // filtro por tipo (todas/receita/despesa)
  if (filtroAtual !== "todas") {
    result = result.filter((t) => t.tipo === filtroAtual);
  }

  // filtro por categoria
  if (categoriaAtual !== "todas") {
    result = result.filter((t) => (t.categoria || "Outros") === categoriaAtual);
  }

  return result;
}

function atualizarGrafico(totalReceitas, totalDespesas) {
  if (!ctxGrafico) return;

  const dados = [totalReceitas, totalDespesas];

  if (!grafico) {
    grafico = new Chart(ctxGrafico, {
      type: "bar",
      data: {
        labels: [["Receitas"], ["Despesas"]],
        datasets: [
          {
            label: "R$",
            data: dados,

            categoryPercentage: 0.6,
            barPercentage: 0.5,
            borderRadius: 6,

            backgroundColor: ["#16a34a", "#dc2626"],
            borderColor: ["#16a34a", "#dc2626"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { bottom: 20 } },
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
              padding: 10,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                Number(value).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }),
            },
          },
        },
      },
    });
  } else {
    grafico.data.datasets[0].data = dados;
    grafico.update();
  }
}

function atualizarGraficoCategoria(listaTransacoes) {
  if (!ctxCategoria) return;

  // soma por categoria (com base na visão atual)
  const mapa = {};
  listaTransacoes.forEach((t) => {
    const cat = t.categoria || "Outros";
    mapa[cat] = (mapa[cat] || 0) + Number(t.valor);
  });

  // ordena por valor desc (mais fintech)
  const pares = Object.entries(mapa).sort((a, b) => b[1] - a[1]);
  const labels = pares.map(([k]) => k);
  const data = pares.map(([, v]) => v);

  if (!graficoCategoria) {
    graficoCategoria = new Chart(ctxCategoria, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Total",
            data,
            borderWidth: 1,
            borderRadius: 6,
            categoryPercentage: 0.7,
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                Number(value).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }),
            },
          },
        },
      },
    });
  } else {
    graficoCategoria.data.labels = labels;
    graficoCategoria.data.datasets[0].data = data;
    graficoCategoria.update();
  }
}

function exportarBackup() {
  const payload = {
    app: "InfinityFinance",
    version: 2, // V8
    exportedAt: new Date().toISOString(),
    transacoes,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  const data = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `infinityfinance-backup-${data}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

function normalizarTransacoes(arr) {
  return arr.map((t) => ({
    id: t.id || (crypto?.randomUUID?.() ?? Date.now().toString()),
    descricao: String(t.descricao || "").trim(),
    tipo: t.tipo === "receita" ? "receita" : "despesa",
    categoria: (t.categoria || "Outros").trim(),
    valor: Number(t.valor),
  })).filter((t) => t.descricao && Number.isFinite(t.valor));
}

async function importarBackup(file) {
  const text = await file.text();
  const obj = JSON.parse(text);

  // aceita tanto wrapper quanto array puro
  if (Array.isArray(obj)) {
    transacoes = normalizarTransacoes(obj);
  } else if (obj && Array.isArray(obj.transacoes)) {
    transacoes = normalizarTransacoes(obj.transacoes);
  } else {
    throw new Error("Formato inválido");
  }

  salvar();
  renderizar();
}

function renderizar() {
  // visão global (totais sempre do app inteiro)
  const totalReceitas = transacoes
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const totalDespesas = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  totalReceitasEl.textContent = formatarMoeda(totalReceitas);
  totalDespesasEl.textContent = formatarMoeda(totalDespesas);

  const saldo = calcularSaldo(transacoes);
  saldoEl.textContent = formatarMoeda(saldo);

  // lista + gráfico por categoria seguem filtros
  const visaoAtual = aplicarFiltros(transacoes);

  lista.innerHTML = "";
  visaoAtual.forEach((t) => lista.appendChild(criarItem(t)));

  // gráfico geral (visão global do app)
  atualizarGrafico(totalReceitas, totalDespesas);

  // gráfico por categoria (visão atual)
  atualizarGraficoCategoria(visaoAtual);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descricao.value.trim();
  const val = Number(valor.value);

  if (!desc || !Number.isFinite(val) || val <= 0) return;

  const novaTransacao = {
    id: crypto?.randomUUID?.() ?? Date.now().toString(),
    descricao: desc,
    valor: val,
    tipo: tipo.value,
    categoria: categoriaEl.value || "Outros",
  };

  transacoes.push(novaTransacao);
  salvar();
  renderizar();
  form.reset();
  descricao.focus();
});

botoesFiltro.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroAtual = btn.dataset.filtro;

    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    renderizar();
  });
});

filtroCategoriaEl.addEventListener("change", () => {
  categoriaAtual = filtroCategoriaEl.value;
  renderizar();
});

btnLimparTudo.addEventListener("click", () => {
  if (transacoes.length === 0) return;

  const ok = confirm(
    "Tem certeza que deseja apagar todas as transações? Isso não pode ser desfeito."
  );
  if (!ok) return;

  transacoes = [];
  salvar();
  renderizar();
});

btnExportar.addEventListener("click", () => {
  if (transacoes.length === 0) {
    alert("Não há transações para exportar.");
    return;
  }
  exportarBackup();
});

inputImportar.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const ok = confirm(
    "Importar este backup vai substituir suas transações atuais. Continuar?"
  );
  if (!ok) {
    e.target.value = "";
    return;
  }

  try {
    await importarBackup(file);
    alert("Backup importado com sucesso!");
  } catch {
    alert("Não foi possível importar. Verifique se o arquivo é um JSON válido.");
  } finally {
    e.target.value = "";
  }
});

renderizar();
