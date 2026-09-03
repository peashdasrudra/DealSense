/**
 * DealSense — HubSpot Workflow Custom Code Action (Node.js)
 *
 * PRODUCTION SPECIFICATION:
 * - Runtime: Node.js 18.x / 20.x
 * - Environment: HubSpot Serverless Workflow Engine
 * - Constraints: 20-second hard timeout | 128 MB maximum memory
 * - Purpose: Automatically evaluates deal risk upon stage change or lifecycle triggers,
 *            invokes DealSense deterministic 7-vector scoring, and writes back directly
 *            to HubSpot CRM Deal properties.
 *
 * @author Peash Das Rudra <peash@peash.tech>
 */

const hubspot = require("@hubspot/api-client");
const axios = require("axios");

// HubSpot serverless execution ceiling is 20,000ms.
// We enforce an internal safety abort at 14,000ms to guarantee graceful termination.
const SAFETY_TIMEOUT_MS = 14000;
const DEFAULT_API_BASE = "https://dealsense-api-6o2h.onrender.com/api/v1";

/**
 * Deterministic fallback scoring engine.
 * Ensures the HubSpot workflow never crashes unhandled if network or cold starts occur.
 */
function computeFallbackScore(dealProperties) {
  let score = 70;
  const stage = (dealProperties.dealstage || "").toLowerCase();
  const amount = parseFloat(dealProperties.amount) || 0;

  if (stage.includes("closedwon")) {
    score = 95;
  } else if (stage.includes("closedlost")) {
    score = 10;
  } else if (stage.includes("contract") || stage.includes("decisionmaker")) {
    score = 75;
  } else if (stage.includes("qualified") || stage.includes("presentation")) {
    score = 60;
  }

  // Adjust by deal size exposure
  if (amount > 100000) {
    score = Math.max(15, score - 10); // Higher scrutiny for mega-deals
  }

  let riskBand = "MODERATE";
  if (score >= 80) riskBand = "LOW";
  else if (score < 50) riskBand = "CRITICAL";
  else if (score < 65) riskBand = "HIGH";

  return {
    healthScore: score,
    riskBand,
    explanation: "Evaluated via DealSense Local Heuristic Engine (Serverless Fallback Mode).",
    recommendedAction: score < 60 ? "Schedule executive alignment call" : "Proceed with standard validation steps",
  };
}

/**
 * Main handler invoked by HubSpot Workflow Engine.
 *
 * @param {Object} event - HubSpot Workflow Event payload
 * @param {Object} event.object - Associated CRM object reference
 * @param {string} event.object.objectId - Deal Record ID
 * @param {Object} event.inputFields - Inputs configured in the workflow action UI
 * @param {Function} [callback] - Optional HubSpot callback (Node.js style)
 * @returns {Promise<Object>} Output fields for downstream workflow branching
 */
async function main(event, callback) {
  const startTime = Date.now();

  const objectId = event?.object?.objectId;
  const inputFields = event?.inputFields || {};
  const portalId = event?.origin?.portalId || inputFields.portalId || "unknown";

  if (!objectId) {
    const errorMsg = "Missing required event.object.objectId in workflow action";
    console.error(`[DealSense Action] ERROR: ${errorMsg}`);
    const result = {
      outputFields: {
        dealsense_execution_status: "FAILED",
        dealsense_error_message: errorMsg,
      },
    };
    if (callback) callback(result);
    return result;
  }

  console.log(`[DealSense Action] Starting evaluation for Deal #${objectId} (Portal: ${portalId})`);

  const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN || process.env.PRIVATE_APP_ACCESS_TOKEN;
  const dealsenseApiKey = process.env.DEALSENSE_API_KEY || "";
  const apiBaseUrl = process.env.DEALSENSE_API_BASE_URL || DEFAULT_API_BASE;

  let evaluationResult = null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SAFETY_TIMEOUT_MS);

  try {
    // 1. Attempt live evaluation via DealSense Cloud API
    const response = await axios.post(
      `${apiBaseUrl}/deals/${objectId}/score`,
      {
        deal_id: objectId,
        portal_id: portalId,
        properties: inputFields,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": dealsenseApiKey,
          "User-Agent": "DealSense-HubSpot-Workflow-Action/1.0",
        },
        signal: controller.signal,
        timeout: SAFETY_TIMEOUT_MS,
      }
    );

    if (response.status === 200 && response.data) {
      const d = response.data;
      evaluationResult = {
        healthScore: d.health_score ?? d.score ?? 70,
        riskBand: (d.risk_band || "MODERATE").toUpperCase(),
        explanation: d.risk_explanation || "Deal evaluated via DealSense 7-Vector Engine.",
        recommendedAction: d.recommended_action || "Maintain current momentum.",
        source: "DEALSENSE_CLOUD_API",
      };
    }
  } catch (apiErr) {
    console.warn(
      `[DealSense Action] Cloud API call unfulfilled (${apiErr.message}). Engaging deterministic fallback.`
    );
    evaluationResult = {
      ...computeFallbackScore(inputFields),
      source: "DETERMINISTIC_FALLBACK",
    };
  } finally {
    clearTimeout(timeoutId);
  }

  // 2. Bi-directional CRM Write-Back (Update Deal Properties)
  if (hubspotToken) {
    try {
      const hubspotClient = new hubspot.Client({ accessToken: hubspotToken });
      await hubspotClient.crm.deals.basicApi.update(objectId, {
        properties: {
          dealsense_health_score: String(evaluationResult.healthScore),
          dealsense_risk_band: evaluationResult.riskBand,
          dealsense_risk_explanation: evaluationResult.explanation.substring(0, 500),
          dealsense_recommended_action: evaluationResult.recommendedAction.substring(0, 255),
          dealsense_last_evaluated: new Date().toISOString(),
        },
      });
      console.log(`[DealSense Action] Successfully updated Deal #${objectId} in HubSpot CRM.`);
    } catch (crmErr) {
      console.error(`[DealSense Action] Failed to write back to HubSpot CRM: ${crmErr.message}`);
    }
  } else {
    console.warn(
      "[DealSense Action] HUBSPOT_ACCESS_TOKEN not configured. Skipped direct CRM write-back; returning outputFields."
    );
  }

  const executionDuration = Date.now() - startTime;
  console.log(`[DealSense Action] Completed in ${executionDuration}ms with status SUCCESS.`);

  // 3. Output fields returned to HubSpot Workflow for downstream if/then branching
  const outputData = {
    outputFields: {
      dealsense_health_score: evaluationResult.healthScore,
      dealsense_risk_band: evaluationResult.riskBand,
      dealsense_recommended_action: evaluationResult.recommendedAction,
      dealsense_execution_source: evaluationResult.source,
      dealsense_execution_status: "SUCCESS",
      dealsense_execution_duration_ms: executionDuration,
    },
  };

  if (callback) {
    callback(outputData);
  }
  return outputData;
}

module.exports = {
  main,
  computeFallbackScore,
  SAFETY_TIMEOUT_MS,
};
