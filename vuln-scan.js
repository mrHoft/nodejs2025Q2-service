require('dotenv').config();

const APP_PORT = process.env.APP_PORT || '4000';
const SCAN_ROUTE = process.env.SCAN_ROUTE || '/user';
const URL = `http://localhost:${APP_PORT}${SCAN_ROUTE}`;
const TIMEOUT_MS = 5000;
const SEARCH_TERM = 'vulnerable';

async function runCheck() {
  console.log(`🔍 Checking ${URL}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(URL, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ Error: Server responded with HTTP status ${response.status} for ${URL}`);
      process.exit(1);
    }

    const body = await response.text();

    if (!body) {
      console.log('✅ Empty response body — nothing to scan');
      return;
    }

    if (body.includes(SEARCH_TERM)) {
      console.log("⚠️ Warning: Potential runtime vulnerabilities detected");
      process.exit(1);
    } else {
      console.log('✅ Runtime check passed');
    }
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error(`⏰ Error: Request timed out after ${TIMEOUT_MS / 1000}s`);
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error(`❌ Error: Failed to reach ${URL}. Is the server running?`);
    } else {
      console.error(`❌ Unexpected error: ${error.message}. Is the server running?`);
    }

    process.exit(1);
  }
}

runCheck();
