import asyncHandler from "express-async-handler";
import prisma from "../utils/prisma.js";

// Check if user has completed business profile setup
export const checkBusinessSetup = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const businessProfile = await prisma.businessProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  // Attach profile status to request
  req.hasBusinessProfile = !!businessProfile;
  next();
});

// Require completed business profile
export const requireBusinessProfile = asyncHandler(async (req, res, next) => {
  if (!req.hasBusinessProfile) {
    res.status(403);
    throw new Error("Business profile setup required");
  }
  next();
});
