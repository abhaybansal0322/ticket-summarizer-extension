import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS so the Chrome extension can make requests
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY not found.' });
  }

  const prompt = `
Act as a senior software engineer.

Analyze the following ticket and provide:

1. Problem Summary (1-2 lines)
2. Likely Cause
3. Step-by-step Fix (clear and actionable)

Ticket:
Title: ${title}
Description: ${description}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini API";
    res.json({ result });

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: 'Failed to contact Gemini API.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
