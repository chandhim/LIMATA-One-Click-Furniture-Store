import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";

function sendResponse(res: Response, status: number, data: unknown) {
  return res.status(status).json({ success: true, message: "ok", data });
}

// 1. Overview Dashboard Stats & Analytics
export async function getAdminStatsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count({
      where: {
        NOT: {
          paymentMethod: "PAYHERE",
          paymentStatus: "PENDING",
        }
      }
    });
    const pendingOrders = await prisma.order.count({
      where: { 
        orderStatus: "PENDING",
        NOT: {
          paymentMethod: "PAYHERE",
          paymentStatus: "PENDING",
        }
      },
    });
    const totalCustomers = await prisma.user.count({
      where: { role: Role.CUSTOMER },
    });

    // Sum revenue for non-failed, paid, or processing/shipped/delivered orders
    const completedOrdersForRevenue = await prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
        orderStatus: { in: ["DELIVERED"] },
      },
      select: { totalAmount: true },
    });
    const totalRevenue = completedOrdersForRevenue.reduce(
      (sum, o) => sum + o.totalAmount,
      0,
    );

    // Recent 5 orders
    const recentOrders = await prisma.order.findMany({
      where: {
        NOT: {
          paymentMethod: "PAYHERE",
          paymentStatus: "PENDING",
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    // Low stock products (stock <= 5)
    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 10,
    });

    // Recent notifications/activity (e.g. last 10)
    const recentActivity = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Recent customer messages
    const recentMessages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        conversation: {
          select: { customerId: true },
        },
      },
    });

    // Calculate revenue for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7DaysOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        paymentStatus: "PAID",
        orderStatus: { in: ["DELIVERED"] },
        NOT: {
          paymentMethod: "PAYHERE",
          paymentStatus: "PENDING",
        }
      },
      select: { createdAt: true, totalAmount: true },
    });

    const dailyRevenue: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
      dailyRevenue[dateStr] = 0;
    }

    last7DaysOrders.forEach((o) => {
      const dateStr = new Date(o.createdAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
      if (dailyRevenue[dateStr] !== undefined) {
        dailyRevenue[dateStr] += o.totalAmount;
      }
    });

    const revenueChart = Object.entries(dailyRevenue).map(([date, amount]) => ({
      date,
      amount,
    }));

    return sendResponse(res, 200, {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      recentActivity,
      recentMessages,
      revenueChart,
    });
  } catch (error) {
    return next(error);
  }
}

// 2. User Management (Customers)
export async function listAdminUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const search = req.query.search ? String(req.query.search) : "";

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Remove passwords before sending
    const sanitizedUsers = users.map((u) => {
      const { password: _password, ...rest } = u;
      return rest;
    });

    return sendResponse(res, 200, sanitizedUsers);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminUserRoleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (role !== Role.ADMIN && role !== Role.CUSTOMER) {
      throw new ApiError(400, "Invalid role parameter");
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { role },
    });

    const { password: _password, ...rest } = updatedUser;
    return sendResponse(res, 200, rest);
  } catch (error) {
    return next(error);
  }
}

export async function toggleAdminUserStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "isActive must be a boolean");
    }

    const updatedUser = await prisma.user.update({
      where: { userId },
      data: { isActive },
    });

    const { password: _password, ...rest } = updatedUser;
    return sendResponse(res, 200, rest);
  } catch (error) {
    return next(error);
  }
}

// 3. Review Management
export async function listAdminReviewsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { productId: true, name: true, images: true } },
        user: { select: { userId: true, name: true, email: true } },
      },
    });

    return sendResponse(res, 200, reviews);
  } catch (error) {
    return next(error);
  }
}

export async function toggleReviewApprovalController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      throw new ApiError(400, "isApproved must be a boolean");
    }

    const updatedReview = await prisma.review.update({
      where: { reviewId },
      data: { isApproved },
    });

    return sendResponse(res, 200, updatedReview);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminReviewController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { reviewId } = req.params;

    await prisma.review.delete({
      where: { reviewId },
    });

    return sendResponse(res, 200, { reviewId });
  } catch (error) {
    return next(error);
  }
}

// 4. Categories Management
export async function listAdminCategoriesController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return sendResponse(res, 200, categories);
  } catch (error) {
    return next(error);
  }
}

export async function createAdminCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, desc, image, alt } = req.body;

    if (!name || !desc) {
      throw new ApiError(400, "Name and description are required");
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        desc: desc.trim(),
        image: image || null,
        alt: alt || null,
      },
    });

    return sendResponse(res, 201, category);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { categoryId } = req.params;
    const { name, desc, image, alt } = req.body;

    if (!name || !desc) {
      throw new ApiError(400, "Name and description are required");
    }

    const category = await prisma.category.update({
      where: { categoryId: categoryId },
      data: {
        name: name.trim(),
        desc: desc.trim(),
        image: image !== undefined ? image : undefined,
        alt: alt !== undefined ? alt : undefined,
      },
    });

    return sendResponse(res, 200, category);
  } catch (error) {
    return next(error);
  }
}

export async function deleteAdminCategoryController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { categoryId } = req.params;

    await prisma.category.delete({
      where: { categoryId },
    });

    return sendResponse(res, 200, { categoryId });
  } catch (error) {
    return next(error);
  }
}

// 5. CMS / Settings
export async function getAdminSettingsController(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const settings = await prisma.storeSetting.findMany();
    // Convert key-value array into object
    const settingsMap = settings.reduce<Record<string, unknown>>(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {},
    );

    return sendResponse(res, 200, settingsMap);
  } catch (error) {
    return next(error);
  }
}

export async function updateAdminSettingsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { key, value } = req.body;

    if (!key) {
      throw new ApiError(400, "Setting key is required");
    }

    const setting = await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return sendResponse(res, 200, setting);
  } catch (error) {
    return next(error);
  }
}
