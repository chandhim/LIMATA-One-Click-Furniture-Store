import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryRates } from "../services/delivery.service";

export const DELIVERY_RATES_QUERY_KEY = ["delivery-rates"];

export function useDeliveryRates() {
  return useQuery({
    queryKey: DELIVERY_RATES_QUERY_KEY,
    queryFn: fetchDeliveryRates,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
