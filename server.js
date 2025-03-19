const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Security Headers
app.use(helmet());

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://gwg1.onrender.com"], // Allow frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// ✅ Serve React Frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// ✅ API Routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/interview", require("./routes/interviewRequestRoutes"));
app.use("/api/v1/teacher", require("./routes/teacherRequestRoutes"));

// ✅ Start Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server Running in ${process.env.NODE_ENV} Mode on port ${port}`);
});
