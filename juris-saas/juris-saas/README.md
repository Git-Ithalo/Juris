# Juris SaaS

Plataforma para criação e gerenciamento de sites profissionais para escritórios de advocacia, sem necessidade de programação.

## O que é o projeto

Um construtor de sites simplificado, especializado em advocacia. O escritório cria uma conta, preenche seus dados (equipe, áreas de atuação, contato), escolhe cores e conteúdo pelo editor visual, e publica um site profissional em `/site/{slug-do-escritorio}`.

## Tecnologias utilizadas

**Frontend:** React 19 + Vite, React Router, Axios
**Backend:** Python 3, FastAPI, SQLAlchemy, Pydantic
**Banco de dados:** SQLite (desenvolvimento) — arquitetura pronta para migrar para PostgreSQL/MySQL trocando apenas `DATABASE_URL`
**Autenticação:** JWT (python-jose) + hash de senha com bcrypt (passlib)

## Estrutura das pastas

```
juris-saas/
├── backend/
│   └── app/
│       ├── main.py              # ponto de entrada, registra rotas e CORS
│       ├── config.py            # carrega variáveis de ambiente (.env)
│       ├── database.py          # engine/sessão SQLAlchemy
│       ├── models/              # User, Company, Lawyer, PracticeArea, SocialLink, Website
│       ├── schemas/             # validação/serialização (Pydantic)
│       ├── routes/              # endpoints REST, um arquivo por domínio
│       ├── services/            # regra de negócio, separada das rotas
│       ├── authentication/      # hashing, JWT, dependency de usuário logado
│       └── utils/               # geração de slug, etc.
└── frontend/
    └── src/
        ├── pages/                # LandingPage, LoginPage, RegisterPage, PublicSitePage
        ├── pages/dashboard/      # páginas internas do painel administrativo
        ├── layouts/              # DashboardLayout (sidebar responsiva)
        ├── components/           # PublicSiteTemplate, ProtectedRoute, ConfirmDialog
        ├── services/             # cliente axios e chamadas de API por recurso
        ├── hooks/                # useAuth (contexto de autenticação)
        └── styles/               # design system (tokens CSS)
```

## Como instalar e rodar localmente

### Pré-requisitos
- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # ajuste SECRET_KEY antes de ir para produção
uvicorn app.main:app --reload
```

A API sobe em `http://localhost:8000`. Documentação interativa automática em `http://localhost:8000/docs`. O banco SQLite é criado automaticamente em `backend/database/app.db` na primeira execução.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env       # aponta para http://localhost:8000 por padrão
npm run dev
```

Aplicação em `http://localhost:5173`.

### Testando o fluxo completo
1. Acesse `http://localhost:5173/registrar` e crie uma conta.
2. Você será redirecionado ao dashboard — preencha advogados, áreas de atuação e contatos.
3. Em "Personalização", ajuste cores/conteúdo e veja o preview em tempo real.
4. Clique em "Publicar site".
5. Acesse `http://localhost:5173/site/{slug-gerado}` (o slug aparece na aba "Domínio") para ver o site no ar.

## Como fazer deploy

**Backend** (Render, Railway ou Fly.io):
- Defina as variáveis de ambiente do `.env.example` no painel do serviço (principalmente `SECRET_KEY` com um valor forte e aleatório, e `CORS_ORIGINS` com a URL do frontend em produção).
- Troque `DATABASE_URL` para uma instância PostgreSQL/MySQL gerenciada — nenhum código precisa mudar, só a variável.
- Comando de start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

**Frontend** (Vercel, Netlify ou Cloudflare Pages):
- Comando de build: `npm run build`, diretório de saída: `dist`.
- Defina `VITE_API_URL` apontando para a URL pública do backend.

## Status do desenvolvimento

- [x] Etapa 1 — Estrutura do projeto
- [x] Etapa 2 — Backend + banco de dados
- [x] Etapa 3 — Autenticação
- [x] Etapa 4 — Dashboard
- [x] Etapa 5 — CRUD das informações do escritório
- [x] Etapa 6 — Template público
- [x] Etapa 7 — Editor/personalização (com preview em tempo real)
- [x] Etapa 8 — Publicação do site
- [x] Etapa 9 — Responsividade (320px a 1440px)
- [x] Etapa 10 — Polimento visual e correção de bugs

## O que ainda é próxima fase (arquitetura já preparada, não implementado)

- Pagamentos reais (Stripe/Mercado Pago) — planos já aparecem na UI
- Domínio próprio / subdomínios personalizados — hoje cada site vive em `/site/{slug}`
- Upload real de imagens (logo, fotos de advogados) — campos já existem no banco, esperando um endpoint de upload
- Área administrativa do dono do SaaS (ver todos os usuários/empresas/planos)
- Contador de visualizações do site
- Migrations com Alembic (hoje as tabelas são criadas via `create_all`, adequado para MVP)

## Notas técnicas relevantes

- Bug conhecido corrigido: `bcrypt>=4.1` quebra a detecção de versão do `passlib==1.7.4`. O `requirements.txt` fixa `bcrypt==4.0.1` por compatibilidade.
- Todo endpoint autenticado deriva a empresa do usuário a partir do token JWT — nunca de um `company_id` enviado pelo cliente. Isso foi testado explicitamente (um usuário não consegue ver dados de outro).
- O preview do editor de personalização usa exatamente o mesmo componente (`PublicSiteTemplate`) que renderiza o site público, evitando que o preview fique dessincronizado do resultado real.
