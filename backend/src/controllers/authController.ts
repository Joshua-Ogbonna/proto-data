import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { ApiError } from "../utils/ApiError";
import AccessRequest from "../models/AccessRequest";
// import { sendEmail } from "../utils/email";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "24h" });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, companyName, companyWebsite, intendedUse } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      companyName,
      companyWebsite,
      intendedUse,
    });

    // Generate token
    const token = generateToken(user ? (user?._id as string) : "");

    // Send welcome email
    // await sendEmail({
    //   to: email,
    //   subject: "Welcome to Data Portal",
    //   template: "welcome",
    //   data: { firstName },
    // });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        intendedUse: user.intendedUse,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Get user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate token
    const token = generateToken(user ? (user._id as string) : "");

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        intendedUse: user.intendedUse,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        intendedUse: user.intendedUse,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, reason } = req.body;

    // Check if request already exists
    const existingRequest = await AccessRequest.findOne({ email });
    if (existingRequest) {
      throw new ApiError(400, "Access request already submitted");
    }

    // Create access request
    const request = await AccessRequest.create({
      email,
      reason,
    });

    // Send confirmation email
    // await sendEmail({
    //   to: email,
    //   subject: "Access Request Received",
    //   template: "accessRequestConfirmation",
    //   data: { email },
    // });

    // // Notify admin
    // await sendEmail({
    //   to: process.env.ADMIN_EMAIL!,
    //   subject: "New Access Request",
    //   template: "newAccessRequestNotification",
    //   data: {
    //     email,
    //     reason,
    //   },
    // });

    res.status(201).json({
      message: "Access request submitted successfully",
      request: {
        id: request._id,
        email: request.email,
        status: request.status,
      },
    });
  } catch (error) {
    next(error);
  }
};
