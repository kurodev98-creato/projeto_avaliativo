# Plataforma de Gerenciamento de Produtos e Operações Comerciais 🚀

Este repositório contém o código-fonte e a documentação técnica do sistema comercial desenvolvido como projeto prático para a disciplina de **Estágio Supervisionado / Atividade Prática Profissional** do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

A aplicação foi concebida sob o modelo de **Monorepo** utilizando as ferramentas mais modernas do ecossistema Web para solucionar problemas de descentralização e controle de inventário em empresas do setor varejista.

---

## 🛠️ Arquitetura e Tecnologias Utilizadas

Em total conformidade com as diretrizes e exigências estabelecidas no Manual de Estágio Supervisionado da instituição, este sistema foi construído utilizando as seguintes tecnologias:

* **Front-end Moderno (HTML5 / CSS3 / TypeScript):** O ecossistema da interface foi desenvolvido utilizando a biblioteca **React (Vite)** com **TypeScript**. A aplicação funciona como uma Single Page Application (SPA). Toda a estrutura semântica em **HTML5** e a estilização responsiva em **CSS3** são manipuladas de forma dinâmica via DOM, garantindo alta performance e modularidade através de componentes.
* **Back-end e Persistência:** A camada de persistência de dados e fornecimento de API RESTful foi implementada através do **PocketBase**, garantindo o gerenciamento seguro de operações comerciais, autenticação de usuários e controle de integridade dos dados de forma integrada.
* **Comunicação entre Camadas:** A interação entre o Front-end (React) e o Back-end (PocketBase) ocorre por meio de requisições assíncronas baseadas no protocolo HTTP, cumprindo o critério regulamentar de acoplamento e comunicação clara entre as tecnologias da stack.

---

## 🗄️ Modelagem do Banco de Dados (Coleções)

O banco de dados foi estruturado de forma normalizada para garantir a consistência das operações comerciais. Abaixo estão representadas as principais coleções (tabelas) utilizadas no sistema:

### 👥 Coleção: `users` (Autenticação e Níveis de Acesso)
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | KSUID / String (PK) | Identificador único do usuário |
| `username` | String | Nome de usuário único no sistema |
| `email` | String | E-mail para login |
| `password` | String (Hash) | Senha criptografada do usuário |

### 📦 Coleção: `products` (Gerenciamento de Estoque)
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | KSUID / String (PK) | Identificador único do produto |
| `name` | String | Nome do produto comercializado |
| `description`| String | Detalhes e especificações do item |
| `price` | Number / Float | Preço unitário de venda |
| `stock_qty` | Number / Integer | Quantidade atual disponível em estoque |

### 🛒 Coleção: `operations` (Movimentações Comerciais)
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | KSUID / String (PK) | Identificador único da transação |
| `product_id` | Relation (FK) | Vínculo com o produto comercializado (`products.id`) |
| `user_id` | Relation (FK) | Usuário responsável pela operação (`users.id`) |
| `quantity` | Number / Integer | Quantidade de itens movimentados |
| `type` | String (Enum) | Tipo da operação: `ENTRADA` ou `SAÍDA` |
| `created_at` | DateTime | Data e hora em que a transação foi efetuada |

---
