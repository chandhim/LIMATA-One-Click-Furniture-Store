export function getApiBaseUrl(): string {
  // Try NEXT_PUBLIC_API_BASE_URL first
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");
  }

  // Fallback to older NEXT_PUBLIC_API_URL and strip any /api path
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(
      /\/api(\/v\d+)?\/?$/,
      "",
    ).replace(/\/$/, "");
  }

  // Local development fallback
  return "http://localhost:4000";
}

export function getAiApiBaseUrl(): string | undefined {
  if (process.env.NEXT_PUBLIC_AI_API_URL) {
    return process.env.NEXT_PUBLIC_AI_API_URL.replace(/\/$/, "");
  }
  return undefined;
}
