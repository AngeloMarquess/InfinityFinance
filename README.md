<div align="center">
  <img src="assets/images/icon.png" width="100" />
  <h1>Infinity Finance</h1>
  <p><b>Controle Financeiro Inteligente em Suas Mãos</b></p>
  <p>Uma aplicação full-stack construída com as melhores bibliotecas do ecossistema moderno do React Native.</p>

  <div>
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" />
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  </div>
</div>

<br />

## 📱 Visão Geral

O **Infinity Finance** é a evolução do seu controle financeiro pessoal e empresarial. Originalmente um projeto web simples, ele foi totalmente reconstruído como uma plataforma SaaS universal que roda na **Web, iOS e Android**, usando a stack tech de ponta.

Com um design ultraconsistente, moderno (glassmorphism/dark mode automáticos) e uma usabilidade super fluida, ele não só substitui suas planilhas como transforma a gestão em um painel que você efetivamente gosta de navegar.

### 🖼️ Telas

<div align="center">
  *(Em breve)*
</div>

## ✨ Principais Funcionalidades

- **Autenticação Segura & Global:** Alimentado pelo Supabase Auth. Suporte total a login por e-mail e social.
- **Painel Dinâmico (Dashboard):** Visão completa de receitas, despesas, saldo geral e balanço isolado por contas.
- **UI Responsiva & Multi-plataforma:** Do seu navegador desktop direto para o seu smartphone utilizando os mesmos componentes (Expo Router).
- **Cartões & Faturas:** Controle a data de fechamento e visualize seu limite em tempo real separando gastos "da fatura" e "da compra".
- **Gestão de Transações:** Organização de despesas com sistema rápido de Lançamentos e Movimentações.
- **Categorias e Tags Personalizadas:** Edite e defina metas por etiquetas globais para gerar os melhores relatórios.
- **Design Premium:** Cores minuciosamente elaboradas, hover dinâmicos e suporte nativo ao **Dark Mode**.

## 🛠️ Tecnologias Utilizadas

Este projeto foi forjado utilizando a stack universal do momento:

- [Expo](https://expo.dev/) (Framework React Native / Web)
- [Expo Router](https://docs.expo.dev/router/introduction/) (Navegação baseada em arquivos)
- [NativeWind v4](https://www.nativewind.dev/) (Renderização Universal Tailwind CSS)
- [Supabase](https://supabase.com/) (Banco de dados PostgreSQL & Autenticação real-time)
- [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) (Ícones performáticos nativos, rodando também na web)

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js LTS
- Git

### Passos de Instalação

1. Clone o repositório
\`\`\`bash
git clone git@github.com:AngeloMarquess/InfinityFinance.git
cd InfinityFinance
\`\`\`

2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

3. Crie e configure seu arquivo \`.env\` baseado nas chaves do seu Supabase (`EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`).

4. Inicie o Servidor de Desenvolvimento
\`\`\`bash
npx expo start
\`\`\`
*(Ou utilize `npm run start` para forçar compatibilidade em todas as versões.)*

5. Simplesmente abra `/web` localmente (via `w`), ou conecte seu smartphone escanendo o QRCode através do app **Expo Go**.

<br />

---
<div align="center">
  Construído com ♥ por Angelo Marques.
</div>
