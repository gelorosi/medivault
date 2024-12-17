import prisma from "../utils/prisma.js";
import asyncHandler from "express-async-handler";

// Validation helper
const validateBusinessData = (data) => {
  const { name, email, phoneNumber } = data;
  const errors = [];

  // Business name validation
  if (!name) {
    errors.push("Business name is required");
  } else if (name.length < 2 || name.length > 100) {
    errors.push("Business name must be between 2 and 100 characters");
  }

  // Email validation
  if (!email) {
    errors.push("Business email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  // Phone number validation (optional)
  if (phoneNumber) {
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      errors.push("Invalid phone number format");
    }
  }

  return errors;
};

// @desc    Create business profile
// @route   POST /api/business
// @access  Private
export const createBusinessProfile = asyncHandler(async (req, res) => {
  const { name, address, email, phoneNumber } = req.body;
  const userId = req.user.id;

  // Validate input
  const validationErrors = validateBusinessData(req.body);
  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(validationErrors.join(", "));
  }

  // Check if business profile already exists for user
  const existingProfile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    res.status(400);
    throw new Error("Business profile already exists for this user");
  }

  const businessProfile = await prisma.businessProfile.create({
    data: {
      name,
      address,
      email,
      phoneNumber,
      userId,
    },
  });

  // Update the user in the request
  req.user.businessProfile = businessProfile;

  res.status(201).json(businessProfile);
});

// @desc    Get business profile
// @route   GET /api/business
// @access  Private
export const getBusinessProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const businessProfile = await prisma.businessProfile.findUnique({
    where: { userId },
    include: {
      products: {
        include: {
          supplier: true,
        },
      },
      suppliers: {
        include: {
          products: true,
        },
      },
    },
  });

  if (!businessProfile) {
    res.status(404);
    throw new Error("Business profile not found");
  }

  res.json(businessProfile);
});

// @desc    Update business profile
// @route   PUT /api/business
// @access  Private
export const updateBusinessProfile = asyncHandler(async (req, res) => {
  const { name, address, email, phoneNumber } = req.body;
  const userId = req.user.id;

  // Validate input
  const validationErrors = validateBusinessData(req.body);
  if (validationErrors.length > 0) {
    res.status(400);
    throw new Error(validationErrors.join(", "));
  }

  // Check if profile exists
  const existingProfile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    res.status(404);
    throw new Error("Business profile not found");
  }

  const updatedProfile = await prisma.businessProfile.update({
    where: { userId },
    data: {
      name,
      address,
      email,
      phoneNumber,
    },
  });

  res.json(updatedProfile);
});

// @desc    Check business profile setup status
// @route   GET /api/business/status
// @access  Private
export const checkProfileStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const businessProfile = await prisma.businessProfile.findUnique({
    where: { userId },
    include: {
      products: {
        select: { id: true },
      },
      suppliers: {
        select: { id: true },
      },
    },
  });

  res.json({
    isSetup: !!businessProfile,
    profile: businessProfile,
    stats: businessProfile
      ? {
          totalProducts: businessProfile.products.length,
          totalSuppliers: businessProfile.suppliers.length,
        }
      : null,
  });
});
