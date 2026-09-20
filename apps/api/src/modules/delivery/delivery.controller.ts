import { Request, Response } from "express";
import { deliveryService } from "./delivery.service";

export const getDeliveryConfigurations = async (req: Request, res: Response) => {
  try {
    const configs = await deliveryService.getConfigurations();
    res.json(configs);
  } catch (error) {
    console.error("Error fetching delivery configurations:", error);
    res.status(500).json({ error: "Failed to fetch delivery configurations" });
  }
};

export const updateDeliveryConfigurations = async (req: Request, res: Response) => {
  try {
    const configs = req.body;
    
    if (!Array.isArray(configs)) {
      return res.status(400).json({ error: "Invalid payload, expected array of configurations" });
    }

    const updatedConfigs = await deliveryService.updateConfigurations(configs);
    res.json(updatedConfigs);
  } catch (error) {
    console.error("Error updating delivery configurations:", error);
    res.status(500).json({ error: "Failed to update delivery configurations" });
  }
};
