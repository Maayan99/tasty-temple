import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  endpoint: `https://${process.env.B2_ENDPOINT}`,
  region: 'us-east-005', // Backblaze B2 uses this region
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToB2(buffer: Buffer, key: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'image/png',
  });

  await s3Client.send(command);

  return `https://${process.env.B2_BUCKET_NAME}.s3.us-east-005.backblazeb2.com/${key}`;
}

export async function deleteImageFromB2(imageUrl: string): Promise<void> {
  const key = imageUrl.split('/').pop();
  if (!key) {
    throw new Error('Invalid image URL');
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}
