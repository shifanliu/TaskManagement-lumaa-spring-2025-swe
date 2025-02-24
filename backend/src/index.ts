import express from "express";
import cors from "cors";
import helmet from "helmet";
import { AppDataSource } from "./ormconfig";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(helmet());
app.use("/tasks", taskRoutes);

// 连接数据库
AppDataSource.initialize()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.error("Database connection error:", err));

// 挂载路由
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
