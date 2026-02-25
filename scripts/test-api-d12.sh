#!/bin/bash

BASE_URL="http://localhost:3000"
ENDPOINT="$BASE_URL/api/dreams/generate"
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcXFrbWt0Y2lsZnRqY2JzYWtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTc5MDU3NSwiZXhwIjoyMDgxMzY2NTc1fQ.S-t1FRSWSkiwq0by34Bj1I4QsQi2xdPjH08SbQCIhCQ"
DREAM_ID="47e931c0-4433-441c-bcac-21417e06c38a"
DUMMY_ID="00000000-0000-0000-0000-000000000000"

echo "=== Test 1: Missing Auth Header (Expect 401) ==="
curl -s -X POST $ENDPOINT -H "Content-Type: application/json" -d "{\"dreamId\": \"$DREAM_ID\"}" | jq
echo ""

echo "=== Test 2: Invalid Auth Header (Expect 401) ==="
curl -s -X POST $ENDPOINT -H "Authorization: Bearer invalidtoken" -H "Content-Type: application/json" -d "{\"dreamId\": \"$DREAM_ID\"}" | jq
echo ""

echo "=== Test 3: Missing dreamId (Expect 400) ==="
curl -s -X POST $ENDPOINT -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" | jq
echo ""

echo "=== Test 4: Invalid dreamId (Expect 404) ==="
curl -s -X POST $ENDPOINT -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"dreamId\": \"$DUMMY_ID\"}" | jq
echo ""

echo "=== Test 5: Valid request (Expect 200, wait to finish) ==="
# Notice that Gemini will take a few seconds
curl -s -X POST $ENDPOINT -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"dreamId\": \"$DREAM_ID\"}" | jq
echo ""

echo "=== Test 6: Already completed dream (Expect 200 with message) ==="
curl -s -X POST $ENDPOINT -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{\"dreamId\": \"$DREAM_ID\"}" | jq
echo ""
