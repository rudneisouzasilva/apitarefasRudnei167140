# API de Tarefas

Aplicação de lista de tarefas com back-end em Node.js/Express + MongoDB e front-end em Angular. Tem login com JWT, senhas guardadas com hash e salt, e perfis de usuário.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `BACKEND/API` | API REST (Express, Mongoose, jsonwebtoken) |
| `FRONTEND/TODOapp` | App Angular que consome a API |
| `docs/` | Material da aula sobre proteção de senhas com hash e salt |

## Rotas da API

Todas ficam sob `/api`. Com exceção do login, todas exigem o token no cabeçalho `id-token`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | Autentica e devolve o token |
| POST | `/users` | Cria usuário |
| GET | `/users` | Lista usuários |
| PATCH | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Remove usuário |
| POST | `/post` | Cria tarefa |
| GET | `/getAll` | Lista tarefas |
| PATCH | `/update/:id` | Atualiza tarefa |
| DELETE | `/delete/:id` | Remove tarefa |

## Como rodar

### Back-end

```bash
cd BACKEND/API
npm install
MONGODB_URI="sua-string-de-conexao" JWT_SECRET="um-segredo-forte" npm start
```

As variáveis estão descritas em `BACKEND/API/.env.example`. A string do MongoDB também pode ser passada como argumento: `node index.js "sua-string-de-conexao"`.

### Front-end

```bash
cd FRONTEND/TODOapp
npm install
npm start
```

O app abre em `http://localhost:4200`. A URL da API fica em `src/app/app.ts` (hoje aponta para o deploy no Render).
