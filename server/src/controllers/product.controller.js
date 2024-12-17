import prisma from "../utils/prisma.js";
import asyncHandler from "express-async-handler";
import { logActivity } from "../utils/activity.js";

// @desc    Get all products for business
// @route   GET /api/products
// @access  Private
export const getProducts = asyncHandler(async (req, res) => {
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  const products = await prisma.product.findMany({
    where: {
      businessId: businessProfile.id,
    },
    include: {
      supplier: true,
    },
  });

  res.json({
    products,
    total: products.length,
    currentPage: 1,
    totalPages: 1,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
    include: {
      supplier: true,
    },
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    quantity,
    minStockLevel,
    price,
    expiryDate,
    description,
    supplierId,
  } = req.body;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  // Verify supplier belongs to business
  const supplier = await prisma.supplier.findFirst({
    where: {
      id: parseInt(supplierId),
      businessId: businessProfile.id,
    },
  });

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found or doesn't belong to your business");
  }

  const product = await prisma.product.create({
    data: {
      name,
      sku,
      category,
      quantity: parseInt(quantity),
      minStockLevel: parseInt(minStockLevel),
      price: parseFloat(price),
      expiryDate: new Date(expiryDate),
      description,
      supplierId: parseInt(supplierId),
      businessId: businessProfile.id,
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "added",
    "product",
    product.id,
    `Added new product: ${name}`
  );

  res.status(201).json(product);
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    sku,
    category,
    quantity,
    minStockLevel,
    price,
    expiryDate,
    description,
    supplierId,
  } = req.body;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  // Check if product exists and belongs to business
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
  });

  if (!existingProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  // If supplier is being updated, verify it belongs to business
  if (supplierId) {
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: parseInt(supplierId),
        businessId: businessProfile.id,
      },
    });

    if (!supplier) {
      res.status(404);
      throw new Error("Supplier not found or doesn't belong to your business");
    }
  }

  const product = await prisma.product.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name,
      sku,
      category,
      quantity: quantity ? parseInt(quantity) : undefined,
      minStockLevel: minStockLevel ? parseInt(minStockLevel) : undefined,
      price: price ? parseFloat(price) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      description,
      supplierId: supplierId ? parseInt(supplierId) : undefined,
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "updated",
    "product",
    product.id,
    `Updated product: ${name || existingProduct.name}`
  );

  res.json(product);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  // Check if product exists and belongs to business
  const product = await prisma.product.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await prisma.product.delete({
    where: {
      id: parseInt(id),
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "deleted",
    "product",
    parseInt(id),
    `Deleted product: ${product.name}`
  );

  res.json({ message: "Product deleted" });
});

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  const products = await prisma.product.findMany({
    where: {
      businessId: businessProfile.id,
      quantity: {
        lte: prisma.product.fields.minStockLevel,
      },
    },
    include: {
      supplier: true,
    },
  });

  res.json(products);
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private
export const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const { businessProfile } = req.user;

  if (!businessProfile) {
    res.status(400);
    throw new Error("Business profile not found");
  }

  // Check if product exists and belongs to business
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: parseInt(id),
      businessId: businessProfile.id,
    },
  });

  if (!existingProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  const product = await prisma.product.update({
    where: {
      id: parseInt(id),
    },
    data: {
      quantity: parseInt(quantity),
    },
  });

  // Log activity
  await logActivity(
    businessProfile.id,
    "updated",
    "product",
    product.id,
    `Updated stock level for ${product.name} to ${quantity}`
  );

  res.json(product);
});
