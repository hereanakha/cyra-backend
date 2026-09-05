const crypto = require('crypto');

function generateEvidenceHash(fileBuffer) {
    return crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');
}

module.exports = { generateEvidenceHash };