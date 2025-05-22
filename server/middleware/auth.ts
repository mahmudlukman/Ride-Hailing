import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "./catchAsyncError";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler";
import User from "../models/user.model";
import Captain from "../models/captain.model";

// authenticated user
export const isAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resources", 400)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    req.user = await User.findById(decoded.id);

    next();
  }
);

// authenticated user
export const isCaptain = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const captain_token = req.cookies.captain_token as string;

    if (!captain_token) {
      return next(
        new ErrorHandler("Please login to access this resources", 400)
      );
    }

    const decoded = jwt.verify(
      captain_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("Access token is not valid", 400));
    }

    req.captain = await Captain.findById(decoded.id);

    next();
  }
);

