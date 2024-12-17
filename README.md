# medivault

medivault is a full-stack pharmacy inventory management application that allows users to manage pharmaceutical stock efficiently.

## Prerequisites

To get started with MediVault, ensure that you have the following tools installed and properly configured on your system:

1. **Git**: Version control system to clone and manage the project repository.
   * [Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

2. **Node.js**: JavaScript runtime for the client and server.
   * [Installation Guide](https://nodejs.org/en/download/)
   * Required version: v20.17.0 or later

3. **PostgreSQL**: Relational database for backend storage.
   * [Installation Guide](https://www.postgresql.org/download/)
   * Make sure PostgreSQL is running locally
   * Default database name: `medivault`

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/gellyrslls/medivault.git
cd medivault
```

### 2. Install Dependencies
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 3. Set Up PostgreSQL Database
 * [Setup Guide](https://www.pgadmin.org/docs/)

Create a `.env` file in the server directory with the following content:

```env
# Backend .env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/medivault"
JWT_SECRET="your_secret_key"  # Replace with any strong random string
PORT=5000
```

### 4. Run Prisma Migrations
```bash
cd server
npx prisma migrate dev --name init
```

### 5. Start Development Servers
```bash
# Backend
cd server && npm run dev

# Frontend (in a new terminal)
cd client && npm run dev
```

### 6. Access the Application
* Backend runs at: `http://localhost:5000`
* Frontend runs at: `http://localhost:5173` (default Vite port)

## Notes

1. **Database Name**: By default, the database will be created as `medivault`. Ensure your `DATABASE_URL` in `.env` uses this name.
2. **JWT_SECRET**: Replace `your_secret_key` in the `.env` file with any strong random string.

## Testing the App

1. Ensure PostgreSQL is running and the database is correctly set up.
2. Start both the frontend and backend servers.
3. Access the app in your browser at `http://localhost:5173`.
