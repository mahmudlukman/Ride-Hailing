import express from "express";
import {
  getLoggedInCaptain,
  loginCaptain,
  logoutCaptain,
  registerCaptain,
} from "../controllers/captain.controller";
import { isAuthenticated, isCaptain } from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/register-captain", registerCaptain);
userRouter.post("/login-captain", loginCaptain);
userRouter.get("/logout-captain", isCaptain, logoutCaptain);
userRouter.get("/captain", isCaptain, getLoggedInCaptain);

export default userRouter;
