// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import { User } from "./entity/User";
// import { Task } from "./entity/Task";
// import dotenv from "dotenv";
// dotenv.config();

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   entities: [User, Task], 
//   synchronize: false,        // 开发阶段可以 true，生产要改为 false 并使用迁移
//   logging: true,           // 若想查看 SQL 日志可改为 true
//   migrations: ["src/migrations/*.ts"],
// });

// AppDataSource.initialize()
//   .then(() => console.log("Database connected successfully!"))
//   .catch((error) => console.error("Database connection error:", error));
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Task } from "./entity/Task";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "taskdb",
  synchronize: false, // 使用 migrations，不自动同步
  logging: true,
  entities: [User, Task], // 运行时使用编译后的 JS 文件
  migrations: ["dist/migrations/*.js"], // 确保指向正确的迁移文件
});
