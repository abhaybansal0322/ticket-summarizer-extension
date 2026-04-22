export function sanitize(text) {
  return text
    // Emails
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, "[EMAIL]")

    // Phone numbers
    .replace(/\+?\d[\d\s-]{8,}\d/g, "[PHONE]")

    // API keys
    .replace(/sk-[a-zA-Z0-9]{20,}/g, "[API_KEY]")

    // URLs
    .replace(/https?:\/\/[^\s]+/g, "[URL]");
}
