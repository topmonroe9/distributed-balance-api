#!/bin/bash

START_TIME=$(date +%s)

NUM_REQUESTS=10000
AMOUNT=-2
USER_ID=1
ENDPOINT="http://localhost:3000/api/balance/update"

echo "Sending $NUM_REQUESTS concurrent requests to withdraw $AMOUNT units each..."

TEMP_DIR=$(mktemp -d)
SUCCESS_FILE="$TEMP_DIR/success.txt"
FAIL_FILE="$TEMP_DIR/fail.txt"

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

> "$SUCCESS_FILE"
> "$FAIL_FILE"

for i in $(seq 1 $NUM_REQUESTS); do
  send_request $i &
  
  # Limit parallelism to avoid overwhelming the system
  if [ $((i % 100)) -eq 0 ]; then
    wait
  fi
done

wait

END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))

SUCCESS_COUNT=$(wc -l < "$SUCCESS_FILE")
FAIL_COUNT=$(wc -l < "$FAIL_FILE")

echo "Test completed in $ELAPSED_TIME seconds."
echo "Successful requests: $SUCCESS_COUNT"
echo "Failed requests: $FAIL_COUNT"

# Check if the numbers match expectations
if [ "$SUCCESS_COUNT" -eq 5000 ] && [ "$FAIL_COUNT" -eq 5000 ]; then
  echo "✅ Test PASSED: Exactly 5000 requests succeeded and 5000 failed as expected."
else
  echo "❌ Test FAILED: Expected 5000 successes and 5000 failures."
  echo "   Actual: $SUCCESS_COUNT successes and $FAIL_COUNT failures."
fi

rm -rf "$TEMP_DIR"