const express = require("express");
const cors = require("cors");
const attendanceRoutes = require("./routes/attendanceRoutes");
const labourRoutes = require("./routes/labourRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const clientRoutes = require("./routes/clientRoutes")
const labourProfileRoutes = require("./routes/labourProfileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const saleRoutes = require("./routes/saleRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Factory Management API Running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/labours", labourRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/labour-profile", labourProfileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/sales", saleRoutes);

// Error Middleware (Always Last)
app.use(errorMiddleware);

module.exports = app;
