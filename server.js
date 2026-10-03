const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.static('public'));

let fallbackAssets = [];

// --- Login Route ---
app.post('/api/login', (req, res) => {
    const { accNumber, pin } = req.body;
    if(accNumber && accNumber.length > 5 && pin && pin.length === 4) {
        res.json({ success: true, token: "mock_secure_token_12345" });
    } else {
        res.status(401).json({ success: false, error: "Invalid Account Number or 4-digit PIN" });
    }
});

// --- Smart Template Engine (Offline, No API Needed) ---
app.post('/api/draft-complaint', (req, res) => {
    const { issueType, rawComplaint } = req.body;
    
    const date = new Date().toLocaleDateString('en-IN');
    const draft = `Date: ${date}\n\nTo,\nThe Grievance Redressal Officer,\nSEBI SCORES Portal\n\nSubject: Formal Complaint regarding ${issueType}.\n\nRespected Sir/Madam,\n\nI am writing to formally report an issue regarding my financial account. \n\nDetails of the grievance:\n"${rawComplaint}"\n\nThis action was taken without my proper consent and violates investor protection guidelines. I request you to kindly investigate this matter strictly and initiate a resolution or refund at the earliest.\n\nThanking You,\n\nYours Sincerely,\n[Your Signature/Name]\n[Your Contact Information]`;
    
    res.json({ draft });
});

// --- Asset Management Routes (Date Added Feature Included) ---
app.post('/api/assets', (req, res) => {
    const newAsset = req.body;
    newAsset.amount = parseFloat(newAsset.amount) || 0;
    newAsset.status = newAsset.nomineeName ? 'Safe' : 'Warning: Nominee Missing';
    
    // Fallback date agar frontend se na aaye
    if(!newAsset.dateAdded) {
        const d = new Date();
        newAsset.dateAdded = d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    }

    fallbackAssets.push(newAsset);
    res.status(201).json({ message: "Asset saved!" });
});

app.get('/api/assets', (req, res) => {
    res.json(fallbackAssets);
});

// --- Mock WhatsApp Route ---
app.post('/api/whatsapp', (req, res) => {
    const { assetName } = req.body;
    res.json({ message: `WhatsApp alert sent successfully for ${assetName}` });
});

app.listen(3000, () => {
    console.log("=========================================");
    console.log("🚀 NiveshGuard SECURE is RUNNING FAST!");
    console.log("👉 Open Google Chrome and go to: http://localhost:3000");
    console.log("=========================================");
});