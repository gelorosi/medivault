import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import prisma from "../utils/prisma.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authorized to access this route");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists and get business profile
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        businessProfile: true
      }
    });

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    // Attach user and business profile to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(401, "Invalid token"));
    } else {
      next(error);
    }
  }
};