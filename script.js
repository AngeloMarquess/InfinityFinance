// ELEMENTOS
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
const ctxPizza = document.getElementById("graficoPizza");

const novaCategoriaEl = document.getElementById("novaCategoria");
const addCategoriaBtn = document.getElementById("addCategoria");

// V9: gerenciar categorias
const gerenciarCategoriaEl = document.getElementById("gerenciarCategoria");
const renomearCategoriaEl = document.getElementById("renomearCategoria");
const btnRenomearCategoria = document.getElementById("btnRenomearCategoria");
const btnExcluirCategoria = document.getElementById("btnExcluirCategoria");

// ESTADO
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

const CATEGORIAS_PADRAO = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Lazer",
  "Educação",
  "Contas",
  "Investimentos",
  "Outros",
];

let categorias = JSON.parse(localStorage.getItem("categorias")) || CATEGORIAS_PADRAO;

let filtroAtual = "todas";
let categoriaAtual = "todas";

let editandoId = null;

let grafico;
let graficoCategoria;
let graficoPizza;

// --- Storage helpers
function salvar() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function salvarCategorias() {
  localStorage.setItem("categorias", JSON.stringify(categorias));
}

// --- Utils
function formatarMoeda(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalizarNomeCategoria(nome) {
  return String(nome || "").trim();
}

function existeCategoria(nome) {
  const n = normalizarNomeCategoria(nome).toLowerCase();
  return categorias.some((c) => String(c).toLowerCase() === n);
}

// MIGRAÇÃO/INICIALIZAÇÃO
function garantirOutros() {
  if (!categorias.includes("Outros")) categorias.push("Outros");
}

function migrarTransacoes() {
  transacoes = transacoes.map((t) => ({
    ...t,
    id: t.id || (crypto?.randomUUID?.() ?? Date.now().toString()),
    descricao: String(t.descricao || "").trim(),
    tipo: t.tipo === "receita" ? "receita" : "despesa",
    valor: Number(t.valor),
    categoria: normalizarNomeCategoria(t.categoria) || "Outros",
  }))
  .filter((t) => t.descricao && Number.isFinite(t.valor) && t.valor > 0);

  // garante categoria válida
  transacoes = transacoes.map((t) => ({
    ...t,
    categoria: categorias.includes(t.categoria) ? t.categoria : "Outros",
  }));
}

garantirOutros();
migrarTransacoes();
salvarCategorias();
salvar();

// --- UI: categorias
function atualizarSelectCategorias() {
  // FORM
  categoriaEl.innerHTML = "";
  categorias.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoriaEl.appendChild(opt);
  });

  // FILTRO
  const filtroAnterior = filtroCategoriaEl.value || "todas";
  filtroCategoriaEl.innerHTML = `<option value="todas">Todas</option>`;
  categorias.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtroCategoriaEl.appendChild(opt);
  });

  if ([...filtroCategoriaEl.options].some((o) => o.value === filtroAnterior)) {
    filtroCategoriaEl.value = filtroAnterior;
  } else {
    filtroCategoriaEl.value = "todas";
    categoriaAtual = "todas";
  }

  // GERENCIAR
  if (gerenciarCategoriaEl) {
    const anterior = gerenciarCategoriaEl.value;
    gerenciarCategoriaEl.innerHTML = "";
    categorias.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      gerenciarCategoriaEl.appendChild(opt);
    });

    if ([...gerenciarCategoriaEl.options].some((o) => o.value === anterior)) {
      gerenciarCategoriaEl.value = anterior;
    }
  }
}

// --- Regras de cálculo
function calcularSaldo() {
  return transacoes.reduce((acc, t) => (t.tipo === "receita" ? acc + t.valor : acc - t.valor), 0);
}

function aplicarFiltros() {
  let resultado = transacoes;

  if (filtroAtual !== "todas") resultado = resultado.filter((t) => t.tipo === filtroAtual);
  if (categoriaAtual !== "todas") resultado = resultado.filter((t) => t.categoria === categoriaAtual);

  return resultado;
}

// --- CRUD Transações
function removerTransacao(id) {
  transacoes = transacoes.filter((t) => t.id !== id);
  salvar();
  renderizar();
}

function editarTransacao(id) {
  const t = transacoes.find((x) => x.id === id);
  if (!t) return;

  descricao.value = t.descricao;
  valor.value = t.valor;
  tipo.value = t.tipo;
  categoriaEl.value = t.categoria;

  editandoId = id;
  descricao.focus();
}

