import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { prisma } from "@/lib/prisma";
export const publicSettingsRouter = Router();

// 1. Fetch public store settings by key
publicSettingsRouter.get(
  "/settings/:key",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.params;
      const setting = await prisma.storeSetting.findUnique({
        where: { key },
      });

      if (!setting) {
        return res.status(200).json({
          success: true,
          message: "ok",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "ok",
        data: setting.value,
      });
    } catch (error) {
      return next(error);
    }
  },
);

// 2. Fetch public categories
publicSettingsRouter.get(
  "/categories",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      return res.status(200).json({
        success: true,
        message: "ok",
        data: categories,
      });
    } catch (error) {
      return next(error);
    }
  },
);
