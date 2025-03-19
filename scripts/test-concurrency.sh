#!/bin/bash

# Test script for sending concurrent balance update requests

# Make sure jq is installed: sudo apt-get install jq or brew install jq

# Number of concurrent requests

NUM_REQUESTS=10000

# Amount to withdraw in each request

AMOUNT=-2

# User ID to update

USER_ID=1

# API endpoint

ENDPOINT="http://localhost:3000/api/balance/update"

echo "Sending $NUM_REQUESTS concurrent requests to withdraw $AMOUNT units each..."

# Create a temporary directory for output files

TEMP_DIR=$(mktemp -d)
SUCCESS_FILE="$TEMP_DIR/success.txt"
FAIL_FILE="$TEMP_DIR/fail.txt"

# Function to send a single request

send_request() {
local id=$1
  local response=$(curl -s -X POST \
 -H "Content-Type: application/json" \
 -d "{\"userId\":$USER_ID,\"amount\":$AMOUNT}" \
 $ENDPOINT)

# Check if the response indicates success or failure

if echo "$response" | grep -q "newBalance"; then
    echo "$id: Success" >> "$SUCCESS_FILE"
  else
    echo "$id: Failed - $response" >> "$FAIL_FILE"
fi
}

# Reset the files

> "$SUCCESS_FILE"
> "$FAIL_FILE"

# Start all requests in parallel

for i in $(seq 1 $NUM_REQUESTS); do
send_request $i &

# Limit parallelism to avoid overwhelming the system

if [ $((i % 100)) -eq 0 ]; then
wait
fi
done

# Wait for all requests to complete

wait

# Count successful and failed requests

SUCCESS_COUNT=$(wc -l < "$SUCCESS_FILE")
FAIL_COUNT=$(wc -l < "$FAIL_FILE")

echo "Test completed."
echo "Successful requests: $SUCCESS_COUNT"
echo "Failed requests: $FAIL_COUNT"

# Check if the numbers match expectations

if [ "$SUCCESS_COUNT" -eq 5000 ] && [ "$FAIL_COUNT" -eq 5000 ]; then
echo "✅ Test PASSED: Exactly 5000 requests succeeded and 5000 failed as expected."
else
echo "❌ Test FAILED: Expected 5000 successes and 5000 failures."
echo " Actual: $SUCCESS_COUNT successes and $FAIL_COUNT failures."
fi

# Cleanup

rm -rf "$TEMP_DIR"
