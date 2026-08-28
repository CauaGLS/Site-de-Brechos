# Ao Desapego — Feira de Brechós (Brasília-DF)

Site institucional de uma feira de brechós em Brasília-DF. Reúne informações
dos expositores e suas redes sociais, um catálogo de peças à venda, páginas
institucionais (locais/datas do evento) e um sistema de compra e validação
de ingressos com QR Code.

## Stack

**Frontend** (`frontend/`)
- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (estilo "new-york", ícones lucide-react)
- [TanStack Query](https://tanstack.com/query) para data-fetching/cache
- [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) para formulários e validação
- [better-auth](https://www.better-auth.com/) para autenticação (e-mail/senha + Google OAuth), com sua própria conexão Postgres (`pg`)
- Cliente de API gerado a partir do schema OpenAPI do backend via [`@hey-api/openapi-ts`](https://heyapi.dev/) (`services/`)
- Gerenciador de pacotes: **pnpm**

**Backend** (`backend/`)
- [Django 5.2](https://www.djangoproject.com/) + [django-ninja](https://django-ninja.dev/) (API REST com validação via Pydantic e OpenAPI automático)
- Autenticação via Bearer token (`core/auth.py`), validando sessões criadas pelo better-auth do frontend na mesma base Postgres
- PostgreSQL como banco de dados
- `qrcode` + `Pillow` para geração de QR Code dos ingressos
- `django-cors-headers`, `whitenoise` (arquivos estáticos) e `gunicorn` (servidor WSGI de produção)

**Infra / Deploy**
- Frontend hospedado na [Vercel](https://vercel.com/)
- Backend + Postgres hospedados no [Render](https://render.com/) (plano free), via `backend/render.yaml`
- Postgres local para desenvolvimento via `docker-compose.yml`

## Estrutura de pastas

```
.
├── backend/                     # API Django (django-ninja)
│   ├── app/                     # App principal: models, api (rotas), schemas, admin
│   ├── core/                    # Configuração do projeto Django (settings, urls, auth, asgi/wsgi)
│   ├── manage.py
│   ├── requirements.txt         # Dependências Python de produção
│   ├── build.sh                 # Script de build usado pelo Render (install + collectstatic + migrate)
│   ├── render.yaml              # Blueprint do Render (web service + Postgres free)
│   └── .env.example
├── frontend/                    # App Next.js
│   ├── app/
│   │   ├── (auth)/sign-in/      # Página de login
│   │   ├── (main)/              # Home, /locais, /ingressos, /expositor/[id]
│   │   ├── api/[[...proxy]]/    # Proxy server-side para a API Django (injeta o Bearer token da sessão)
│   │   └── api/auth/[...all]/   # Rotas do better-auth
│   ├── components/              # Componentes de UI e de domínio (expositor, peça, ingresso, QR Code, etc.)
│   ├── components/ui/           # Componentes shadcn/ui
│   ├── lib/                     # auth.ts (config do better-auth), auth-client.ts, utils.ts
│   ├── services/                # Cliente de API gerado via @hey-api/openapi-ts (a partir do OpenAPI do backend)
│   ├── types/                   # Tipos manuais adicionais
│   └── .env.example
├── docker-compose.yml           # Postgres local para desenvolvimento
└── update-env.ps1               # Copia um .env raiz para backend/.env e frontend/.env (uso local no Windows)
```

## Arquitetura de autenticação/API (importante)

O frontend **não** chama a API Django diretamente do navegador. O fluxo é:

1. O usuário autentica via **better-auth**, que roda dentro do próprio Next.js
   (rotas em `app/api/auth/[...all]`) e grava sessão/usuário direto no Postgres
   compartilhado com o Django (tabelas `users`, `sessions`, `accounts`,
   `verifications` — ver `backend/app/models.py`).
2. Chamadas de API do cliente usam o SDK gerado em `services/` com `BASE`
   vazio, ou seja, sempre relativo (`/api/...`) — batendo no **proxy**
   `app/api/[[...proxy]]/route.ts` do próprio Next.js.
3. Esse proxy lê a sessão better-auth atual, adiciona o header
   `Authorization: Bearer <token>` e repassa a requisição para o backend
   Django em `SERVER_URL` (`django-ninja` valida esse token em
   `backend/core/auth.py`, buscando a sessão na tabela `sessions`).

Por isso a variável de ambiente que aponta para a URL do backend é
**`SERVER_URL`** (server-side, sem prefixo `NEXT_PUBLIC_`) — o navegador
nunca precisa conhecer a URL do Django.

## Como rodar localmente

Pré-requisitos: Node.js 20+, [pnpm](https://pnpm.io/), Python 3.12+, Docker
(para o Postgres local) — ou um Postgres já rodando.

### 1. Banco de dados

```bash
docker compose up -d
```

Isso sobe um Postgres em `localhost:5432` (ver `docker-compose.yml`).

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows (PowerShell/Git Bash)
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
cp .env.example .env           # preencha SECRET_KEY, POSTGRES_*, etc.

python manage.py migrate
python manage.py createsuperuser   # opcional, para acessar /admin
python manage.py runserver         # http://localhost:8000
```

A API fica em `http://localhost:8000/api/`, com docs automáticas (Swagger)
em `http://localhost:8000/api/docs`.

### 3. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env.local     # preencha SERVER_URL, BETTER_AUTH_SECRET, POSTGRES_*, etc.

pnpm run dev                   # http://localhost:3000
```

Sempre que o schema da API do backend mudar, regenere o cliente TypeScript:

```bash
pnpm run openapi-ts
```

(lê `http://localhost:8000/api/openapi.json`, configurado em
`openapi-ts.config.ts`).

## Deploy

### Backend → Render (plano free)

1. Suba o repositório para o GitHub (ou similar).
2. No dashboard do Render: **New +** → **Blueprint**, selecione o repositório
   e aponte o "Blueprint file path" para `backend/render.yaml` (o Blueprint
   já define `rootDir: backend`, então todos os comandos rodam a partir
   dali).
3. O Blueprint cria automaticamente:
   - Um **Web Service** Python rodando `gunicorn core.wsgi:application`,
     com build via `backend/build.sh` (instala dependências, roda
     `collectstatic` e `migrate`).
   - Um banco **PostgreSQL free**, já conectado ao serviço via `DATABASE_URL`.
4. Preencha manualmente (variáveis marcadas `sync: false` no `render.yaml`)
   após o primeiro deploy:
   - `CORS_ALLOWED_ORIGINS` — URL do frontend na Vercel (ex.:
     `https://seu-app.vercel.app`)
   - `CSRF_TRUSTED_ORIGINS` — mesma URL do frontend (necessário para o
     `/admin`)
5. Note as limitações do plano free do Render: o web service "dorme" após
   inatividade (primeira requisição depois disso é mais lenta) e o Postgres
   free é removido automaticamente após 90 dias caso não seja promovido a um
   plano pago.

### Frontend → Vercel

1. Importe o repositório na Vercel apontando o **Root Directory** para
   `frontend/`.
2. Configure as variáveis de ambiente do projeto (Settings → Environment
   Variables), mesmas do `frontend/.env.example`:
   - `SERVER_URL` → URL pública do backend no Render (ex.:
     `https://seu-backend.onrender.com`)
   - `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (URL pública do próprio site na
     Vercel)
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (se usar login
     com Google)
   - `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`,
     `POSTGRES_DB` (mesmo Postgres usado pelo backend, para o better-auth
     conseguir ler/gravar sessões e usuários)
3. Deploy. A Vercel detecta Next.js automaticamente (`pnpm install` +
   `pnpm run build`).
4. Depois do primeiro deploy de cada lado, atualize `CORS_ALLOWED_ORIGINS` /
   `CSRF_TRUSTED_ORIGINS` no Render com a URL final da Vercel, e `SERVER_URL`
   na Vercel com a URL final do Render.
