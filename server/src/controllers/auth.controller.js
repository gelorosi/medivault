import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, "Email already registered.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        businessProfile: true,
      },
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        businessProfile: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials.");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials.");
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // Changed from userId to id based on our middleware
      select: {
        id: true,
        email: true,
        createdAt: true,
        businessProfile: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Optional: Add password change functionality
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // Changed from userId to id
    });

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect.");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id }, // Changed from userId to id
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};