export type ServiceStatus = "ok" | "error";

export type HealthResponse = {
  status: ServiceStatus;
  service: string;
};
