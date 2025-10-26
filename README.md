# Contact Hub

Aplicação full-stack para centralizar o atendimento multicanal (WhatsApp e e-mail) em um único painel. O repositório contém um frontend em React/Vite e um backend em Node.js/Express que integra MongoDB, Twilio e webhooks externos.

## Visão geral

- **Frontend**: React + TypeScript + Vite + Tailwind + shadcn/ui (pasta raiz `src/`).
- **Backend**: Express + Mongoose (pasta `backend/`).
- **Banco de dados**: MongoDB Atlas.
- **Integrações**: Twilio WhatsApp webhook (recepção e envio); endpoint para e-mails via webhook.

## Requisitos

- Node.js 18 ou superior e npm.
- Conta no MongoDB Atlas com string de conexão válida.
- Conta Twilio com canal WhatsApp configurado (sandbox ou número próprio).
- Opcional: serviço de webhook para e-mail (SendGrid Inbound Parse, Mailgun Routes, Postmark Inbound etc.).
- Opcional: ngrok (ou similar) para expor o backend durante o desenvolvimento.

## Setup rápido

```sh
git clone <url-do-repositorio>
cd contact-hub-zen

# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
npm install
cd ..
```

### Variáveis de ambiente

Crie `backend/.env` com os seguintes valores:

```env
PORT=5001
MONGODB_URI=<sua-connection-string>
MONGODB_DB_NAME=contacthub

TWILIO_ACCOUNT_SID=<sid>
TWILIO_AUTH_TOKEN=<token>
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886 # ou seu número habilitado
```

> Garanta que o usuário do MongoDB tenha permissão `readWrite` no banco.

Se quiser controlar o frontend com variáveis (ex.: URL do backend diferente), crie `src/.env` ou atualize `src/services/api.ts`.

## Execução em desenvolvimento

Em terminais separados:

```sh
# Backend (a partir da pasta raiz)
cd backend
npm run dev

# Frontend
cd ..

```

O frontend abre em `http://localhost:5173` e o backend expõe a API em `http://localhost:5001/api`.

### Webhook do WhatsApp

1. Execute o backend localmente.
2. Inicie o ngrok (ou similar) apontando para a porta do backend: `ngrok http 5001`.
3. Na Twilio Console, configure a URL de webhook de entrada para `https://<seu-ngrok>/api/integrations/whatsapp`.
4. Envie uma mensagem para o número associado; um ticket é criado/atualizado automaticamente.

### Webhook de e-mail (opcional)

O endpoint `POST /api/integrations/email` espera um corpo JSON ou `application/x-www-form-urlencoded` com `from`, `subject` e `text`. Configure seu provedor para enviar esses campos. Caso ele envie `multipart/form-data`, adapte o backend (ex.: adicionando `multer`).

## Estrutura de pastas

```
.
├── backend/
│   ├── controllers/
│   │   └── twilioController.js
│   ├── models/
│   │   ├── Client.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── integrations.js
│   │   └── tickets.js
│   └── server.js
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/api.ts
│   └── ...
└── README.md
```

## Fluxo principal

1. **Recepção de mensagens**: webhooks (WhatsApp/e-mail) procuram o cliente no MongoDB, criam se necessário e adicionam a mensagem ao ticket aberto (ou criam um ticket novo).
2. **Portal web**: lista tickets com status, assunto e tópico; painel lateral mostra histórico resumido, permite marcar como resolvido/reabrir, alterar tópico e visualizar todas as mensagens.
3. **Respostas**: há endpoint `POST /api/integrations/whatsapp/send` para disparo manual via Twilio. Envio de e-mail ainda não está implementado.

## Endpoints úteis (backend)

- `GET /api/tickets` – lista tickets ordenados por atualização.
- `GET /api/tickets/:id`
- `POST /api/tickets` – cria ticket manualmente.
- `PUT /api/tickets/:id` – atualiza dados (inclui tópico, prioridade etc.).
- `PATCH /api/tickets/:id/status` – altera status (`novo`, `em_andamento`, `resolvido`).
- `POST /api/tickets/:id/messages` – adiciona mensagem a um ticket.
- `POST /api/integrations/whatsapp` – webhook Twilio.
- `POST /api/integrations/whatsapp/send` – envia resposta via Twilio.
- `POST /api/integrations/email` – webhook para e-mails.

## Build e produção

O projeto ainda não possui pipeline automatizado. Para deploy manual:

1. Configure variáveis de ambiente conforme acima.
2. Faça build do frontend: `npm run build` (gera `dist/`).
3. Sirva o frontend via Vite preview, Nginx, Vercel etc. O backend pode ser publicado no mesmo servidor (Node) ou em serviços como Render, Railway ou Heroku.
4. Atualize as URLs dos webhooks (Twilio/serviço de e-mail) para apontar para o host público.

## Contribuição

1. Crie uma branch.
2. Faça as alterações com testes manuais (enviar mensagens, alterar status).
3. Abra um pull request descrevendo o impacto e como testar.

## Licença

Este repositório não possui licença explícita. Adicione uma licença (ex.: MIT) se desejar compartilhar ou reutilizar o código.
