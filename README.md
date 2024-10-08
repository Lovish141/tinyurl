
### ZippyURL

ZippyURL is a fast and scalable URL shortening service that allows users to create short, easy-to-share links from long URLs. It uses Prisma with PostgreSQL for data storage and features automated migrations to keep your database up to date.

## Getting Started

### Step 1: Install Dependencies

Begin by installing the necessary dependencies:

```bash
npm install
```

### Step 2: Configure Environment Variables

Copy the `.env.example` file to `.env` and replace the placeholder values with your actual values:

```bash
cp .env.example .env
```

Ensure the following variables are correctly set up in the `.env` file:

```bash
DATABASE_URL=your_postgres_db_url
APP_URL=your_app_url
```



### Step 3: Push Migrations to Your Database

Apply the latest Prisma migrations to your local PostgreSQL database:

```bash
npx prisma migrate dev
```

### Step 4: Generate the Prisma Client

Generate the Prisma client to interact with the database:

```bash
npx prisma generate
```

### Step 5: Run the Development Server

Finally, start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Features

- **Shortening Links**: Quickly shorten long URLs with a unique hash.
- **Link Redirection**: Automatically redirect users from the short URL to the original URL.

### Additional Commands

- **Deploy Migrations to Production**:
  If you are deploying this to production, run the following command:

  ```bash
  npx prisma migrate deploy
  ```

- **Inspect the Database**:
  Use Prisma Studio to view and manage your database in a web UI:

  ```bash
  npx prisma studio
  ```



### Deployment

When deploying to services like Vercel, ensure that the following commands are included in your deployment build process:

```bash
npm run build && prisma generate && prisma migrate deploy
```

This will generate the Prisma Client and apply any database migrations.