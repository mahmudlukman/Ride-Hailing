import { Response } from "express";
import { ICaptain } from "../models/captain.model";
import dotenv from "dotenv";
dotenv.config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse environment variables to integrates with fallback values
const captainTokenExpire = parseInt(process.env.JWT_EXPIRES || "300", 10);

// options for cookies
export const captainTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + captainTokenExpire * 60 * 60 * 1000),
  maxAge: captainTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const captainToken = (user: ICaptain, statusCode: number, res: Response) => {
  const captainToken = user.SignAccessToken();

  // Only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    captainTokenOptions.secure = true;
  }

  res.cookie("captain_token", captainToken, captainTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    captainToken,
  });
};
