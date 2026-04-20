import test from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { verifyWebhookMessage } from "../src/verify-webhook.js";

test("verifyWebhookMessage: hex 签名通过", () => {
  const message = JSON.stringify({
    payload:
      "eyJ0cmFuc2FjdGlvbklkIjoiOTA2ZDI0ZmY1ZmVjNTEyZjBkZjFiOTVmZTBhMWE2NDgifQ==",
    timestamp: 1776306245,
    message_id: "979ad176-6ba3-470d-ae1d-230cbf13c9c4",
    event_type: "deposit.pending-attribution",
  });
  const publicKeyHex = process.env.WEBHOOK_PUBLIC_KEY;
  if (!publicKeyHex) throw new Error("WEBHOOK_PUBLIC_KEY is required");
  const signature =
    "bc0d76c0c1e570fee62c40623b203ab51f928b6d79f110dd0993e5159cdb065b4f1489d2b85cfee810507884dbfec6e2a056655daee50d7bd6d2fb3786446a0e";
  const ok = verifyWebhookMessage({
    message,
    publicKeyHex,
    signature,
  });
  assert.equal(ok, true);
});
