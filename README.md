# AI Research Copilot

A platform where engineering teams can upload their internal docs and ask questions in plain English and get accurate answers.

Built with NestJS + TypeScript, PostgreSQL, Redis, and OpenAI API.

## What I'm building

- Upload documents (PDF, markdown, text)
- Ask questions, get answers with sources
- AI agent that can autonomously research topics
- Multi-tenant — each team's data is isolated

## Tech Stack

- **Backend:** NestJS + TypeScript
- **Database:** PostgreSQL + pgvector
- **Cache/Queue:** Redis + BullMQ
- **AI:** OpenAI API + LangChain.js
- **Deployment:** AWS (coming later)

## Running locally
```bash
# Start Docker containers
docker compose -f docker-compose-dev.yml up -d

# Run migrations
npm run migration:run

# Start the API
npm run start:dev
```

## Status

Currently in active development — building in public.
