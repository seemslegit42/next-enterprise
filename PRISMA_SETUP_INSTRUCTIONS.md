# Prisma Setup Instructions

This document provides instructions for completing the Prisma ORM setup with PostgreSQL and integrating it with NextAuth.js.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed and working correctly

## Step 1: Install Required Dependencies

Install Prisma, the Prisma client, and authentication-related packages:

```bash
npm install prisma @prisma/client
npm install @auth/prisma-adapter bcrypt
```

## Step 2: Create a PostgreSQL Database

Create a new PostgreSQL database named `grimoire`:

```sql
CREATE DATABASE grimoire;
```

You can do this using a PostgreSQL client like pgAdmin, or via the command line:

```bash
psql -U postgres -c "CREATE DATABASE grimoire;"
```

## Step 3: Configure Environment Variables

Make sure your `.env.local` file contains the following variables:

```
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-at-least-32-chars

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database Configuration
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/grimoire?schema=public"
```

Replace `your-password` with your actual PostgreSQL password.

## Step 4: Generate Prisma Client

Generate the Prisma client:

```bash
npx prisma generate
```

## Step 5: Create Database Schema

Create the initial database schema:

```bash
npx prisma migrate dev --name init
```

## Step 6: Update Auth Configuration

Update the `src/lib/auth.ts` file to use the Prisma adapter:

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { compare } from "bcrypt";

import { env } from "../../env.mjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        
        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) return null;

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  // Rest of your configuration...
};
```

## Step 7: Create a User Registration Function

Create a function to register users with hashed passwords:

```typescript
// src/lib/services/userService.ts
import { hash } from "bcrypt";
import prisma from "../prisma";

export const userService = {
  async createUser(data: { name: string; email: string; password: string }) {
    const hashedPassword = await hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  },
};

export default userService;
```

## Step 8: Verify the Setup

To verify that your database is set up correctly, you can run Prisma Studio:

```bash
npx prisma studio
```

This will open a web interface where you can view and edit your database.

## Troubleshooting

- If you encounter connection issues, make sure your PostgreSQL server is running and accessible.
- Check that the credentials in your `DATABASE_URL` are correct.
- If you're using a non-standard PostgreSQL port, make sure to update the port in the connection string.
- For Windows users, you might need to escape backslashes in the connection string.
