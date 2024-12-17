import prisma from "./prisma.js";

export const logActivity = async (
  businessId,
  action,
  entityType,
  entityId,
  details
) => {
  try {
    await prisma.activity.create({
      data: {
        businessId,
        action,
        entityType,
        entityId,
        details,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw - we don't want activity logging to break the main flow
  }
};
