import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import evidenceRoutes from './routes/evidence.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'evidence-service',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/evidence', evidenceRoutes);

app.listen(port, () => {
  console.log(`🚀 Evidence Service running on: http://localhost:${port}`);
});

