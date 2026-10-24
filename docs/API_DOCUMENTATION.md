# SnapCut AI — Developer API Documentation (v1)

## Base URL
```
https://snapcut.ai/api/v1
```

## Authentication
All API requests must include a valid Bearer token in the `Authorization` header:
```http
Authorization: Bearer sc_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 1. Remove Background
`POST /api/v1/remove-background`

#### Request Headers
- `Authorization`: `Bearer <API_KEY>`
- `Content-Type`: `application/json`

#### Request Body
```json
{
  "image_url": "https://example.com/photo.jpg",
  "output_format": "png",
  "idempotency_key": "unique_client_req_id_98210"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "job_id": "job_82910fa",
  "status": "completed",
  "result_url": "https://res.cloudinary.com/snapcut/image/upload/s--xyz--/v1/proc_82910fa.png",
  "processing_duration_ms": 480,
  "width": 2048,
  "height": 1536,
  "expires_at": "2026-10-24T20:00:00Z"
}
```

---

### 2. Get Job Status
`GET /api/v1/jobs/:jobId`

#### Response (200 OK)
```json
{
  "id": "job_82910fa",
  "status": "completed",
  "original_filename": "photo.jpg",
  "processing_duration_ms": 480,
  "expires_at": "2026-10-24T20:00:00Z"
}
```

---

### 3. Error Codes
| Status Code | Code String | Description |
| :--- | :--- | :--- |
| `400` | `INVALID_IMAGE_PAYLOAD` | File exceeds 10 MB or dimensions exceed 5000px. |
| `401` | `UNAUTHORIZED` | Missing or invalid API key. |
| `402` | `INSUFFICIENT_CREDITS` | Quota exhausted. Top up via dashboard. |
| `429` | `RATE_LIMIT_EXCEEDED` | Request threshold exceeded. Retry with exponential backoff. |
