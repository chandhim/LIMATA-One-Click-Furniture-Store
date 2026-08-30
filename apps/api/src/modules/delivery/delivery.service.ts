import { PrismaClient, DeliveryMethodEnum, DeliveryConfiguration } from "@prisma/client";

const prisma = new PrismaClient();

export class DeliveryService {
  /**
   * Retrieves all delivery configurations.
   */
  async getConfigurations(): Promise<DeliveryConfiguration[]> {
    return prisma.deliveryConfiguration.findMany();
  }

  /**
   * Calculates the delivery charge based on the method and subtotal.
   */
  async calculateCharge(method: DeliveryMethodEnum, subtotal: number): Promise<number> {
    const config = await prisma.deliveryConfiguration.findUnique({
      where: { method },
    });

    if (!config) {
      throw new Error(`Delivery configuration for method ${method} not found.`);
    }

    return subtotal >= config.thresholdAmount 
      ? config.aboveThresholdCharge 
      : config.belowThresholdCharge;
  }

  /**
   * Updates delivery configurations (Admin only)
   */
  async updateConfigurations(configs: Partial<DeliveryConfiguration>[]) {
    return prisma.$transaction(
      configs.map((config) => {
        if (!config.method) throw new Error("Method is required to update delivery configuration");
        return prisma.deliveryConfiguration.upsert({
          where: { method: config.method },
          update: {
            thresholdAmount: config.thresholdAmount,
            belowThresholdCharge: config.belowThresholdCharge,
            aboveThresholdCharge: config.aboveThresholdCharge,
          },
          create: {
            method: config.method,
            thresholdAmount: config.thresholdAmount ?? 15000,
            belowThresholdCharge: config.belowThresholdCharge ?? 0,
            aboveThresholdCharge: config.aboveThresholdCharge ?? 0,
          },
        });
      })
    );
  }
}

export const deliveryService = new DeliveryService();
