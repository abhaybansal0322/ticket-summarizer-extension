const DEFAULT_BACKEND_URL = "https://your-backend-url.onrender.com/api/analyze";

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "PROCESS_TICKET") {
    const { title, description } = req.data;

    chrome.storage.local.get(['geminiApiKey'], (result) => {
      const apiKey = result.geminiApiKey;

      if (apiKey) {
        // Use the custom API key directly from the browser
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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
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
      } else {
        // Fallback to the secure backend server
        fetch(DEFAULT_BACKEND_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ title, description })
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              sendResponse({ result: "Backend Error: " + data.error });
            } else {
              sendResponse({ result: data.result || "No response" });
            }
          })
          .catch(err => {
            sendResponse({ result: "Error contacting backend server: " + err.message });
          });
      }
    });

    return true; // IMPORTANT for async
  }
});