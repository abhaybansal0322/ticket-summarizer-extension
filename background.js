chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "PROCESS_TICKET") {
    const { title, description } = req.data;

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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY",
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
        const result =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response";

        sendResponse({ result });
      })
      .catch(err => {
        sendResponse({ result: "Error: " + err.message });
      });

    return true; // IMPORTANT for async
  }
});