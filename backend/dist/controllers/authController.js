"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestAccess = exports.getCurrentUser = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = require("../utils/ApiError");
const AccessRequest_1 = __importDefault(require("../models/AccessRequest"));
// import { sendEmail } from "../utils/email";
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, companyName, companyWebsite, intendedUse } = req.body;
        // Check if user already exists
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            throw new ApiError_1.ApiError(400, "Email already registered");
        }
        // Create new user
        const user = yield User_1.default.create({
            email,
            password,
            companyName,
            companyWebsite,
            intendedUse,
        });
        // Generate token
        const token = generateToken(user ? user === null || user === void 0 ? void 0 : user._id : "");
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
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Get user with password
        const user = yield User_1.default.findOne({ email }).select("+password");
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            throw new ApiError_1.ApiError(401, "Invalid credentials");
        }
        // Generate token
        const token = generateToken(user ? user._id : "");
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
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user.userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
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
    }
    catch (error) {
        next(error);
    }
});
exports.getCurrentUser = getCurrentUser;
const requestAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, reason } = req.body;
        // Check if request already exists
        const existingRequest = yield AccessRequest_1.default.findOne({ email });
        if (existingRequest) {
            throw new ApiError_1.ApiError(400, "Access request already submitted");
        }
        // Create access request
        const request = yield AccessRequest_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
});
exports.requestAccess = requestAccess;
