# E-Vote Server

This is the **backend** of the E-Vote system, built with **Express.js** and **TypeScript**.  
It provides a REST API for the **web** and **mobile** applications, handling authentication, voting logic, and database operations using **MongoDB**.

## 🚀 Features

- TypeScript-based **Express.js** server
- **MongoDB** with Mongoose ORM
- **User authentication & validation**
- **REST API** for web & mobile apps
- **Security**: Helmet, CORS, and validation with Joi
- **Logging**: Morgan for request logging

## 📂 Project Structure

```
server/              # Express.js backend (TypeScript)
├── api/                  # Vercel deploymeny
├── src/
│       │   ├── config/       # Database & env config
│       │   ├── controllers/  # Route handlers
│       │   ├── middlewares/  # Custom middlewares
│       │   ├── models/       # Mongoose schemas
│       │   ├── routes/       # API routes
│       │   ├── validators/   # Request validation
│       │   ├── app.ts
│       │   ├── server.ts     # Server entry point
├── .env.sample              # Environment variables
├── package.json      # Dependencies & scripts
├── tsconfig.json     # TypeScript config
```

## 🛠️ Setup & Installation

### 1️⃣ Install Dependencies

```sh
cd apps/server
npm install
```

### 2️⃣ Setup Environment Variables

Create a `.env` file inside `apps/server/` and add:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/e-vote
PORT=5000
```

### 3️⃣ Run the Server

```sh
npm run dev
```

### 4️⃣ Build & Start for Production

```sh
npm run build
npm start
```

## 📡 API Endpoints

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | User login          |
| GET    | `/api/votes`         | Get voting details  |

## 📜 License

This project is licensed under the [MIT License](LICENSE).
