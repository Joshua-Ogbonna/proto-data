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
exports.deleteDatasetRequest = exports.updateDatasetRequestStatus = exports.getDatasetRequestById = exports.getDatasetRequests = exports.createDatasetRequest = void 0;
const DatasetRequest_1 = __importDefault(require("../models/DatasetRequest"));
const ApiError_1 = require("../utils/ApiError");
// import { sendEmail } from "../utils/email";
const createDatasetRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const requestData = Object.assign(Object.assign({}, req.body), { userId });
        const request = yield DatasetRequest_1.default.create(requestData);
        // Send confirmation emails
        // await sendEmail({
        //   to: req.body.email,
        //   subject: "Dataset Request Received",
        //   template: "datasetRequestConfirmation",
        //   data: { request },
        // });
        // await sendEmail({
        //   to: process.env.ADMIN_EMAIL!,
        //   subject: "New Dataset Request",
        //   template: "newDatasetRequestNotification",
        //   data: { request },
        // });
        res.status(201).json(request);
    }
    catch (error) {
        next(error);
    }
});
exports.createDatasetRequest = createDatasetRequest;
const getDatasetRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === "user";
        const query = isAdmin ? {} : { userId };
        const requests = yield DatasetRequest_1.default.find(query).sort({ createdAt: -1 });
        res.json(requests);
    }
    catch (error) {
        next(error);
    }
});
exports.getDatasetRequests = getDatasetRequests;
const getDatasetRequestById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const userId = req.user.userId;
        const isAdmin = req.user.role === "admin";
        const request = yield DatasetRequest_1.default.findById(requestId);
        if (!request) {
            throw new ApiError_1.ApiError(404, "Dataset request not found");
        }
        // Check if user has permission to view this request
        if (!isAdmin && request.userId !== userId) {
            throw new ApiError_1.ApiError(403, "Not authorized to view this request");
        }
        res.json(request);
    }
    catch (error) {
        next(error);
    }
});
exports.getDatasetRequestById = getDatasetRequestById;
const updateDatasetRequestStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const request = yield DatasetRequest_1.default.findByIdAndUpdate(requestId, { status }, { new: true });
        if (!request) {
            throw new ApiError_1.ApiError(404, "Dataset request not found");
        }
        // Send status update email to user
        // await sendEmail({
        //   to: request.email,
        //   subject: "Dataset Request Status Update",
        //   template: "datasetRequestStatusUpdate",
        //   data: { request },
        // });
        res.json(request);
    }
    catch (error) {
        next(error);
    }
});
exports.updateDatasetRequestStatus = updateDatasetRequestStatus;
const deleteDatasetRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const request = yield DatasetRequest_1.default.findByIdAndDelete(requestId);
        if (!request) {
            throw new ApiError_1.ApiError(404, "Dataset request not found");
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteDatasetRequest = deleteDatasetRequest;
