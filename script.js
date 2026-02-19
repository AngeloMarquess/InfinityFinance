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


let graficoPizza;


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
  "Outros"
];

let categorias = JSON.parse(localStorage.getItem("categorias")) || CATEGORIAS_PADRAO;


let filtroAtual = "todas";
let categoriaAtual = "todas";

let editandoId = null;

let grafico;
let graficoCategoria;


// MIGRAÇÃO

transacoes = transacoes.map(t => ({
  ...t,
  categoria: t.categoria || "Outros",
  valor: Number(t.valor)
}));

salvar();


// FUNÇÕES

function salvar(){

  localStorage.setItem("transacoes", JSON.stringify(transacoes));

}

function salvarCategorias(){
  localStorage.setItem("categorias", JSON.stringify(categorias));
}


function atualizarSelectCategorias(){

  // FORM
  categoriaEl.innerHTML = "";

  categorias.forEach(cat=>{
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoriaEl.appendChild(opt);
  });

  // FILTRO
  const atual = filtroCategoriaEl.value;

  filtroCategoriaEl.innerHTML = `<option value="todas">Todas</option>`;

  categorias.forEach(cat=>{
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtroCategoriaEl.appendChild(opt);
  });

  // tenta manter seleção anterior
  if ([...filtroCategoriaEl.options].some(o => o.value === atual)) {
    filtroCategoriaEl.value = atual;
  } else {
    filtroCategoriaEl.value = "todas";
    categoriaAtual = "todas";
  }
}



function formatarMoeda(valor){

  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

}


function calcularSaldo(){

  return transacoes.reduce((acc, t) => {

    return t.tipo === "receita"
      ? acc + t.valor
      : acc - t.valor;

  }, 0);

}


// REMOVER

function removerTransacao(id){

  transacoes = transacoes.filter(t => t.id !== id);

  salvar();

  renderizar();

}


// EDITAR

function editarTransacao(id){

  const t = transacoes.find(t => t.id === id);

  if(!t) return;

  descricao.value = t.descricao;
  valor.value = t.valor;
  tipo.value = t.tipo;
  categoriaEl.value = t.categoria;

  editandoId = id;

}


// CRIAR ITEM

function criarItem(t){

  const li = document.createElement("li");

  li.className = `item ${t.tipo}`;


  const info = document.createElement("div");

  info.innerHTML = `
    <strong>${t.descricao}</strong>
    <span>${t.categoria} • ${formatarMoeda(t.valor)}</span>
  `;


  const btnEditar = document.createElement("button");

  btnEditar.textContent = "✏️";

  btnEditar.onclick = () => editarTransacao(t.id);


  const btnRemover = document.createElement("button");

  btnRemover.textContent = "🗑";

  btnRemover.onclick = () => removerTransacao(t.id);


  const actions = document.createElement("div");

  actions.appendChild(btnEditar);

  actions.appendChild(btnRemover);


  li.appendChild(info);

  li.appendChild(actions);


  return li;

}


// FILTROS

function aplicarFiltros(){

  let resultado = transacoes;

  if(filtroAtual !== "todas")
    resultado = resultado.filter(t => t.tipo === filtroAtual);

  if(categoriaAtual !== "todas")
    resultado = resultado.filter(t => t.categoria === categoriaAtual);

  return resultado;

}


// GRÁFICO GERAL

function atualizarGrafico(){

  const receitas = transacoes
    .filter(t => t.tipo === "receita")
    .reduce((a,b)=>a+b.valor,0);

  const despesas = transacoes
    .filter(t => t.tipo === "despesa")
    .reduce((a,b)=>a+b.valor,0);


  const dados = [receitas, despesas];


  if(!grafico){

    grafico = new Chart(ctxGrafico,{

      type:"bar",

      data:{

        labels:[["Receitas"],["Despesas"]],

        datasets:[{

          data:dados,

          backgroundColor:["#16a34a","#dc2626"],

          borderRadius:6

        }]

      },

      options:{ plugins:{legend:{display:false}} }

    });

  }else{

    grafico.data.datasets[0].data = dados;

    grafico.update();

  }

}


// GRÁFICO CATEGORIA

