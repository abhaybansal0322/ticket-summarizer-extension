function extractTicket() {
  const title = document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]')?.innerText || "";

  const description = document.querySelector('[data-testid="issue.views.field.rich-text.description"]')?.innerText || "";

  return { title, description };
}

// Listen for request from popup
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_TICKET") {
    sendResponse(extractTicket());
  }
});
