# Ticket Summarizer Extension

A lightweight Chrome/Edge extension designed to summarize support tickets or long text content using AI. This tool helps support agents and developers quickly understand the context of a ticket without reading through the entire thread.

## Features
- **Instant Summary**: One-click summarization of Jira ticket descriptions.
- **Context Awareness**: Extracts key problem details, likely causes, and provides a step-by-step fix.
- **Flexible AI Integration**: Powered by Google's latest Gemini models.
- **Secure API Key Handling**: Users can provide their own Gemini API key via the Options page, or rely on a secure cloud backend server as a fallback.

## Installation

### For Developers (Manual Load)
1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked** and select the folder containing these files.

## Configuration (Optional)
By default, the extension uses a secure backend to generate summaries. However, you can provide your own Gemini API key for direct processing:
1. Right-click the extension icon in your browser toolbar.
2. Select **Options**.
3. Enter your Gemini API key and click **Save**.
*(If you clear the API key, the extension will revert to using the default backend server.)*

## How to Use
1. Navigate to any Jira ticket (e.g., `*.atlassian.net`).
2. Click the extension icon in your browser toolbar to open the popup.
3. Click the **Analyze** button to generate a summary, likely cause, and step-by-step fix.

## Workflow
Here is a simple breakdown of how the extension works from start to finish:
1. **User Action**: You open a Jira ticket and click the extension's "Analyze" button.
2. **Data Extraction**: The extension's Content Script securely reads the ticket's title and description directly from the Jira webpage.
3. **Sanitization**: The Popup cleans up the extracted text to ensure there is no malicious code.
4. **AI Processing**: The Background Script takes the cleaned data and sends it to the Gemini AI API (using your custom key or a fallback server). It instructs the AI to "Act as a senior software engineer" to provide a Problem Summary, Likely Cause, and Step-by-step Fix.
5. **Display Results**: The AI's response is sent back to the Popup and displayed instantly on your screen.

## Technologies Used
- HTML/CSS/JavaScript
- Chrome Extension API (Manifest V3)
- Google Gemini API
- Node.js/Express (Backend Fallback)
