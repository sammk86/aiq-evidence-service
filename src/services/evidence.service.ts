import { PrismaClient } from '@prisma/client';
import { minioClient, EVIDENCE_BUCKET } from '../config/minio.config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const prisma = new PrismaClient();

export interface FileUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export class EvidenceService {
  async uploadFile(
    file: FileUpload,
    uploadedBy: string,
    organizationId?: string,
    assessmentId?: string,
    questionId?: string,
  ) {
    const fileId = uuidv4();
    const extension = path.extname(file.originalname);
    const objectKey = `${fileId}${extension}`;

    // Upload to MinIO
    await minioClient.putObject(EVIDENCE_BUCKET, objectKey, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    // Save metadata to database
    const evidence = await prisma.evidence.create({
      data: {
        id: fileId,
        fileName: objectKey,
        originalName: file.originalname,
        fileSize: BigInt(file.size),
        mimeType: file.mimetype,
        bucket: EVIDENCE_BUCKET,
        objectKey,
        uploadedBy,
        organizationId,
        assessmentId,
        questionId,
        metadata: {},
      },
    });

    return evidence;
  }

  async getEvidence(id: string) {
    const evidence = await prisma.evidence.findUnique({
      where: { id },
    });

    if (!evidence) {
      throw new Error('Evidence not found');
    }

    return evidence;
  }

  async getFileStream(id: string) {
    const evidence = await this.getEvidence(id);
    return minioClient.getObject(evidence.bucket, evidence.objectKey);
  }

  async updateMetadata(id: string, metadata: any) {
    return prisma.evidence.update({
      where: { id },
      data: { metadata },
    });
  }

  async deleteEvidence(id: string, userId: string) {
    const evidence = await this.getEvidence(id);

    // Check permissions
    if (evidence.uploadedBy !== userId) {
      throw new Error('Unauthorized: Only uploader can delete evidence');
    }

    // Delete from MinIO
    await minioClient.removeObject(evidence.bucket, evidence.objectKey);

    // Delete from database
    await prisma.evidence.delete({
      where: { id },
    });

    return { success: true };
  }

  async searchEvidence(filters: {
    organizationId?: string;
    assessmentId?: string;
    questionId?: string;
    uploadedBy?: string;
  }) {
    return prisma.evidence.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async linkToQuestion(evidenceId: string, questionId: string) {
    return prisma.evidence.update({
      where: { id: evidenceId },
      data: { questionId },
    });
  }

  async getByAssessment(assessmentId: string) {
    return prisma.evidence.findMany({
      where: { assessmentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

