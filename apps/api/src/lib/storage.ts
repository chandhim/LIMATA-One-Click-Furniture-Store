import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ENDPOINT}`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(key: string, buffer: Buffer, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export function makeKey(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^\w.-]/g, "_");
  return `${prefix}/${timestamp}_${sanitized}`;
}
