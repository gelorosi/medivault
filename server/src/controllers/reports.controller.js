import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const isExpiringSoon = (expiryDate) => {
  const expiryTime = new Date(expiryDate).getTime();
  const now = new Date().getTime();
  return expiryTime - now < 1000 * 60 * 60 * 24 * 30; // 30 days
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const { businessProfile } = req.user;
    if (!businessProfile) {
      throw new ApiError(400, "Business profile not found");
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

    const formattedProducts = products.map((product) => ({
      ...product,
      id: Number(product.id),
    }));

    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

export const getInventoryStatus = async (req, res, next) => {
  try {
    const { businessProfile } = req.user;
    if (!businessProfile) {
      throw new ApiError(400, "Business profile not found");
    }

    const products = await prisma.product.findMany({
      where: {
        businessId: businessProfile.id,
      },
      include: {
        supplier: true,
      },
    });

    const lowStock = products.filter(
      (product) => product.quantity <= product.minStockLevel
    );

    const expiringProducts = products.filter((product) =>
      isExpiringSoon(product.expiryDate)
    );

    const suppliersCount = await prisma.supplier.count({
      where: {
        businessId: businessProfile.id,
      },
    });

    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, product) => sum + product.price.toNumber() * product.quantity,
      0
    );

    res.json({
      totalProducts,
      totalValue,
      lowStockCount: lowStock.length,
      totalSuppliers: suppliersCount,
      expiringCount: expiringProducts.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpiringProducts = async (req, res, next) => {
  try {
    const { businessProfile } = req.user;
    if (!businessProfile) {
      throw new ApiError(400, "Business profile not found");
    }

    const products = await prisma.product.findMany({
      where: {
        businessId: businessProfile.id,
      },
      include: {
        supplier: true,
      },
      orderBy: {
        expiryDate: "asc",
      },
    });

    // Filter and format expiring products
    const formattedProducts = products
      .filter((product) => isExpiringSoon(product.expiryDate))
      .map((product) => {
        const expiryDate = new Date(product.expiryDate);
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
          ...product,
          id: Number(product.id),
          daysUntilExpiry,
        };
      });

    res.json(formattedProducts);
  } catch (error) {
    next(error);
  }
};

// New endpoint for recent activities
export const getRecentActivities = async (req, res, next) => {
  try {
    const { businessProfile } = req.user;
    if (!businessProfile) {
      throw new ApiError(400, "Business profile not found");
    }

    const activities = await prisma.activity.findMany({
      where: {
        businessId: businessProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit to 5 most recent activities
    });

    res.json(activities);
  } catch (error) {
    next(error);
  }
};
