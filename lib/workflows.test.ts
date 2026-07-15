import { describe, expect, it, beforeEach } from "vitest";
import { extractWorkflow } from "./workflows";

// These tests exercise the deterministic (non-Gemini) fallback path, since
// no GEMINI_API_KEY is set in the test environment. This is exactly the path
// that runs live during a demo if the Gemini call fails or times out, so it
// deserves direct coverage, not just "hope the AI never errors."
describe("extractWorkflow (deterministic fallback)", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("classifies a leave request as HR / Leave Request", async () => {
    const result = await extractWorkflow("I need two days of leave next week, I have a fever.");
    expect(result.department).toBe("Human Resources");
    expect(result.requestType).toBe("Leave Request");
    expect(result.requiredApprover).toBe("Meera Iyer");
  });

  it("classifies an expense/invoice request as Finance", async () => {
    const result = await extractWorkflow("Need vendor invoice approval by today for 18 lakh renewal.");
    expect(result.department).toBe("Finance");
    expect(result.requestType).toBe("Finance Approval");
  });

  it("flags urgent language as urgent priority", async () => {
    const result = await extractWorkflow("This is urgent, production is down and I need access immediately.");
    expect(result.priority).toBe("urgent");
  });

  it("falls back to low priority when no urgency language is present", async () => {
    const result = await extractWorkflow("Just a general question about office supplies.");
    expect(result.priority).toBe("low");
  });

  it("truncates very long summaries to 140 characters with an ellipsis", async () => {
    const longText = "a".repeat(200);
    const result = await extractWorkflow(longText);
    expect(result.summary.length).toBeLessThanOrEqual(140);
    expect(result.summary.endsWith("...")).toBe(true);
  });

  it("defaults to Operations department when nothing matches known keywords", async () => {
    const result = await extractWorkflow("Please review the new office plant arrangement.");
    expect(result.department).toBe("Operations");
    expect(result.requiredApprover).toBe("Dev Malhotra");
  });
});
