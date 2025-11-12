import * as MinIO from 'minio';
import * as dotenv from 'dotenv';

dotenv.config();

export const minioClient = new MinIO.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

export const EVIDENCE_BUCKET = process.env.MINIO_BUCKET_EVIDENCE || 'evidence';

// Ensure bucket exists
minioClient.bucketExists(EVIDENCE_BUCKET).then((exists) => {
  if (!exists) {
    minioClient.makeBucket(EVIDENCE_BUCKET, 'us-east-1').catch((err) => {
      console.error('Error creating bucket:', err);
    });
  }
});

