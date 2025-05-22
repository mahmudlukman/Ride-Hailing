import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { NextFunction, Request, Response } from "express";
import { sendToken } from "../utils/jwt";
import dotenv from "dotenv";
import { captainToken } from "../utils/jwt.captain";
import Captain, { ICaptain } from "../models/captain.model";
dotenv.config();

// @desc    Register a new captain
// @route   POST /api/v1/register-captain
// @access  Public
export const registerCaptain = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, password, vehicle } = req.body;

      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      // Create captain data object with required fields
      const captainData: any = {
        name: `${firstName} ${lastName}`,
        email,
        password,
        vehicle: {
          color: vehicle.color,
          plate: vehicle.plate,
          capacity: vehicle.capacity,
          vehicleType: vehicle.vehicleType,
        },
      };

      // Create the user with the prepared data
      const captain: ICaptain = await Captain.create(captainData);

      // Send JWT token in response
      captainToken(captain, 201, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Login user
// @route   POST /api/v1/login-captain
// @access  Public
export const loginCaptain = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const captain = await Captain.findOne({ email }).select("+password");

      if (!captain) {
        return next(new ErrorHandler("Invalid credentials", 400));
      }

      const isPasswordMatch = await captain.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid credentials", 400));
      }
      captainToken(captain, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Logout user
// @route   POST /api/v1/logout-captain
// @access  Public
export const logoutCaptain = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("captain_token", "", {
        maxAge: 1,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// @desc    Get logged in user profile
// @route   GET /api/v1/captain
// @access  Private (Requires access token)
export const getLoggedInCaptain = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const captainId = req.captain?._id;
      const captain = await Captain.findById(captainId).select("-password");
      res.status(200).json({ success: true, captain });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
