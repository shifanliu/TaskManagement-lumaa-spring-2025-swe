import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/test", (req, res) => {
    res.json({ message: "Auth route is working!" });
  });  

export default router;
