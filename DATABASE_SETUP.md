# Database Setup Instructions

This project uses Prisma ORM with PostgreSQL. Follow these steps to set up your database:

## Prerequisites

- PostgreSQL installed locally or accessible via a connection string
- Node.js and npm installed

## Setup Steps

1. **Create a PostgreSQL Database**

   Create a new PostgreSQL database named `grimoire`:

   ```sql
   CREATE DATABASE grimoire;
   ```

   You can do this using a PostgreSQL client like pgAdmin, or via the command line:

   ```bash
   psql -U postgres -c "CREATE DATABASE grimoire;"
   ```

2. **Configure Environment Variables**

   Create a `.env.local` file in the root of the project with the following content:

   ```
   # NextAuth.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-at-least-32-chars

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Database Configuration
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grimoire?schema=public"
   ```

   Update the `DATABASE_URL` with your actual PostgreSQL credentials.

3. **Generate Prisma Client**

   Run the following command to generate the Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. **Create Database Schema**

   Run the following command to create the initial database schema:

   ```bash
   npm run prisma:migrate:dev
   ```

   This will create a new migration and apply it to your database.

5. **Seed the Database (Optional)**

   If you want to seed the database with initial data, you can create a seed script in the `prisma/seed.ts` file and run:

   ```bash
   npx prisma db seed
   ```

## Verifying the Setup

To verify that your database is set up correctly, you can run Prisma Studio:

```bash
npm run prisma:studio
```

This will open a web interface where you can view and edit your database.

## Troubleshooting

- If you encounter connection issues, make sure your PostgreSQL server is running and accessible.
- Check that the credentials in your `DATABASE_URL` are correct.
- If you're using a non-standard PostgreSQL port, make sure to update the port in the connection string.
- For Windows users, you might need to escape backslashes in the connection string.
