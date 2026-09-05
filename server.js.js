const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// Temporary storage
const complaints = [];

// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "CYRA Backend is running"
  });
});

// =========================
// CASE ID
// =========================

function generateCaseId() {
  const date = new Date();

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = Math.random()
    .toString(16)
    .substring(2, 6)
    .toUpperCase();

  return `CYRA-${year}-${month}${day}-${random}`;
}

// =========================
// INCIDENT TYPE
// =========================

function detectIncidentType(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("threat")) {
    return "threat";
  }

  if (lowerText.includes("morphed")) {
    return "morphed_image";
  }

  if (
    lowerText.includes("extortion") ||
    lowerText.includes("blackmail")
  ) {
    return "extortion";
  }

  if (lowerText.includes("stalking")) {
    return "stalking";
  }

  if (lowerText.includes("fake profile")) {
    return "fake_profile";
  }

  return "other";
}

// =========================
// PLATFORM
// =========================

function detectPlatform(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("instagram")) {
    return "Instagram";
  }

  if (lowerText.includes("whatsapp")) {
    return "WhatsApp";
  }

  if (lowerText.includes("telegram")) {
    return "Telegram";
  }

  if (lowerText.includes("facebook")) {
    return "Facebook";
  }

  return "Unknown";
}

// =========================
// USERNAME
// =========================

function extractUsername(text) {
  const match = text.match(/@[a-zA-Z0-9._-]+/);

  return match ? match[0] : null;
}

// =========================
// STRUCTURED COMPLAINT
// =========================

function generateStructuredComplaint(data) {
  return `
CASE SUMMARY
Case ID: ${data.caseId}

INCIDENT INFORMATION
${data.rawComplaintText}

SUSPECT & PLATFORM DETAILS
Platform: ${data.extractedPlatform}
Username: ${data.suspectUsername || "Not provided"}

REQUESTED ACTION
${data.requestedActions.length > 0
    ? data.requestedActions.join(", ")
    : "Not specified"}

EVIDENCE
${data.evidenceUrl || "No evidence provided"}

STATUS
${data.status}
`.trim();
}

// =========================
// POST - CREATE COMPLAINT
// =========================

app.post("/api/complaint", (req, res) => {
  const complaintData = req.body;
  // Validation
  if (!req.body.rawComplaintText) {
    return res.status(400).json({
      success: false,
      message: "Complaint text is required"
    });
  }
// Validation 2 - Language
  if (
    req.body.language &&
    !["en", "ml"].includes(req.body.language)
  ) {
    return res.status(400).json({
      success: false,
      message: "Language must be en or ml"
    });
  }
  const complaintText =
    complaintData.rawComplaintText || "";

  const caseId = generateCaseId();

  const now = new Date().toISOString();

  const complaint = {
    caseId: caseId,

    language: complaintData.language || "en",

    inputMode: complaintData.inputMode || "text",

    rawComplaintText: complaintText,

    extractedIncidentType:
      detectIncidentType(complaintText),

    extractedPlatform:
      detectPlatform(complaintText),

    suspectUsername:
      extractUsername(complaintText),

    requestedActions:
      complaintData.requestedActions || [],

    evidenceHash:
      complaintData.evidenceHash || null,

    evidenceUrl:
      complaintData.evidenceUrl || null,

    status: "case_created",

    timeline: [
      {
        event: "case_created",
        time: now
      }
    ],

    timestamp: now
  };

  // Check missing username
  complaint.missingFields = [];

  if (!complaint.suspectUsername) {
    complaint.missingFields.push("suspectUsername");
  }

  // Generate structured complaint
  complaint.structuredComplaint =
    generateStructuredComplaint(complaint);

  complaints.push(complaint);

  console.log("New complaint:", complaint);

  res.status(201).json({
    success: true,
    message: "Complaint created successfully",
    complaint: complaint
  });
});

// =========================
// GET - SINGLE COMPLAINT
// =========================

app.get("/api/complaint/:id", (req, res) => {

  const complaint = complaints.find(
    (item) => item.caseId === req.params.id
  );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }

  res.json({
    success: true,
    complaint: complaint
  });
});

// =========================
// PATCH - UPDATE COMPLAINT
// =========================

app.patch("/api/complaint/:id", (req, res) => {

  const complaint = complaints.find(
    (item) => item.caseId === req.params.id
  );

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: "Complaint not found"
    });
  }
const allowedStatuses = [
  "case_created",
  "submitted_under_review",
  "tracking"
];

if (
  req.body.status &&
  !allowedStatuses.includes(req.body.status)
) {
  return res.status(400).json({
    success: false,
    message: "Invalid status"
  });
}
  if (req.body.status) {
    complaint.status = req.body.status;
  }

  if (req.body.event) {
    complaint.timeline.push({
      event: req.body.event,
      time: new Date().toISOString()
    });
  }

  res.json({
    success: true,
    message: "Complaint updated successfully",
    complaint: complaint
  });
});

// =========================
// GET - ALL COMPLAINTS
// =========================

app.get("/api/complaints", (req, res) => {

  res.json({
    success: true,
    count: complaints.length,
    complaints: complaints
  });
});

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// =========================
// SERVER
// =========================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});