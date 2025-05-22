import express from "express";
import {
  getLoggedInUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/register-user", registerUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout-user", isAuthenticated, logoutUser);
userRouter.get("/me", isAuthenticated, getLoggedInUser);

export default userRouter;
