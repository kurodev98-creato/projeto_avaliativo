# 🚀 Monorepo: Frontend React & PocketBase API

Este projeto consiste em uma arquitetura de Monorepo moderna que integra um ecossistema de frontend ágil utilizando **React (Vite)** com um backend robusto e leve gerenciado pelo **PocketBase**. O projeto foi estruturado com foco em performance, modularidade e princípios de automação.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React.js, Vite, React Router DOM (Módulos isolados com caminhos relativos para otimização de build).
* **Backend & Banco de Dados:** PocketBase (Banco de dados relacional embarcado, sistema de autenticação e REST API nativa).
* **Gerenciamento de Monorepo:** NPM Workspaces & `concurrently` para inicialização paralela dos microsserviços.

---

## 📁 Estrutura do Projeto

```text
projeto/
├── apps/
│   ├── pocketbase/🌐        # Servidor Backend & Executável do Banco de Dados
│   └── web/💻               # Frontend Single Page Application (SPA) em React
├── package.json             # Configuração global de scripts e workspaces
└── README.md                # Documentação do projeto