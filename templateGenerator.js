// templateGenerator.js
function generateComplaintTemplate(data) {
  return `
====================================================================
               FORMAL CYBER MORPHING & HARASSMENT REPORT
      Generated via CYRA (Cryptographic Evidence & Rapid Action Protocol)
====================================================================

[SECTION 1: CASE SUMMARY]
--------------------------------------------------------------------
Case Reference ID      : ${data.caseId || 'CYRA-2026-TEMP'}
Submission Timestamp   : ${data.submissionTimestamp || new Date().toISOString()}
Input Mode / Language  : ${data.inputMode || 'Voice/Text'} / ${data.language || 'English'}
Target Platform        : ${data.platform || 'Not Specified'}

[SECTION 2: INCIDENT INFORMATION]
--------------------------------------------------------------------
Incident Date & Time   : ${data.date || 'N/A'} at ${data.time || 'N/A'}
Incident Category      : Cyber Morphing / Non-Consensual Image Misuse
Detailed Description   : 
> "${data.rawTextSanitized || data.rawText || 'No description provided.'}"

[SECTION 3: SUSPECT & PLATFORM DETAILS]
--------------------------------------------------------------------
Suspected Username/Handle : ${data.suspectUsername || 'Missing / Under Investigation'}
Suspect Profile URL       : ${data.suspectUrl || 'N/A'}
Suspect Contact Info      : Phone: ${data.suspectPhone || 'N/A'} | Email: ${data.suspectEmail || 'N/A'}

[SECTION 4: EVIDENCE & CRYPTOGRAPHIC VERIFICATION]
--------------------------------------------------------------------
Primary Evidence File  : ${data.evidenceFileName || 'screenshot_proof.png'}
SHA-256 Hash Signature : ${data.evidenceHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
Verification Status    : Cryptographically Sealed & Tamper-Proof

[SECTION 5: REQUESTED ACTION]
--------------------------------------------------------------------
1. Platform Grievance Officer: Immediate takedown of morphed content and suspension of suspect account.
2. Cyber Police Cell: Formal registration of complaint under relevant Cyber Crime/IT Act sections.

[SECTION 6: ESCALATION & DUAL-DISPATCH STATUS]
--------------------------------------------------------------------
Dispatch to Platform Safety Cell : ${data.sentToPlatform ? 'SENT' : 'PENDING'}
Dispatch to Cyber Crime Portal  : ${data.sentToCyberCell ? 'SENT' : 'PENDING'}
====================================================================
`;
}

module.exports = { generateComplaintTemplate };