import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error("Error:", err);

  // If it's our ApiError, use its status and message
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle Prisma-specific errors
  if (err?.name === "PrismaClientKnownRequestError") {
    // P2002 is Prisma's unique constraint violation error
    if (err.code === "P2002") {
      return res.status(400).json({
        status: "error",
        message: "A record with this value already exists",
      });
    }
    // P2025 is Prisma's not found error
    if (err.code === "P2025") {
      return res.status(404).json({
        status: "error",
        message: "Record not found",
      });
    }
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expired",
    });
  }

  // Default error response for unhandled errors
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
