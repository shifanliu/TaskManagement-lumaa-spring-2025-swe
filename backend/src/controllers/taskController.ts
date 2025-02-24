import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { Task } from "../entity/Task";
import { AuthRequest } from "../middleware/authMiddleware";

const taskRepository = AppDataSource.getRepository(Task);

// 获取当前用户的所有任务
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await taskRepository.find({ where: { user: { id: req.user?.userId } } });
    res.json(tasks); // 直接使用 res.json()
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// 创建新任务
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const newTask = taskRepository.create({
      title,
      description,
      user: { id: req.user?.userId }
    });

    await taskRepository.save(newTask);
    res.status(201).json(newTask); // 确保直接返回 JSON
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// 更新任务
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, isComplete } = req.body;

    const task = await taskRepository.findOne({ where: { id: Number(id), user: { id: req.user?.userId } } });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.isComplete = isComplete ?? task.isComplete;

    await taskRepository.save(task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// 删除任务
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await taskRepository.findOne({ where: { id: Number(id), user: { id: req.user?.userId } } });

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await taskRepository.remove(task);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
