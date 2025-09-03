const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const connectDB = require("./config/mongoose-config");

// DB CONNECTING
connectDB();

// Global Middlewares
app.use(express.json({ limit: "10kb" })); // body limit
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Security Middlewares
app.use(helmet()); // secure headers
app.use(compression()); // gzip compression
app.use(mongoSanitize()); // prevent NoSQL injection
app.use(xss()); // prevent XSS
app.use(hpp()); // prevent parameter pollution

// Rate limiting (apply to all requests)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://synctax.netlify.app",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Handle preflight
app.options("*", cors());

// ROUTES
const userRouter = require("./routes/user-route");
const snippetRouter = require("./routes/snippet-route");

app.use("/api/user", userRouter);
app.use("/api/snippet", snippetRouter);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy 🚀" });
});

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
