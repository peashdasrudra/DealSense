/**
 * Unit Test Suite for HubSpot Workflow Custom Code Action
 */

const { main, computeFallbackScore, SAFETY_TIMEOUT_MS } = require("../src/deal_scoring_action");
const axios = require("axios");
const hubspot = require("@hubspot/api-client");

jest.mock("axios");
jest.mock("@hubspot/api-client");

describe("DealSense HubSpot Workflow Custom Code Action", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      HUBSPOT_ACCESS_TOKEN: "mock-hubspot-token",
      DEALSENSE_API_KEY: "mock-api-key",
      DEALSENSE_API_BASE_URL: "https://test-api.dealsense.peash.tech/api/v1",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("computeFallbackScore", () => {
    it("assigns high score to closed won deals", () => {
      const result = computeFallbackScore({ dealstage: "closedwon", amount: "50000" });
      expect(result.healthScore).toBe(95);
      expect(result.riskBand).toBe("LOW");
    });

    it("assigns critical score to closed lost deals", () => {
      const result = computeFallbackScore({ dealstage: "closedlost", amount: "50000" });
      expect(result.healthScore).toBe(10);
      expect(result.riskBand).toBe("CRITICAL");
    });

    it("applies penalty for mega-deals over 100k", () => {
      const standard = computeFallbackScore({ dealstage: "qualifiedtobuy", amount: "50000" });
      const mega = computeFallbackScore({ dealstage: "qualifiedtobuy", amount: "250000" });
      expect(mega.healthScore).toBe(standard.healthScore - 10);
    });
  });

  describe("main handler execution", () => {
    it("returns error status if objectId is missing", async () => {
      const event = { inputFields: {} };
      const result = await main(event);

      expect(result.outputFields.dealsense_execution_status).toBe("FAILED");
      expect(result.outputFields.dealsense_error_message).toContain("Missing required event.object.objectId");
    });

    it("successfully scores deal via DealSense API and writes back to HubSpot CRM", async () => {
      // Mock DealSense API response
      axios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          health_score: 82,
          risk_band: "LOW",
          risk_explanation: "Strong champion engagement, clear timeline established.",
          recommended_action: "Send proposal agreement.",
        },
      });

      // Mock HubSpot CRM Client update
      const mockUpdate = jest.fn().mockResolvedValueOnce({ id: "987654" });
      hubspot.Client.mockImplementation(() => ({
        crm: {
          deals: {
            basicApi: {
              update: mockUpdate,
            },
          },
        },
      }));

      const event = {
        origin: { portalId: "123456" },
        object: { objectId: "987654" },
        inputFields: {
          dealname: "Enterprise Global Deal",
          dealstage: "decisionmakerboughtin",
          amount: "85000",
        },
      };

      const callback = jest.fn();
      const result = await main(event, callback);

      // Verify DealSense API was invoked with proper parameters
      expect(axios.post).toHaveBeenCalledWith(
        "https://test-api.dealsense.peash.tech/api/v1/deals/987654/score",
        expect.objectContaining({
          deal_id: "987654",
          portal_id: "123456",
        }),
        expect.any(Object)
      );

      // Verify HubSpot write-back occurred
      expect(mockUpdate).toHaveBeenCalledWith(
        "987654",
        expect.objectContaining({
          properties: expect.objectContaining({
            dealsense_health_score: "82",
            dealsense_risk_band: "LOW",
          }),
        })
      );

      // Verify workflow outputs
      expect(result.outputFields.dealsense_health_score).toBe(82);
      expect(result.outputFields.dealsense_risk_band).toBe("LOW");
      expect(result.outputFields.dealsense_execution_status).toBe("SUCCESS");
      expect(result.outputFields.dealsense_execution_source).toBe("DEALSENSE_CLOUD_API");
      expect(callback).toHaveBeenCalledWith(result);
    });

    it("falls back to deterministic scoring when DealSense API encounters an error", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network timeout after 14000ms"));

      const mockUpdate = jest.fn().mockResolvedValueOnce({ id: "987654" });
      hubspot.Client.mockImplementation(() => ({
        crm: {
          deals: {
            basicApi: {
              update: mockUpdate,
            },
          },
        },
      }));

      const event = {
        object: { objectId: "987654" },
        inputFields: {
          dealstage: "contractsent",
          amount: "45000",
        },
      };

      const result = await main(event);

      expect(result.outputFields.dealsense_execution_status).toBe("SUCCESS");
      expect(result.outputFields.dealsense_execution_source).toBe("DETERMINISTIC_FALLBACK");
      expect(result.outputFields.dealsense_health_score).toBe(75);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
