"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const auth_1 = require("./middleware/auth");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const DB_PASSWORD = process.env.MONGODB_PASSWORD;
const DB_USERNAME = process.env.MONGODB_USERNAME;
const DB_NAME = process.env.DB_NAME;
if (!DB_PASSWORD) {
    console.log("DB_PASSWORD environment is not set");
    process.exit(1);
}
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.uoa3z.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api", routes_1.default);
app.use("/", (req, res) => {
    res.json({ message: "Hello World" });
});
// Error handling
app.use(auth_1.errorHandler);
// Database connection
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
exports.default = app;
