import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(envPath: string) {
  if (!existsSync(envPath)) {
    return;
  }

  const envFile = readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^"|"$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function loadProjectEnv() {
  const workspaceRootEnvPath = resolve(process.cwd(), "../../.env");
  const apiLocalEnvPath = resolve(process.cwd(), ".env");

  loadEnvFile(workspaceRootEnvPath);
  loadEnvFile(apiLocalEnvPath);
}