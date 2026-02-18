const form = document.getElementById("form");
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const tipo = document.getElementById("tipo");
const lista = document.getElementById("lista");
const saldoEl = document.getElementById("saldo");
const totalReceitasEl = document.getElementById("totalReceitas");
const totalDespesasEl = document.getElementById("totalDespesas");
const ctxGrafico = document.getElementById("graficoFinanceiro");
let grafico;
const botoesFiltro = document.querySelectorAll(".filtro");
let filtroAtual = "todas";
const btnLimparTudo = document.getElementById("limparTudo");
const btnExportar = document.getElementById("exportar");
const inputImportar = document.getElementById("importarArquivo");





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
    categoryPercentage: 0.6,  // espaço entre categorias
    barPercentage: 0.5,       // largura da barra
    borderRadius: 6,


    backgroundColor: [
      "#16a34a", // verde receitas
      "#dc2626"  // vermelho despesas
    ],
    borderColor: [
      "#16a34a",
      "#dc2626"
    ],
    borderWidth: 1,
  },
],
      },
      options: {
        responsive: true,
          maintainAspectRatio: false,
          layout: {
  padding: { bottom: 20 }
},

        plugins: {
          legend: { display: false },
        },
        scales: {
            x: {
    ticks: {
      autoSkip: false,
      maxRotation: 0,
      minRotation: 0,
      padding: 8
    }
  },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                value.toLocaleString("pt-BR", {
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

function exportarBackup() {
  const payload = {
    app: "InfinityFinance",
    version: 1,
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

function validarBackup(obj) {
  return (
    obj &&
    Array.isArray(obj.transacoes) &&
    obj.transacoes.every(
      (t) =>
        typeof t.descricao === "string" &&
        (t.tipo === "receita" || t.tipo === "despesa") &&
        typeof t.valor === "number"
    )
  );
}

async function importarBackup(file) {
  const text = await file.text();
  const obj = JSON.parse(text);

  // aceita tanto o formato novo (com wrapper) quanto uma lista pura
  if (Array.isArray(obj)) {
    // formato antigo: [transacoes]
    transacoes = obj;
  } else {
    if (!validarBackup(obj)) {
      alert("Arquivo inválido. Selecione um backup do InfinityFinance.");
      return;
    }
    transacoes = obj.transacoes;
  }

  salvar();
  renderizar();
}


function aplicarFiltro(listaTransacoes) {
  if (filtroAtual === "todas") return listaTransacoes;
  return listaTransacoes.filter((t) => t.tipo === filtroAtual);
}


function renderizar() {
  lista.innerHTML = "";

  aplicarFiltro(transacoes).forEach((t) => {
  lista.appendChild(criarItem(t));
});

  const totalReceitas = transacoes
  .filter((t) => t.tipo === "receita")
  .reduce((acc, t) => acc + Number(t.valor), 0);

const totalDespesas = transacoes
  .filter((t) => t.tipo === "despesa")
  .reduce((acc, t) => acc + Number(t.valor), 0);

totalReceitasEl.textContent = formatarMoeda(totalReceitas);
totalDespesasEl.textContent = formatarMoeda(totalDespesas);
atualizarGrafico(totalReceitas, totalDespesas);



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

botoesFiltro.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroAtual = btn.dataset.filtro;

    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    renderizar();
  });
});


btnLimparTudo.addEventListener("click", () => {
  if (transacoes.length === 0) return;

  const ok = confirm("Tem certeza que deseja apagar todas as transações? Isso não pode ser desfeito.");
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

  const ok = confirm("Importar este backup vai substituir suas transações atuais. Continuar?");
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

