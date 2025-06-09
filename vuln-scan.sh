#!/bin/bash

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ Error: .env file not found!"
  exit 1
fi

APP_PORT="${APP_PORT:-4000}"
URL="http://localhost:${APP_PORT}/user"
TIMEOUT=5

RESPONSE=$(curl -s -m $TIMEOUT "$URL" --output /dev/null --write-out "%{http_code}\n%{size_download}")

if [ $? -ne 0 ]; then
  echo "❌ Error: Failed to reach $URL. Is the server running?"
  exit 1
fi

HTTP_STATUS=$(echo "$RESPONSE" | head -n 1)
BODY_SIZE=$(echo "$RESPONSE" | tail -n 1)

if [ "$HTTP_STATUS" -ne 200 ]; then
  echo "❌ Error: Server responded with HTTP status $HTTP_STATUS for $URL"
  exit 1
fi

if [ "$BODY_SIZE" -gt 0 ]; then
  BODY=$(curl -s -m $TIMEOUT "$URL")
  if echo "$BODY" | grep -q 'vulnerable'; then
    echo "⚠️ Warning: Potential runtime vulnerabilities detected"
    exit 1
  else
    echo "✅ Runtime check passed"
  fi
else
  echo "✅ Empty response body — nothing to scan"
fi
