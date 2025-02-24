import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../ormconfig";
import { User } from "../entity/User";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

// 用户注册（已完成）
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = userRepository.create({ username, password: hashedPassword });
    await userRepository.save(newUser);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// 用户登录（新添加）
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
