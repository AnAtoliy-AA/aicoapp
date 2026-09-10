#!/bin/bash
# Delete all Vercel deployments except the latest "READY" one per branch.
# Usage: VERCEL_TOKEN=xxx bash scripts/clean-vercel-deployments.sh

set -euo pipefail

TOKEN="${VERCEL_TOKEN:?Set VERCEL_TOKEN env var}"
PROJECT_ID="${VERCEL_PROJECT_ID:-$(curl -s -H "Authorization: Bearer $TOKEN" https://api.vercel.com/v9/projects | jq -r '.projects[0].id')}"
TEAM_ID="${VERCEL_TEAM_ID:-}"
KEEP_LATEST=1

QUERY="projectId=$PROJECT_ID&limit=100"
[ -n "$TEAM_ID" ] && QUERY="$QUERY&teamId=$TEAM_ID"

echo "Fetching deployments..."
DEPLOYMENTS=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v6/deployments?$QUERY" | jq -r '.deployments[].uid')

TOTAL=$(echo "$DEPLOYMENTS" | wc -l | tr -d ' ')
echo "Found $TOTAL deployments. Deleting all except latest $KEEP_LATEST..."

COUNT=0
for DEPLOY_ID in $DEPLOYMENTS; do
  COUNT=$((COUNT + 1))
  if [ "$COUNT" -le "$KEEP_LATEST" ]; then
    echo "[$COUNT/$TOTAL] Keeping $DEPLOY_ID (latest)"
    continue
  fi

  # Skip if already deleting/deleted
  STATE=$(curl -s -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v13/deployments/$DEPLOY_ID" | jq -r '.state // "UNKNOWN"')
  if [ "$STATE" = "DELETED" ] || [ "$STATE" = "DELETING" ]; then
    echo "[$COUNT/$TOTAL] Already $STATE: $DEPLOY_ID"
    continue
  fi

  RESP=$(curl -s -w "\%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "https://api.vercel.com/v13/deployments/$DEPLOY_ID")
  STATUS=$(echo "$RESP" | tail -1)

  if [ "$STATUS" = "200" ] || [ "$STATUS" = "204" ]; then
    echo "[$COUNT/$TOTAL] Deleted $DEPLOY_ID"
  else
    echo "[$COUNT/$TOTAL] Failed ($STATUS) $DEPLOY_ID"
  fi
done

echo "Done. Deleted $((COUNT - KEEP_LATEST)) deployments."
