import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import companyRoutes from "./routes/companyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/companies", companyRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
