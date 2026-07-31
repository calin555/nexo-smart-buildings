CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "ProjectDocumentType" AS ENUM ('PLAN', 'OTHER');
CREATE TYPE "ProcessingStatus" AS ENUM ('UPLOADED', 'QUEUED', 'PROCESSING', 'NEEDS_REVIEW', 'COMPLETED', 'FAILED');
CREATE TYPE "AnalysisStatus" AS ENUM ('QUEUED', 'PROCESSING', 'NEEDS_REVIEW', 'COMPLETED', 'FAILED');
CREATE TYPE "RoomType" AS ENUM ('LIVING', 'BEDROOM', 'KITCHEN', 'BATHROOM', 'HALL', 'DRESSING', 'OFFICE', 'TECHNICAL_ROOM', 'GARAGE', 'TERRACE', 'BALCONY', 'COMMERCIAL_SPACE', 'HOTEL_ROOM', 'OTHER');
CREATE TYPE "RoomDetectionStatus" AS ENUM ('DETECTED', 'CONFIRMED', 'MODIFIED', 'REJECTED', 'MANUAL');
CREATE TYPE "RoomSource" AS ENUM ('AI', 'MANUAL');
CREATE TYPE "GeometryType" AS ENUM ('POLYGON', 'RECTANGLE');
CREATE TYPE "RoomFeatureCategory" AS ENUM ('LIGHTING', 'SHADING', 'HEATING', 'COOLING_VENTILATION', 'SECURITY', 'ACCESS', 'MULTIMEDIA', 'ENERGY');
CREATE TYPE "AnalysisJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'NEEDS_REVIEW', 'COMPLETED', 'FAILED');
CREATE TYPE "AnalysisIssueSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR');

CREATE TABLE "projects" (
  "id" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "createdById" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "project_documents" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "uploadedById" UUID NOT NULL,
  "storagePath" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "documentType" "ProjectDocumentType" NOT NULL DEFAULT 'PLAN',
  "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'UPLOADED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "project_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "project_document_pages" (
  "id" UUID NOT NULL,
  "documentId" UUID NOT NULL,
  "pageNumber" INTEGER NOT NULL,
  "previewStoragePath" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_document_pages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plan_analyses" (
  "id" UUID NOT NULL,
  "documentId" UUID NOT NULL,
  "provider" TEXT NOT NULL,
  "modelVersion" TEXT NOT NULL,
  "status" "AnalysisStatus" NOT NULL DEFAULT 'QUEUED',
  "rawResult" JSONB,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "plan_analyses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "project_rooms" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "documentPageId" UUID NOT NULL,
  "organizationId" UUID NOT NULL,
  "createdById" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "roomType" "RoomType" NOT NULL DEFAULT 'OTHER',
  "detectedName" TEXT,
  "area" DECIMAL(10,2),
  "detectedArea" DECIMAL(10,2),
  "confidence" DOUBLE PRECISION,
  "detectionStatus" "RoomDetectionStatus" NOT NULL DEFAULT 'MANUAL',
  "source" "RoomSource" NOT NULL DEFAULT 'MANUAL',
  "level" TEXT,
  "notes" TEXT,
  "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "project_rooms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "project_room_geometries" (
  "id" UUID NOT NULL,
  "roomId" UUID NOT NULL,
  "geometryType" "GeometryType" NOT NULL DEFAULT 'POLYGON',
  "normalizedPoints" JSONB NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "project_room_geometries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "room_features" (
  "id" UUID NOT NULL,
  "roomId" UUID NOT NULL,
  "category" "RoomFeatureCategory" NOT NULL,
  "featureCode" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "parameters" JSONB,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "room_features_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "room_feature_values" (
  "id" UUID NOT NULL,
  "featureId" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "room_feature_values_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analysis_jobs" (
  "id" UUID NOT NULL,
  "documentId" UUID NOT NULL,
  "status" "AnalysisJobStatus" NOT NULL DEFAULT 'QUEUED',
  "progress" INTEGER NOT NULL DEFAULT 0,
  "provider" TEXT NOT NULL,
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "errorCode" TEXT,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "analysis_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "analysis_issues" (
  "id" UUID NOT NULL,
  "jobId" UUID NOT NULL,
  "severity" "AnalysisIssueSeverity" NOT NULL DEFAULT 'WARNING',
  "code" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "analysis_issues_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "project_documents_storagePath_key" ON "project_documents"("storagePath");
CREATE INDEX "projects_organizationId_updatedAt_idx" ON "projects"("organizationId", "updatedAt");
CREATE INDEX "project_documents_projectId_createdAt_idx" ON "project_documents"("projectId", "createdAt");
CREATE INDEX "project_documents_organizationId_idx" ON "project_documents"("organizationId");
CREATE UNIQUE INDEX "project_document_pages_documentId_pageNumber_key" ON "project_document_pages"("documentId", "pageNumber");
CREATE INDEX "plan_analyses_documentId_createdAt_idx" ON "plan_analyses"("documentId", "createdAt");
CREATE INDEX "project_rooms_projectId_documentPageId_idx" ON "project_rooms"("projectId", "documentPageId");
CREATE INDEX "project_rooms_organizationId_idx" ON "project_rooms"("organizationId");
CREATE INDEX "project_room_geometries_roomId_version_idx" ON "project_room_geometries"("roomId", "version");
CREATE UNIQUE INDEX "room_features_roomId_featureCode_key" ON "room_features"("roomId", "featureCode");
CREATE INDEX "room_features_roomId_category_idx" ON "room_features"("roomId", "category");
CREATE UNIQUE INDEX "room_feature_values_featureId_code_key" ON "room_feature_values"("featureId", "code");
CREATE INDEX "analysis_jobs_documentId_status_idx" ON "analysis_jobs"("documentId", "status");
CREATE INDEX "analysis_issues_jobId_severity_idx" ON "analysis_issues"("jobId", "severity");

ALTER TABLE "projects" ADD CONSTRAINT "projects_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "projects" ADD CONSTRAINT "projects_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "project_document_pages" ADD CONSTRAINT "project_document_pages_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "project_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "plan_analyses" ADD CONSTRAINT "plan_analyses_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "project_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_rooms" ADD CONSTRAINT "project_rooms_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_rooms" ADD CONSTRAINT "project_rooms_documentPageId_fkey" FOREIGN KEY ("documentPageId") REFERENCES "project_document_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_rooms" ADD CONSTRAINT "project_rooms_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_rooms" ADD CONSTRAINT "project_rooms_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "project_room_geometries" ADD CONSTRAINT "project_room_geometries_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "project_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "room_features" ADD CONSTRAINT "room_features_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "project_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "room_feature_values" ADD CONSTRAINT "room_feature_values_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "room_features"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analysis_jobs" ADD CONSTRAINT "analysis_jobs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "project_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "analysis_issues" ADD CONSTRAINT "analysis_issues_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "analysis_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
