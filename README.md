# AIQ Evidence Service

Evidence management service that handles file uploads, storage, and retrieval for assessment evidence using MinIO object storage.

## Overview

The Evidence Service manages evidence files associated with assessment responses. It provides file upload, download, and management capabilities using MinIO for object storage and PostgreSQL for metadata.

## Features

- **File Upload**: Upload evidence files with metadata
- **File Storage**: Store files in MinIO object storage
- **File Retrieval**: Download and retrieve evidence files
- **Metadata Management**: Track evidence metadata in PostgreSQL
- **REST API**: Simple REST API for evidence operations

## Repository Structure

```
aiq-evidence-service/
├── src/
│   ├── config/           # Configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── types/            # TypeScript types
│   └── server.ts         # Express application
├── prisma/               # Prisma schema
├── shared/               # Shared TypeScript types
│   └── types/
├── k8s/                 # Kubernetes manifests
├── Dockerfile            # Docker build file
├── package.json          # Node.js dependencies
├── tsconfig.json        # TypeScript configuration
├── .env.example         # Environment template
└── README.md            # This file
```

## Prerequisites

- Node.js 22+
- PostgreSQL database
- MinIO object storage
- Docker & Docker Compose (for containerized deployment)

## Local Development

### Using Docker

```bash
# Build image
docker build -t aiq-evidence:local .

# Run container
docker run -p 3003:3003 --env-file .env aiq-evidence:local
```

### Running Locally

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run in development mode
npm run start:dev

# Run tests
npm test
```

## Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `MINIO_ENDPOINT` - MinIO server endpoint
- `MINIO_PORT` - MinIO server port
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key
- `MINIO_BUCKET_EVIDENCE` - MinIO bucket name for evidence
- `MINIO_USE_SSL` - Use SSL for MinIO (true/false)
- `PORT` - Service port (default: 3003)
- `FRONTEND_URL` - Frontend URL for CORS

## API Documentation

- **Health Check**: `GET /health`
- **Upload Evidence**: `POST /api/v1/evidence`
- **Get Evidence**: `GET /api/v1/evidence/{id}`
- **Download Evidence**: `GET /api/v1/evidence/{id}/download`

## Docker Hub

Images are automatically built and pushed to Docker Hub on:
- Push to `main` branch → `latest` tag
- Git tags (e.g., `v1.0.0`) → version tags

### Manual Build and Push

```bash
# Build
docker build -t {dockerhub-username}/aiq-evidence:{version} .

# Push
docker push {dockerhub-username}/aiq-evidence:{version}
docker push {dockerhub-username}/aiq-evidence:latest
```

## CI/CD

GitHub Actions automatically:
1. Runs tests on PRs
2. Builds Docker image on push to main
3. Publishes to Docker Hub with appropriate tags

Configure GitHub Secrets:
- `DOCKERHUB_USERNAME` - Your Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token

## Database

- **PostgreSQL**: Stores evidence metadata
- **MinIO**: Stores evidence files

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:cov
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Submit a pull request

## Versioning

This service follows [Semantic Versioning](https://semver.org/).

## License

PROPRIETARY