function criarItem(t) {
  const li = document.createElement("li");
  li.className = `item ${t.tipo}`;

  const info = document.createElement("div");
  info.className = "info";
  info.innerHTML = `
    <strong>${t.descricao}</strong>
    <span>${t.categoria} • ${formatarMoeda(t.valor)}</span>
  `;

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "✏️";
  btnEditar.title = "Editar";
  btnEditar.onclick = () => editarTransacao(t.id);

  const btnRemover = document.createElement("button");
  btnRemover.textContent = "🗑";
  btnRemover.title = "Remover";
  btnRemover.onclick = () => removerTransacao(t.id);

  const actions = document.createElement("div");
  actions.appendChild(btnEditar);
  actions.appendChild(btnRemover);

  li.appendChild(info);
  li.appendChild(actions);

  return li;
}

// --- Gráfico geral (Receitas x Despesas)
function atualizarGrafico() {
  const receitas = transacoes.filter((t) => t.tipo === "receita").reduce((a, b) => a + b.valor, 0);
  const despesas = transacoes.filter((t) => t.tipo === "despesa").reduce((a, b) => a + b.valor, 0);

  const dados = [receitas, despesas];

  if (!grafico) {
    grafico = new Chart(ctxGrafico, {
      type: "bar",
      data: {
        labels: [["Receitas"], ["Despesas"]],
        datasets: [
          {
            data: dados,
            backgroundColor: ["#16a34a", "#dc2626"],
            borderRadius: 6,
          },
        ],
      },
      options: { plugins: { legend: { display: false } } },
    });
  } else {
    grafico.data.datasets[0].data = dados;
    grafico.update();
  }
}

// --- Gráfico por categoria (baseado na visão filtrada)
function atualizarGraficoCategoria() {
  const visao = aplicarFiltros();

  const mapa = {};
  visao.forEach((t) => {
    mapa[t.categoria] = (mapa[t.categoria] || 0) + t.valor;
  });

  const labels = Object.keys(mapa);
  const data = Object.values(mapa);

  if (!graficoCategoria) {
    graficoCategoria = new Chart(ctxCategoria, {
      type: "bar",
      data: {
        labels,
        datasets: [{ data, borderRadius: 6 }],
      },
      options: { plugins: { legend: { display: false } } },
    });
  } else {
    graficoCategoria.data.labels = labels;
    graficoCategoria.data.datasets[0].data = data;
    graficoCategoria.update();
  }
}

// --- Pizza por categoria (baseado na visão filtrada)
function atualizarGraficoPizza() {
  const visao = aplicarFiltros();

  const mapa = {};
  visao.forEach((t) => {
    mapa[t.categoria] = (mapa[t.categoria] || 0) + t.valor;
  });

  const labels = Object.keys(mapa);
  const data = Object.values(mapa);

  const cores = [
    "#22c55e",
    "#ef4444",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#64748b",
    "#14b8a6",
  ];

  if (!graficoPizza) {
    graficoPizza = new Chart(ctxPizza, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map((_, i) => cores[i % cores.length]),
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
        cutout: "65%",
      },
    });
  } else {
    graficoPizza.data.labels = labels;
    graficoPizza.data.datasets[0].data = data;
    graficoPizza.update();
  }
}

// --- Render
function renderizar() {
  lista.innerHTML = "";
  aplicarFiltros().forEach((t) => lista.appendChild(criarItem(t)));

  const receitas = transacoes.filter((t) => t.tipo === "receita").reduce((a, b) => a + b.valor, 0);
  const despesas = transacoes.filter((t) => t.tipo === "despesa").reduce((a, b) => a + b.valor, 0);

  totalReceitasEl.textContent = formatarMoeda(receitas);
  totalDespesasEl.textContent = formatarMoeda(despesas);
  saldoEl.textContent = formatarMoeda(calcularSaldo());

  atualizarGrafico();
  atualizarGraficoCategoria();
  atualizarGraficoPizza();
}

// --- Submit (Adicionar / Editar)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = descricao.value.trim();
  const val = Number(valor.value);

  if (!desc || !Number.isFinite(val) || val <= 0) return;

  const catEscolhida = categorias.includes(categoriaEl.value) ? categoriaEl.value : "Outros";
  const tipoEscolhido = tipo.value === "receita" ? "receita" : "despesa";

  if (editandoId !== null) {
    const t = transacoes.find((x) => x.id === editandoId);
    if (t) {
      t.descricao = desc;
      t.valor = val;
      t.tipo = tipoEscolhido;
      t.categoria = catEscolhida;
    }
    editandoId = null;
  } else {
    transacoes.push({
      id: crypto?.randomUUID?.() ?? Date.now().toString(),
      descricao: desc,
      valor: val,
      tipo: tipoEscolhido,
      categoria: catEscolhida,
    });
  }

  salvar();
  renderizar();
  form.reset();
  descricao.focus();
});

