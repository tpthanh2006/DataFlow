import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import formsRoutes from "./routes/forms";
import airtableRoutes from "./routes/airtable";

// Load environment variables
dotenv.config();

const port = process.env.PORT || 8000;

const app: Express = express();

// Middleware
app.use(
  cors({
    // In the future, replace this with an environment variable
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/forms", formsRoutes);
app.use("/airtable", airtableRoutes);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("ISF Cambodia API Server");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
