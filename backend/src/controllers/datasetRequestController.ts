import { Request, Response, NextFunction } from "express";
import DatasetRequest from "../models/DatasetRequest";
import { ApiError } from "../utils/ApiError";
// import { sendEmail } from "../utils/email";

export const createDatasetRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const requestData = {
      ...req.body,
      userId,
    };

    const request = await DatasetRequest.create(requestData);

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
  } catch (error) {
    next(error);
  }
};

export const getDatasetRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === "user";

    const query = isAdmin ? {} : { userId };
    const requests = await DatasetRequest.find(query).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const getDatasetRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.userId;
    const isAdmin = req.user.role === "admin";

    const request = await DatasetRequest.findById(requestId);
    if (!request) {
      throw new ApiError(404, "Dataset request not found");
    }

    // Check if user has permission to view this request
    if (!isAdmin && request.userId !== userId) {
      throw new ApiError(403, "Not authorized to view this request");
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};

export const updateDatasetRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await DatasetRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      throw new ApiError(404, "Dataset request not found");
    }

    // Send status update email to user
    // await sendEmail({
    //   to: request.email,
    //   subject: "Dataset Request Status Update",
    //   template: "datasetRequestStatusUpdate",
    //   data: { request },
    // });

    res.json(request);
  } catch (error) {
    next(error);
  }
};

export const deleteDatasetRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId } = req.params;

    const request = await DatasetRequest.findByIdAndDelete(requestId);
    if (!request) {
      throw new ApiError(404, "Dataset request not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
