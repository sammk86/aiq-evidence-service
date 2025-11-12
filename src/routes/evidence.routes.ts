import { Router, Request, Response } from 'express';
import { EvidenceService } from '../services/evidence.service';
import { upload } from '../middleware/upload.middleware';

const router = Router();
const evidenceService = new EvidenceService();

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = (req as any).user?.userId || req.body.userId || 'system';
    const { organizationId, assessmentId, questionId } = req.body;

    const evidence = await evidenceService.uploadFile(
      req.file,
      userId,
      organizationId,
      assessmentId,
      questionId,
    );

    res.status(201).json(evidence);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/assessments/:assessmentId', async (req: Request, res: Response) => {
  try {
    const { assessmentId } = req.params;
    const evidenceList = await evidenceService.getByAssessment(assessmentId);
    res.json(evidenceList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const evidence = await evidenceService.getEvidence(req.params.id);
    res.json(evidence);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/:id/download', async (req: Request, res: Response) => {
  try {
    const evidence = await evidenceService.getEvidence(req.params.id);
    const stream = await evidenceService.getFileStream(req.params.id);

    res.setHeader('Content-Type', evidence.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${evidence.originalName}"`);
    stream.pipe(res);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { metadata } = req.body;
    const evidence = await evidenceService.updateMetadata(req.params.id, metadata);
    res.json(evidence);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId || req.body.userId || 'system';
    const result = await evidenceService.deleteEvidence(req.params.id, userId);
    res.json(result);
  } catch (error: any) {
    res.status(403).json({ error: error.message });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { organizationId, assessmentId, questionId, uploadedBy } = req.query;
    const results = await evidenceService.searchEvidence({
      organizationId: organizationId as string,
      assessmentId: assessmentId as string,
      questionId: questionId as string,
      uploadedBy: uploadedBy as string,
    });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/questions/:questionId', async (req: Request, res: Response) => {
  try {
    const results = await evidenceService.searchEvidence({
      questionId: req.params.questionId,
    });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/link', async (req: Request, res: Response) => {
  try {
    const { questionId } = req.body;
    const evidence = await evidenceService.linkToQuestion(req.params.id, questionId);
    res.json(evidence);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