function atualizarGraficoCategoria(){

  const lista = aplicarFiltros();

  const mapa = {};

  lista.forEach(t=>{

    mapa[t.categoria] = (mapa[t.categoria]||0) + t.valor;

  });


  const labels = Object.keys(mapa);

  const data = Object.values(mapa);


  if(!graficoCategoria){

    graficoCategoria = new Chart(ctxCategoria,{

      type:"bar",

      data:{

        labels,

        datasets:[{

          data,

          borderRadius:6

        }]

      },

      options:{plugins:{legend:{display:false}}}

    });

  }else{

    graficoCategoria.data.labels = labels;

    graficoCategoria.data.datasets[0].data = data;

    graficoCategoria.update();

  }

}


function atualizarGraficoPizza(){

  const mapa = {};

  transacoes.forEach(t=>{

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
    "#84cc16"

  ];


  if(!graficoPizza){

    graficoPizza = new Chart(ctxPizza,{

      type:"doughnut",

      data:{

        labels,

        datasets:[{

          data,

          backgroundColor:cores,

          borderWidth:0

        }]

      },

      options:{

        plugins:{

          legend:{

            position:"bottom"

          }

        },

        cutout:"65%"

      }

    });

  }else{

    graficoPizza.data.labels = labels;

    graficoPizza.data.datasets[0].data = data;

    graficoPizza.update();

  }

}


// RENDER

function renderizar(){

  lista.innerHTML="";

  aplicarFiltros().forEach(t=>{

    lista.appendChild(criarItem(t));

  });


  const receitas = transacoes
    .filter(t=>t.tipo==="receita")
    .reduce((a,b)=>a+b.valor,0);

  const despesas = transacoes
    .filter(t=>t.tipo==="despesa")
    .reduce((a,b)=>a+b.valor,0);


  totalReceitasEl.textContent = formatarMoeda(receitas);

  totalDespesasEl.textContent = formatarMoeda(despesas);

  saldoEl.textContent = formatarMoeda(calcularSaldo());


  atualizarGrafico();

  atualizarGraficoCategoria();
  atualizarGraficoPizza();


}


// SUBMIT (CORRIGIDO)

form.addEventListener("submit", function(e){

  e.preventDefault();

  const desc = descricao.value.trim();

  const val = Number(valor.value);

  if(!desc || val<=0) return;


  if(editandoId !== null){

    const t = transacoes.find(t=>t.id===editandoId);

    if(t){

      t.descricao = desc;
      t.valor = val;
      t.tipo = tipo.value;
      t.categoria = categoriaEl.value;

    }

    editandoId=null;

  }else{

    transacoes.push({

      id:Date.now().toString(),

      descricao:desc,

      valor:val,

      tipo:tipo.value,

      categoria:categoriaEl.value

    });

  }


  salvar();

  renderizar();

  form.reset();

});


// FILTROS EVENTOS

botoesFiltro.forEach(btn=>{

  btn.onclick=()=>{

    filtroAtual=btn.dataset.filtro;

    botoesFiltro.forEach(b=>b.classList.remove("ativo"));

    btn.classList.add("ativo");

    renderizar();

  };

});


filtroCategoriaEl.onchange=()=>{

  categoriaAtual=filtroCategoriaEl.value;

  renderizar();

};


// LIMPAR

btnLimparTudo.onclick=()=>{

  if(confirm("Apagar tudo?")){

    transacoes=[];

    salvar();

    renderizar();

  }

};


// BACKUP

btnExportar.onclick=()=>{

  const blob=new Blob(
    [JSON.stringify(transacoes,null,2)],
    {type:"application/json"}
  );

  const a=document.createElement("a");

  a.href=URL.createObjectURL(blob);

  a.download="backup.json";

  a.click();

};


inputImportar.onchange=async e=>{

  const file=e.target.files[0];

  if(!file) return;

  const text=await file.text();

  transacoes=JSON.parse(text);

  salvar();

  renderizar();

};

addCategoriaBtn.addEventListener("click", () => {

  const nome = novaCategoriaEl.value.trim();

  if(!nome) return;

  // impede duplicado (case insensitive)
  const existe = categorias.some(c => c.toLowerCase() === nome.toLowerCase());

  if(existe){
    alert("Essa categoria já existe.");
    return;
  }

  categorias.push(nome);
  categorias.sort((a,b) => a.localeCompare(b, "pt-BR"));

  salvarCategorias();
  atualizarSelectCategorias();

  // seleciona automaticamente no form
  categoriaEl.value = nome;

  novaCategoriaEl.value = "";
  novaCategoriaEl.focus();

});

// garante que toda transação tenha categoria existente
transacoes = transacoes.map(t => ({
  ...t,
  categoria: categorias.includes(t.categoria) ? t.categoria : "Outros"
}));

salvar();


// START
atualizarSelectCategorias();
renderizar();