// --- Filtros
botoesFiltro.forEach((btn) => {
  btn.onclick = () => {
    filtroAtual = btn.dataset.filtro;

    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    renderizar();
  };
});

filtroCategoriaEl.onchange = () => {
  categoriaAtual = filtroCategoriaEl.value;
  renderizar();
};

// --- Limpar tudo
btnLimparTudo.onclick = () => {
  if (!transacoes.length) return;
  if (!confirm("Apagar tudo?")) return;

  transacoes = [];
  salvar();
  renderizar();
};

// --- Backup
btnExportar.onclick = () => {
  const payload = {
    app: "InfinityFinance",
    version: 9,
    exportedAt: new Date().toISOString(),
    transacoes,
    categorias,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "infinityfinance-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
};

inputImportar.onchange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const obj = JSON.parse(text);

    // aceita: wrapper ou array direto
    if (Array.isArray(obj)) {
      transacoes = obj;
    } else if (obj && Array.isArray(obj.transacoes)) {
      transacoes = obj.transacoes;
      if (Array.isArray(obj.categorias)) categorias = obj.categorias;
    } else {
      alert("Arquivo inválido.");
      return;
    }

    garantirOutros();
    migrarTransacoes();
    salvarCategorias();
    salvar();
    atualizarSelectCategorias();
    renderizar();
    alert("Backup importado com sucesso!");
  } catch {
    alert("Não foi possível importar. Verifique se é um JSON válido.");
  } finally {
    e.target.value = "";
  }
};

// --- V9: Criar categoria
addCategoriaBtn.addEventListener("click", () => {
  const nome = normalizarNomeCategoria(novaCategoriaEl.value);
  if (!nome) return;

  if (existeCategoria(nome)) {
    alert("Essa categoria já existe.");
    return;
  }

  categorias.push(nome);
  garantirOutros();
  categorias.sort((a, b) => a.localeCompare(b, "pt-BR"));

  salvarCategorias();
  atualizarSelectCategorias();

  categoriaEl.value = nome;
  novaCategoriaEl.value = "";
  novaCategoriaEl.focus();

  renderizar();
});

// --- V9: Renomear categoria (atualiza transações)
btnRenomearCategoria?.addEventListener("click", () => {
  const atual = gerenciarCategoriaEl.value;
  const novo = normalizarNomeCategoria(renomearCategoriaEl.value);

  if (!atual) return;
  if (!novo) return alert("Digite o novo nome da categoria.");

  if (atual === "Outros") return alert('A categoria "Outros" não pode ser renomeada.');

  if (existeCategoria(novo)) return alert("Já existe uma categoria com esse nome.");

  categorias = categorias.map((c) => (c === atual ? novo : c));
  categorias.sort((a, b) => a.localeCompare(b, "pt-BR"));
  garantirOutros();

  transacoes = transacoes.map((t) => ({
    ...t,
    categoria: t.categoria === atual ? novo : t.categoria,
  }));

  salvarCategorias();
  salvar();
  atualizarSelectCategorias();

  // se estava filtrando pela categoria antiga, atualiza o filtro
  if (categoriaAtual === atual) categoriaAtual = novo;

  renomearCategoriaEl.value = "";
  alert(`Categoria "${atual}" renomeada para "${novo}".`);

  renderizar();
});

// --- V9: Excluir categoria (move transações para "Outros")
btnExcluirCategoria?.addEventListener("click", () => {
  const cat = gerenciarCategoriaEl.value;
  if (!cat) return;

  if (cat === "Outros") return alert('A categoria "Outros" não pode ser excluída.');

  const usadas = transacoes.some((t) => t.categoria === cat);
  const ok = confirm(
    usadas
      ? `Excluir "${cat}"? As transações dessa categoria serão movidas para "Outros".`
      : `Excluir "${cat}"?`
  );
  if (!ok) return;

  categorias = categorias.filter((c) => c !== cat);
  garantirOutros();

  transacoes = transacoes.map((t) => ({
    ...t,
    categoria: t.categoria === cat ? "Outros" : t.categoria,
  }));

  // se estava filtrando pela categoria excluída, volta pra "todas"
  if (categoriaAtual === cat) {
    categoriaAtual = "todas";
    filtroCategoriaEl.value = "todas";
  }

  salvarCategorias();
  salvar();
  atualizarSelectCategorias();
  renderizar();

  alert(`Categoria "${cat}" excluída.`);
});

// START
atualizarSelectCategorias();
renderizar();
