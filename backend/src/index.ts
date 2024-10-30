import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler } from "./middleware/auth";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

const DB_PASSWORD = process.env.MONGODB_PASSWORD;
const DB_USERNAME = process.env.MONGODB_USERNAME;
const DB_NAME = process.env.DB_NAME;

if (!DB_PASSWORD) {
  console.log("DB_PASSWORD environment is not set");
  process.exit(1);
}

const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.uoa3z.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api", routes);


app.use("/", (req, res) => {
  res.json({message: "Hello World"})
})

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
