import prisma from "../utils/prisma.js";
import asyncHandler from "express-async-handler";
import { logActivity } from "../utils/activity.js";

// @desc    Get all suppliers for business
// @route   GET /api/suppliers
// @access  Private
export const getSuppliers = asyncHandler(async (req, res) => {
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  const suppliers = await prisma.supplier.findMany({
    where: {
      businessId: businessProfile.id,
    },
    include: {
      products: true,
    },
  });

  res.json({
    suppliers,
    total: suppliers.length,
    currentPage: 1,
    totalPages: 1,
  });
});

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
export const getSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  const supplier = await prisma.supplier.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
    include: {
      products: true,
    },
  });

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  res.json(supplier);
});

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
export const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, email, phone } = req.body;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  const supplier = await prisma.supplier.create({
    data: {
      name,
      contactPerson,
      email,
      phone,
      businessId: businessProfile.id,
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "added",
    "supplier",
    supplier.id,
    `Added new supplier: ${name}`
  );

  res.status(201).json(supplier);
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, contactPerson, email, phone } = req.body;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  // Check if supplier exists and belongs to business
  const existingSupplier = await prisma.supplier.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
  });

  if (!existingSupplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  const supplier = await prisma.supplier.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      contactPerson,
      email,
      phone,
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "updated",
    "supplier",
    supplier.id,
    `Updated supplier: ${name || existingSupplier.name}`
  );

  res.json(supplier);
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
export const deleteSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  // Check if supplier exists and belongs to business
  const supplier = await prisma.supplier.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
    include: {
      products: true,
    },
  });

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  // Check if supplier has any products
  if (supplier.products.length > 0) {
    res.status(400);
    throw new Error("Cannot delete supplier with associated products");
  }

  await prisma.supplier.delete({
    where: {
      id: parseInt(id),
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "deleted",
    "supplier",
    parseInt(id),
    `Deleted supplier: ${supplier.name}`
  );

  res.json({ message: "Supplier deleted" });
});
