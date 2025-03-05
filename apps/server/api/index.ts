import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "../src/routes/index"; // Adjust the path if needed
import connectDB from "../src/config/db";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Root route with HTML response
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-Vote Server</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background-color: #f4f4f4;
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>Welcome to the E-Vote Server 🚀</h1>
      <p>This is the backend API for the E-Vote project.</p>
    </body>
    </html>
  `);
});

// ✅ Register API routes first so they are available immediately
app.use("/api", routes);

// ✅ Connect to MongoDB after setting up the app
connectDB();

export default app;
