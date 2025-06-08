# 🏆 EPesportes API

API oficial para o aplicativo **EPesportes**, uma plataforma que promove a integração esportiva entre alunos e professores através de campeonatos escolares, estatísticas, enquetes e rede social.

## 🚀 Tecnologias Utilizadas

* [NestJS](https://nestjs.com/) — Framework backend escalável para Node.js
* [PostgreSQL](https://www.postgresql.org/) — Banco relacional para dados estruturados
* [MongoDB](https://www.mongodb.com/) — Banco NoSQL para dados dinâmicos
* [Supabase Auth](https://supabase.com/) — Autenticação moderna com suporte a OAuth
* WebSockets com `@nestjs/websockets` e `socket.io`
* TypeORM + Mongoose — ORM e ODM para os bancos

## 📁 Estrutura do Projeto

* `users` – Gerenciamento de perfis, usernames, preferências
* `players` – Dados de atletas, estatísticas e posições
* `teams` – Times escolares e suas logos
* `games` – Modalidades esportivas e regras
* `matches` – Partidas, escalações e resultados
* `timeline-posts` – Feed social com posts, reações e comentários
* `polls` – Enquetes com votos e exibição de resultados
* `notifications` – Sistema de notificações push
* `websockets/app.gateway.ts` – Emissão de eventos em tempo real

## ⚙️ Requisitos

* Node.js 18+
* PostgreSQL rodando local ou remoto
* MongoDB (Atlas ou local)
* Conta Supabase com Auth e API habilitada

## ▶️ Instalação

```bash
# Clone o repositório
git clone https://github.com/rickalves/epesportes-api
cd epesportes-api

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.example .env
# Configure: Supabase, PostgreSQL, MongoDB

# Inicie em modo desenvolvimento
npm run start:dev
```

## 🔐 Autenticação

* Supabase Auth com e-mail/senha e OAuth (Google)
* JWT com tokens de acesso e refresh
* Middleware de segurança com `JwtGuard` e `RolesGuard`
* Rotas protegidas com validação do token no header `Authorization`

## 🔁 WebSocket Gateway

Os seguintes eventos em tempo real são emitidos:

* `notifications:new` – Notificação recebida
* `feed:new-post` – Nova postagem no feed
* `polls:voted` – Voto em enquete registrado
* `timeline:reaction` – Nova reação em post

## 📬 Endpoints para Teste

### 🔐 Autenticação

* `POST /auth/login`
* `POST /auth/google`
* `POST /auth/refresh`

### 👤 Usuários

* `GET /users`
* `GET /users/:id`
* `PATCH /users/:id`
* `DELETE /users/:id`
* `GET /users/check-username/:username`

### 🏅 Atletas

* `GET /players`
* `GET /players/:id`
* `PATCH /players/:id`

### 🏟️ Times e Modalidades

* `GET /teams`
* `GET /teams/:id`
* `GET /games`

### 🔹 Partidas

* `GET /matches`
* `GET /matches/:id`
* `POST /matches`
* `PATCH /matches/:id`
* `POST /matches/:id/lineup`

### 💬 Feed / Resenha

* `GET /timeline-posts`
* `POST /timeline-posts`
* `PATCH /timeline-posts/:id`
* `POST /timeline-posts/:id/react`
* `POST /timeline-posts/:id/comment`

### 📊 Enquetes

* `GET /polls`
* `GET /polls/:id`
* `POST /polls`
* `POST /polls/:id/vote`

### 🔔 Notificações

* `GET /notifications`
* `PATCH /notifications/mark-all-read`

> ⚠️ A maioria dos endpoints requer autenticação JWT:

```http
Authorization: Bearer <token>
```

## 🧪 Testes

```bash
npm run test
```

Inclui testes unitários com Jest para serviços principais como usuários, postagens, menções, enquetes e notificações.

## ☁️ Deploy

Recomendado usar:

* [Railway](https://railway.app/)
* [Render](https://render.com/)
* Supabase + MongoDB Atlas

## 📚 Contribuição

Abra issues ou PRs! Este projeto nasceu com fins educacionais, mas evolui constantemente para um sistema completo de gestão esportiva escolar.

## 📄 Licença

MIT License — © 2025 Rick Alves
