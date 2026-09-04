const express = require('express');
const chrono = require('chrono-node');
const { franc } = require('franc');

const app = express();

// Incoming JSON data സ്വീകരിക്കാൻ ഇത് വേണം
app.use(express.json());

// Basic GET route
app.get('/', (req, res) => {
    res.send('backend is working!');
});

// Postman-ൽ ടെസ്റ്റ് ചെയ്യാനുള്ള POST route
app.post('/submit-complaint', (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
    }

    // Chrono ഉപയോഗിച്ച് തീയതി കണ്ടെത്തുന്നു
    const parsedDate = chrono.parseDate(text);

    // Franc ഉപയോഗിച്ച് ഭാഷ തിരിച്ചറിയുന്നു
    const detectedLang = franc(text);

    res.json({
        message: 'Complaint received successfully!',
        originalText: text,
        detectedLanguage: detectedLang,
        extractedDate: parsedDate ? parsedDate.toISOString() : 'No date detected'
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});