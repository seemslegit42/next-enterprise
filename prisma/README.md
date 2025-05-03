# Prisma ORM Setup

This project uses Prisma ORM with a PostgreSQL database to manage data persistence.

## Schema

The Prisma schema is defined in `prisma/schema.prisma` and includes the following models:

### NextAuth.js Models
- `Account`: Stores OAuth account information
- `Session`: Manages user sessions
- `User`: Stores user information
- `VerificationToken`: Handles email verification

### Application Models
- `Task`: Represents tasks in the system with status tracking
- `ProcessLog`: Stores system process logs with severity levels

## Environment Variables

The database connection is configured using the `DATABASE_URL` environment variable in the `.env` file:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grimoire?schema=public"
```

## Available Commands

The following npm scripts are available for working with Prisma:

- `npm run prisma:generate`: Generate the Prisma client
- `npm run prisma:migrate:dev`: Create a new migration during development
- `npm run prisma:migrate:deploy`: Deploy migrations to production
- `npm run prisma:studio`: Open Prisma Studio to view and edit data

## Setting Up a Local Database

1. Install PostgreSQL locally or use a Docker container
2. Create a database named `grimoire`
3. Update the `DATABASE_URL` in `.env` with your credentials
4. Run `npm run prisma:migrate:dev` to create the database schema

## Using Prisma in the Application

The Prisma client is initialized in `src/lib/prisma.ts` and can be imported in any file:

```typescript
import prisma from '@/lib/prisma';

// Example: Find all tasks
const tasks = await prisma.task.findMany();
```
