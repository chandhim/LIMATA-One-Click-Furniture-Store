import { api } from "@/lib/axios";

export interface DeliveryConfiguration {
  id: string;
  method: "STANDARD" | "FAST_COURIER";
  thresholdAmount: number;
  belowThresholdCharge: number;
  aboveThresholdCharge: number;
}

export async function fetchDeliveryRates(): Promise<DeliveryConfiguration[]> {
  const { data } = await api.get<DeliveryConfiguration[]>("/delivery/rates");
  return data;
}

export async function updateDeliveryRates(configs: Partial<DeliveryConfiguration>[]): Promise<DeliveryConfiguration[]> {
  const { data } = await api.put<DeliveryConfiguration[]>("/delivery/rates", configs);
  return data;
}
