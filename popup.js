import { sanitize } from "./utils/sanitizer.js";

document.getElementById("analyze").onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Step 1: Get ticket
  const ticket = await chrome.tabs.sendMessage(tab.id, { type: "GET_TICKET" });

  // Step 2: Sanitize
  const cleanTitle = sanitize(ticket.title);
  const cleanDesc = sanitize(ticket.description);

  // Step 3: Send to background
  const response = await chrome.runtime.sendMessage({
    type: "PROCESS_TICKET",
    data: {
      title: cleanTitle,
      description: cleanDesc
    }
  });

  document.getElementById("output").innerText = response.result;
};
