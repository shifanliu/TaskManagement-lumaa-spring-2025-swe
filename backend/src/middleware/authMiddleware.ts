import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: number };
}

// 修正：确保 `authenticateToken` 只返回 `void`
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return; // 确保返回，不执行 `next()`
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    req.user = { userId: decoded.userId };
    next(); // 只有解析成功才调用 `next()`
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
    return; // 确保返回，不执行 `next()`
  }
};
