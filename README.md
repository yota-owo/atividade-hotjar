# A Runa — MVP Mighty Blade 3ª Edição

Aplicação web desenvolvida como Projeto Integrador do curso de **Análise e Desenvolvimento de Sistemas** da PUC Goiás (2026/1), integrando as disciplinas de Desenvolvimento Web, Modelagem de Interfaces (UI/UX) e Design de Software.

O sistema é um arquivo etéreo digital para o RPG de mesa **Mighty Blade 3ª Edição**: permite criar contas, gerar fichas de personagem e, futuramente, gerenciar campanhas inteiras de forma rápida e intuitiva.

---

## Funcionalidades (MVP — N1)

**Autenticação e Segurança**

- Cadastro de conta com dois perfis: **Jogador** e **Mestre da Forja**
- Login seguro com geração de JSON Web Token (JWT) e senhas criptografadas (Bcrypt)
- Bloqueio de rotas protegidas (Middlewares de Autenticação e RBAC)

**Gerador de Ficha (Integração API)**

- Criação de personagem consumindo os dados dinâmicos de Raças e Classes do Banco de Dados
- Cálculo automático de atributos e exibição de habilidades automáticas
- Possibilidade de vínculo da ficha com a conta do Mestre
- Salvamento direto no Banco de Dados (PostgreSQL)

**Dashboard (Painel do Jogador / Mestre)**

- Acesso unificado: Jogadores visualizam apenas as fichas que criaram; Mestres visualizam suas fichas e as dos jogadores vinculados a ele.
- Busca por nome e filtros combinados por raça e classe
- Exclusão de fichas (Delete) com atualização em tempo real
- Edição de nome, vida e mana pelo Mestre vinculado à ficha

**Raças e Classes base no MVP**

- **Raças:** Anão (For 4, Agi 2, Int 2, Von 3) | Elfo (For 2, Agi 4, Int 3, Von 3)
- **Classes:** Feiticeiro (Int +1, Von +1) | Guerreiro (For +1, Agi +1)

---

## Arquitetura e Tecnologias

A aplicação segue a arquitetura **MVC Adaptada**, dividida em containers isolados utilizando Padrões de Projeto como _Singleton_, _Chain of Responsibility_ (Middlewares) e _Adapter_.

| Camada             | Tecnologia                                            |
| ------------------ | ----------------------------------------------------- |
| **Frontend**       | HTML5 semântico, CSS3, JavaScript (Vanilla API Fetch) |
| **Estilização**    | Tailwind CSS (CDN), CSS customizado                   |
| **Backend**        | Node.js + Express.js                                  |
| **Database**       | PostgreSQL + Prisma ORM                               |
| **Segurança**      | JWT (JSON Web Token) + bcryptjs                       |
| **Infraestrutura** | Docker + Docker Compose + Nginx (Servidor Web)        |

---

## Estrutura do Projeto

```text
MightyBlade3eWebsite/
├── backend/
│   ├── prisma/             # Schema do Banco de Dados e Script de Seed (Raças/Classes)
│   ├── src/                # Controllers, Routes, Middlewares e Configurações (API)
│   ├── Dockerfile          # Imagem de construção do Node.js (Alpine)
│   └── package.json
├── frontend/               # Aplicação estática servida pelo Nginx
│   ├── assets/             # CSS Global e Imagens
│   ├── dashboard/          # Painel de Listagem de Fichas
│   ├── index/              # Landing Page Principal
│   ├── login/              # Autenticação e Cadastro
│   └── personagem/         # Gerador de Fichas
├── docker-compose.yml      # Orquestrador de Containers (Banco, API, Front)
└── README.md
```

---

## Como Executar (O Mestre dos Containers)

A aplicação foi completamente "dockerizada" para garantir que rode em qualquer ambiente com um único comando, sem necessidade de instalar Node.js ou PostgreSQL localmente.

**Pré-requisitos:** Ter o [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando na sua máquina.

1. Clone o repositório e acesse a pasta raiz:

```bash
git clone https://github.com/Gbredo/MightyBlade3eWebsite.git
cd MightyBlade3eWebsite
```

2. Suba toda a infraestrutura (Banco de Dados, Backend e Frontend) através do orquestrador:

```bash
docker-compose up -d --build
```

3. Acesse a aplicação! O servidor web do frontend estará exposto na porta `8080`:
   👉 **[http://localhost:8080/index/index.html](http://localhost:8080/index/index.html)**

_(Nota Técnica: O backend roda internamente na porta `3000` e o PostgreSQL na porta `5432`, e o banco já nasce populado com as raças e classes oficiais devido ao script de Seed)._

Para desligar a aplicação e os containers, utilize o comando abaixo na pasta raiz:

```bash
docker-compose down
```

---

## Equipe

| Nome                 | Responsabilidade                                      |
| -------------------- | ----------------------------------------------------- |
| **Guilherme Breder** | Frontend — Interface e experiência do usuário (UI/UX) |
| **Enzo Silvestre**   | Backend / Documentação                                |
| **Gabriel Ykaro**     | Backend / Arquitetura / Infraestrutura (Docker)       |
| **Gabriel Neto**    | Backend / Documentação                                |

Projeto Integrador de Módulo — PUC Goiás | ADS 4º Período | 2026/1

---

## Créditos

O sistema **Mighty Blade 3ª Edição** é propriedade intelectual da **Editora Runas**.  
Este projeto é de caráter exclusivamente acadêmico e não possui fins comerciais.

- Site oficial: [editorarunas.com.br](https://editorarunas.com.br)

---

## Licença

Uso acadêmico restrito. Todos os direitos do sistema de RPG Mighty Blade pertencem à Editora Runas.
