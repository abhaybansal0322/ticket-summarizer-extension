let DEFAULT_GEMINI_API_KEY = "YOUR_DEFAULT_GEMINI_API_KEY";

// Load config asynchronously without blocking the service worker registration
import("./config.js").then((config) => {
  DEFAULT_GEMINI_API_KEY = config.DEFAULT_GEMINI_API_KEY;
}).catch(() => {
  console.warn("config.js not found. Users must provide their own API key.");
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "PROCESS_TICKET") {
    const { title, description } = req.data;

    chrome.storage.local.get(['geminiApiKey'], (result) => {
      const apiKey = result.geminiApiKey || DEFAULT_GEMINI_API_KEY;

      if (!apiKey || apiKey === "YOUR_DEFAULT_GEMINI_API_KEY") {
        sendResponse({ result: "Error: No Gemini API key found. Please set it in the extension options." });
        return;
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

      fetch(
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
      )
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            sendResponse({ result: "API Error: " + data.error.message });
          } else {
            const result =
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              "No response";
            sendResponse({ result });
          }
        })
        .catch(err => {
          sendResponse({ result: "Error: " + err.message });
        });
    });

    return true; // IMPORTANT for async
  }
});