# Build Management API Documentation

## Overview

The Build Management API handles build artifact operations for release management, including:
- **CI/CD artifact uploads** - Automated builds from CI pipelines
- **Manual uploads** - Direct artifact uploads
- **AAB distribution** - Auto-upload to Play Store internal track
- **TestFlight verification** - Verify iOS builds in App Store Connect

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Endpoints](#api-endpoints)
3. [CI/CD Artifact Upload](#1-cicd-artifact-upload)
4. [Manual Build Upload](#2-manual-build-upload)
5. [List Build Artifacts](#3-list-build-artifacts)
6. [TestFlight Verification](#4-testflight-verification)
7. [AAB Build Flow](#aab-build-flow)
8. [Error Handling](#error-handling)
9. [Database Schema](#database-schema)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Build Artifact Service                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   CI/CD      │    │   Manual     │    │  TestFlight          │  │
│  │   Upload     │    │   Upload     │    │  Verification        │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┬───────────┘  │
│         │                   │                       │               │
│         ▼                   ▼                       ▼               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      S3 Storage                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                   │                                       │
│         ▼                   ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │               AAB Detection & Processing                     │   │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐   │   │
│  │  │ Extract Version │  │ Store Distribution Service      │   │   │
│  │  │ from AAB        │  │ (Upload to Internal Track)      │   │   │
│  │  └─────────────────┘  └─────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                                                           │
│         ▼                                                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Builds Database                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/builds/ci/artifact` | Upload artifact for CI/CD build |
| `POST` | `/tenants/:tenantId/releases/:releaseId/builds/manual-upload` | Create manual build with artifact |
| `GET` | `/tenants/:tenantId/releases/:releaseId/builds/artifacts` | List build artifacts |
| `POST` | `/builds/:buildId/testflight/verify` | Verify TestFlight build number |

---

## 1. CI/CD Artifact Upload

Upload an artifact for an existing build created by CI/CD pipeline.

### Endpoint

```
POST /builds/ci/artifact
```

### Request

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ciRunId` | string | Yes | CI run identifier - can be a URL (e.g., `https://jenkins.example.com/job/Release/1042/`) |
| `artifact` | file | Yes | Build artifact file (.apk, .aab, .ipa) |
| `buildNumber` | string | No | Build number / versionCode from Play Store (for AAB builds) |

> **Note:** 
> - `ciRunId` is passed in the request body (not URL path) because it can be a full URL containing special characters like `/`.
> - For AAB builds, when `buildNumber` is provided, the system generates `internalTrackLink` automatically using:
>   `https://play.google.com/apps/test/{packageName}/{versionCode}`
> - `packageName` is fetched from `store_integrations` table based on tenant's Play Store integration.

### Scenarios

#### Scenario 1: APK/IPA Upload (Non-AAB)

```bash
curl -X POST /builds/ci/artifact \
  -F "ciRunId=https://fe-jenkins-production.d11tech.in/job/Release-D11/job/AndroidPlayStoreRelease-Flip/1042/" \
  -F "artifact=@app-release.apk"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.amazonaws.com/bucket/...",
    "s3Uri": "s3://bucket/tenant/release/android/1.0.0/app-release.apk",
    "buildId": "abc123"
  }
}
```

#### Scenario 2: AAB Upload (CI did NOT upload to Play Store)

CI sends only the AAB file. System will:
1. Upload to S3
2. Upload to Play Store internal track automatically
3. Save `internalTrackLink` and `buildNumber` (versionCode) from Play Store response

```bash
curl -X POST /builds/ci/artifact \
  -F "ciRunId=https://fe-jenkins-production.d11tech.in/job/Release-D11/job/AndroidPlayStoreRelease-Flip/1042/" \
  -F "artifact=@app-release.aab"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.amazonaws.com/bucket/...",
    "s3Uri": "s3://bucket/tenant/release/android/1.0.0/app-release.aab",
    "buildId": "abc123"
  }
}
```

**Database updates:**
- `artifactPath`: S3 URI
- `internalTrackLink`: From Play Store API
- `buildNumber`: From Play Store API (versionCode)

#### Scenario 3: AAB Upload (CI already uploaded to Play Store)

CI provides `buildNumber` (versionCode) after uploading to Play Store. System will:
1. Upload to S3
2. Fetch `packageName` from `store_integrations` table (tenant's Play Store integration)
3. Generate `internalTrackLink`: `https://play.google.com/apps/test/{packageName}/{versionCode}`
4. Save generated `internalTrackLink` and provided `buildNumber`

```bash
curl -X POST /builds/ci/artifact \
  -F "ciRunId=https://fe-jenkins-production.d11tech.in/job/Release-D11/job/AndroidPlayStoreRelease-Flip/1042/" \
  -F "artifact=@app-release.aab" \
  -F "buildNumber=12345"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.amazonaws.com/bucket/...",
    "s3Uri": "s3://bucket/tenant/release/android/1.0.0/app-release.aab",
    "buildId": "abc123"
  }
}
```

**Database updates:**
- `artifactPath`: S3 URI
- `internalTrackLink`: From request
- `buildNumber`: Extracted from AAB file (versionCode)

### Flow Diagram

```
CI/CD Pipeline
      │
      ▼
┌─────────────────┐
│ Upload Artifact │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ Is file .aab?                           │
├─────────────────────────────────────────┤
│ NO  → Upload to S3, save to DB          │
│ YES → Continue to AAB processing        │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│ Is internalTrackLink provided?          │
├─────────────────────────────────────────┤
│ YES → Extract versionCode from AAB      │
│       Save internalTrackLink + versionCode│
│                                          │
│ NO  → Call Store Distribution Service   │
│       Upload to Play Store internal track│
│       Get internalTrackLink + versionCode│
│       Save both to DB                   │
└─────────────────────────────────────────┘
```

---

## 2. Manual Build Upload

Create a new build record with artifact (for manual uploads outside CI/CD).

### Endpoint

```
POST /tenants/:tenantId/releases/:releaseId/builds/manual-upload
```

### Request

**Content-Type:** `multipart/form-data`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tenantId` | string | Yes | Tenant identifier |
| `releaseId` | string | Yes | Release identifier |

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `artifactVersionName` | string | Yes | Version name (e.g., "1.2.3") |
| `platform` | string | Yes | `ANDROID`, `IOS`, or `WEB` |
| `buildStage` | string | Yes | `KICK_OFF`, `REGRESSION`, or `PRE_RELEASE` |
| `storeType` | string | No | `APP_STORE`, `PLAY_STORE`, `TESTFLIGHT`, etc. |
| `buildNumber` | string | No | Build number (for non-AAB builds) |
| `internalTrackLink` | string | No | Play Store internal track link (if already uploaded) |
| `artifact` | file | Yes | Build artifact file |

### Example

```bash
curl -X POST /tenants/tenant-123/releases/release-456/builds/manual-upload \
  -F "artifactVersionName=1.2.3" \
  -F "platform=ANDROID" \
  -F "buildStage=PRE_RELEASE" \
  -F "storeType=PLAY_STORE" \
  -F "artifact=@app-release.aab"
```

### Response

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://s3.amazonaws.com/bucket/...",
    "s3Uri": "s3://bucket/tenant/release/android/1.2.3/app-release.aab",
    "buildId": "xyz789"
  },
  "message": "Build artifact uploaded successfully"
}
```

---

## 3. List Build Artifacts

List build artifacts with presigned download URLs.

### Endpoint

```
GET /tenants/:tenantId/releases/:releaseId/builds/artifacts
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tenantId` | string | Yes | Tenant identifier |
| `releaseId` | string | Yes | Release identifier |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | No | Filter by platform |
| `buildStage` | string | No | Filter by build stage |
| `storeType` | string | No | Filter by store type |
| `buildType` | string | No | `MANUAL` or `CI_CD` |
| `workflowStatus` | string | No | `PENDING`, `RUNNING`, `COMPLETED`, `FAILED` |
| `buildUploadStatus` | string | No | `PENDING`, `UPLOADED`, `FAILED` |

### Example

```bash
curl -X GET "/tenants/tenant-123/releases/release-456/builds/artifacts?platform=ANDROID"
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "artifactPath": "s3://bucket/tenant/release/android/1.2.3/app-release.aab",
      "downloadUrl": "https://s3.amazonaws.com/bucket/...?X-Amz-Signature=...",
      "artifactVersionName": "1.2.3",
      "buildNumber": "12345",
      "releaseId": "release-456",
      "platform": "ANDROID",
      "storeType": "PLAY_STORE",
      "buildStage": "PRE_RELEASE",
      "buildType": "CI_CD",
      "buildUploadStatus": "UPLOADED",
      "workflowStatus": "COMPLETED",
      "regressionId": null,
      "ciRunId": "jenkins-build-123",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

## 4. TestFlight Verification

Verify a TestFlight build number exists in App Store Connect and update the build record.

### Endpoint

```
POST /builds/:buildId/testflight/verify
```

### Request

**Content-Type:** `application/json`

```json
{
  "testflightNumber": "12345"
}
```

### Response

**Success:**
```json
{
  "success": true,
  "data": {
    "buildId": "abc123",
    "testflightNumber": "12345",
    "verified": true
  },
  "message": "TestFlight build number verified and updated successfully"
}
```

**Verification Failed:**
```json
{
  "success": false,
  "error": "TestFlight build number verification failed: build not found in TestFlight",
  "code": "TESTFLIGHT_NUMBER_INVALID"
}
```

### Flow

```
1. Receive buildId + testflightNumber
2. Find build by buildId (verify it exists)
3. Call App Store Connect API to verify testflightNumber exists
4. If valid: Update builds.testflightNumber in DB
5. Return result
```

---

## AAB Build Flow

### Complete Flow Diagram

```
                    ┌─────────────────────┐
                    │   AAB File Upload   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Upload to S3      │
                    └──────────┬──────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │ internalTrackLink provided?    │
              └───────────────┬────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                      │
           ▼ YES                                  ▼ NO
┌─────────────────────────┐         ┌─────────────────────────┐
│ Extract versionCode     │         │ Store Distribution      │
│ from AAB file           │         │ Service                 │
│                         │         │                         │
│ - Parse AAB (ZIP)       │         │ - Upload to Play Store  │
│ - Read AndroidManifest  │         │ - Get internal track URL│
│ - Get versionCode       │         │ - Get versionCode       │
└───────────┬─────────────┘         └───────────┬─────────────┘
            │                                    │
            ▼                                    ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│ Save to DB:             │         │ Save to DB:             │
│ - internalTrackLink     │         │ - internalTrackLink     │
│   (from input)          │         │   (from Play Store)     │
│ - buildNumber           │         │ - buildNumber           │
│   (extracted)           │         │   (from Play Store)     │
└─────────────────────────┘         └─────────────────────────┘
```

### Key Points

1. **buildNumber is never required from CI** - Always auto-extracted from AAB or returned by Play Store
2. **internalTrackLink is optional** - If CI already uploaded, they can provide it; otherwise we upload
3. **APK/IPA builds skip AAB logic** - No internal track handling for non-AAB files

---

## Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BUILD_NOT_FOUND` | 404 | Build not found for provided ci_run_id |
| `BUILD_NOT_FOUND_BY_ID` | 404 | Build not found for provided build_id |
| `S3_UPLOAD_FAILED` | 500 | Could not upload artifact to S3 storage |
| `PRESIGNED_URL_FAILED` | 500 | Failed to generate presigned download URL |
| `DB_CREATE_FAILED` | 500 | Could not save build record |
| `DB_UPDATE_FAILED` | 500 | Could not update build record |
| `DB_QUERY_FAILED` | 500 | Failed to query build artifacts |
| `STORE_DISTRIBUTION_FAILED` | 500 | Failed to distribute AAB to internal track |
| `VERSION_EXTRACTION_FAILED` | 500 | Failed to extract version from AAB file |
| `TESTFLIGHT_VERIFICATION_FAILED` | 500 | Failed to verify TestFlight build number |
| `TESTFLIGHT_NUMBER_INVALID` | 400 | TestFlight build not found in App Store Connect |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

---

## Database Schema

### builds Table

```sql
CREATE TABLE builds (
  id VARCHAR(255) PRIMARY KEY,
  tenantId VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Version info
  buildNumber VARCHAR(255) NULL,           -- versionCode (AAB) or build number (IPA)
  artifactVersionName VARCHAR(255) NOT NULL, -- versionName (e.g., "1.2.3")
  
  -- Artifact storage
  artifactPath VARCHAR(255) NULL,          -- S3 URI
  
  -- Release association
  releaseId VARCHAR(255) NOT NULL,
  
  -- Platform & store
  platform ENUM('ANDROID', 'IOS', 'WEB') NOT NULL,
  storeType ENUM('APP_STORE', 'PLAY_STORE', 'TESTFLIGHT', 'MICROSOFT_STORE', 'FIREBASE', 'WEB') NULL,
  
  -- Build metadata
  buildStage ENUM('KICK_OFF', 'REGRESSION', 'PRE_RELEASE') NOT NULL,
  buildType ENUM('MANUAL', 'CI_CD') NOT NULL,
  buildUploadStatus ENUM('PENDING', 'UPLOADED', 'FAILED') NOT NULL,
  
  -- CI/CD info
  ciRunId VARCHAR(255) NULL,
  ciRunType ENUM('JENKINS', 'GITHUB_ACTIONS', 'CIRCLE_CI', 'GITLAB_CI') NULL,
  workflowStatus ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED') NULL,
  queueLocation VARCHAR(255) NULL,
  
  -- Task & regression association
  taskId VARCHAR(255) NULL,
  regressionId VARCHAR(255) NULL,
  
  -- Store distribution links
  internalTrackLink VARCHAR(255) NULL,     -- Play Store internal track URL
  testflightNumber VARCHAR(255) NULL       -- TestFlight build number
);
```

### Field Descriptions

| Field | Description |
|-------|-------------|
| `buildNumber` | For AAB: versionCode extracted from manifest or from Play Store. For IPA: TestFlight build number |
| `internalTrackLink` | Play Store internal testing track URL for AAB builds |
| `testflightNumber` | TestFlight build number for IPA builds (verified via App Store Connect) |

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| CI/CD artifact upload | ✅ Implemented | |
| Manual build upload | ✅ Implemented | |
| List build artifacts | ✅ Implemented | |
| S3 upload | ✅ Implemented | |
| Presigned URL generation | ✅ Implemented | |
| AAB detection | ✅ Implemented | |
| Version extraction from AAB | 🔲 Placeholder | Needs AAB parsing implementation |
| Store distribution service | 🔲 Placeholder | Needs Play Store API integration |
| TestFlight verification | 🔲 Placeholder | Needs App Store Connect API integration |

### Placeholder Services to Implement

1. **extractVersionFromAab** (`build-artifact.utils.ts`)
   - Parse AAB as ZIP archive
   - Read `base/manifest/AndroidManifest.xml` (protobuf format)
   - Extract `versionCode` and `versionName`

2. **StoreDistributionService** (`store-distribution.service.ts`)
   - Connect to Google Play Developer API
   - Upload AAB to internal track
   - Return `internalTrackLink` and `versionCode`

3. **TestflightVerificationService** (`testflight-verification.service.ts`)
   - Connect to App Store Connect API
   - Verify build number exists
   - Return verification result

---

## Example Workflows

### Workflow 1: Jenkins CI Uploads AAB (Doesn't Upload to Play Store)

```
1. Jenkins builds Android app → produces app-release.aab
2. Jenkins calls POST /builds/ci/artifact
   - ciRunId: "https://fe-jenkins-production.d11tech.in/job/Release-D11/job/AndroidPlayStoreRelease-Flip/1042/"
   - artifact: app-release.aab
3. System:
   - Uploads to S3
   - Detects .aab file
   - No internalTrackLink provided
   - Calls Store Distribution Service
   - Uploads to Play Store internal track
   - Gets internalTrackLink + versionCode
   - Saves to DB
4. Response: { downloadUrl, s3Uri, buildId }
```

### Workflow 2: GitHub Actions Uploads AAB (Already Uploaded to Play Store)

```
1. GitHub Actions builds Android app → produces app-release.aab
2. GitHub Actions uploads to Play Store internal track → gets versionCode: 12345
3. GitHub Actions calls POST /builds/ci/artifact
   - ciRunId: "https://github.com/org/repo/actions/runs/12345"
   - artifact: app-release.aab
   - buildNumber: "12345"
4. System:
   - Uploads to S3
   - Detects .aab file
   - buildNumber provided
   - Fetches packageName from store_integrations (e.g., "com.example.app")
   - Generates internalTrackLink: https://play.google.com/apps/test/com.example.app/12345
   - Saves internalTrackLink + buildNumber to DB
5. Response: { downloadUrl, s3Uri, buildId }
```

### Workflow 3: iOS TestFlight Build

```
1. CI builds iOS app → uploads to TestFlight
2. CI calls POST /builds/ci/artifact
   - ciRunId: "https://fe-jenkins-production.d11tech.in/job/Release-D11/job/iOSRelease/789/"
   - artifact: app.ipa
3. System:
   - Uploads to S3
   - Detects .ipa file (not AAB)
   - No internal track processing
   - Saves to DB
4. Later: Call POST /builds/{buildId}/testflight/verify
   - Body: { "testflightNumber": "12345" }
5. System:
   - Verifies with App Store Connect
   - Updates testflightNumber in DB
6. Response: { verified: true }
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial documentation |

