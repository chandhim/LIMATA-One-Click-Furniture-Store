import { mkdir, writeFile, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ENDPOINT}`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
      },
    });
  }
  return s3Client;
}

function getApiBaseUrl() {
  const publicUrl = process.env.API_PUBLIC_URL || process.env.RENDER_EXTERNAL_URL;
  return (publicUrl ?? `http://localhost:${process.env.API_PORT ?? 4000}`).replace(/\/$/, "");
}

async function uploadLocally(key: string, buffer: Buffer) {
  const filePath = resolve(process.cwd(), "uploads", key);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  return `${getApiBaseUrl()}/uploads/${key.replace(/\\/g, "/")}`;
}

export async function uploadToR2(key: string, buffer: Buffer, contentType: string): Promise<string> {
  if (process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME) {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await getS3Client().send(command);

      return `${process.env.R2_PUBLIC_URL}/${key}`;
    } catch (error) {
      console.warn("[Storage] R2 upload failed, falling back to local storage:", error);
    }
  }

  return uploadLocally(key, buffer);
}

export async function deleteFromR2(url: string) {
  if (!url) return;
  
  if (process.env.R2_PUBLIC_URL && url.startsWith(process.env.R2_PUBLIC_URL)) {
    try {
      const key = url.replace(`${process.env.R2_PUBLIC_URL}/`, "");
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      });
      await getS3Client().send(command);
    } catch (error) {
      console.error("[Storage] R2 delete failed:", error);
    }
  } else if (url.includes("/uploads/")) {
    try {
      const key = url.split("/uploads/")[1];
      if (key) {
        const filePath = resolve(process.cwd(), "uploads", key);
        await unlink(filePath).catch(() => {});
      }
    } catch (error) {
      console.error("[Storage] Local delete failed:", error);
    }
  }
}

export function makeKey(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^\w.-]/g, "_");
  return `${prefix}/${timestamp}_${sanitized}`;
}
