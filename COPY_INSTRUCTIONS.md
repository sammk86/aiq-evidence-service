# Copy Instructions for Evidence Service

This directory contains a complete, ready-to-use evidence service that can be copied to a new Git repository.

## Steps to Create New Repository

1. **Create a new GitHub repository**:
   - Name: `aiq-evidence-service`
   - Description: "Evidence management service for AI Maturity Assessment Platform"
   - Initialize with README: No (we have one already)

2. **Clone the new repository**:
   ```bash
   git clone https://github.com/{org}/aiq-evidence-service.git
   cd aiq-evidence-service
   ```

3. **Copy all files from this directory**:
   ```bash
   # From the aiq-app repository root
   cp -r _service-packages/aiq-evidence-service/* /path/to/aiq-evidence-service/
   ```

4. **Update TypeScript imports** (if needed):
   - Check for any imports of `@aiq-platform/shared-types`
   - Update to use local `shared/types` directory

5. **Initialize Git and commit**:
   ```bash
   cd /path/to/aiq-evidence-service
   git add .
   git commit -m "Initial commit: Evidence service"
   git push origin main
   ```

6. **Set up Docker Hub**:
   - Create repository: `{username}/aiq-evidence`
   - Configure GitHub Secrets:
     - `DOCKERHUB_USERNAME` - Your Docker Hub username
     - `DOCKERHUB_TOKEN` - Docker Hub access token

7. **Update k8s/deployment.yaml**:
   - Replace `{dockerhub-username}` with your Docker Hub username

8. **Test the setup**:
   ```bash
   # Build locally
   docker build -t aiq-evidence:test .
   
   # Run tests
   npm test
   ```

## File Structure

All files are ready to use:
- ✅ Source code (`src/`)
- ✅ Shared types (`shared/types/`)
- ✅ Prisma schema (`prisma/`)
- ✅ Dockerfile
- ✅ Package configuration (`package.json`, `tsconfig.json`)
- ✅ CI/CD workflow (`.github/workflows/ci-cd.yml`)
- ✅ README.md
- ✅ .env.example
- ✅ .gitignore
- ✅ Kubernetes manifests (`k8s/`)

## Next Steps

After copying:
1. Review and customize README.md if needed
2. Update any imports that reference shared types
3. Set up CI/CD secrets in GitHub
4. Create initial release tag: `git tag v1.0.0 && git push origin v1.0.0`

