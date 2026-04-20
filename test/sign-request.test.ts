import test from "node:test";
import "dotenv/config";
import { createApiSignature } from "../src/sign-request.js";

test("createApiSignature: sign deposit-attributions request", async () => {
  const depositTransactionId = "906d24ff5fec512f0df1b95fe0a1a648";
  const timestampEpochSeconds = Math.floor(Date.now() / 1000);
  const httpMethod = "PATCH";
  const httpRequestPath = `/v2/deposit-attributions/${depositTransactionId}`;

  const httpBody = JSON.stringify({
    sourceWalletType: "SELF_HOSTED",
    originatorCountry: "HK",
    originatorName: "BOB",
  });

  const signingKey = process.env.SIGNING_KEY;
  if (!signingKey) throw new Error("SIGNING_KEY is required");

  const sig = createApiSignature({
    signingKey,
    timestampEpochSeconds,
    httpMethod,
    httpRequestPath,
    httpBody,
  });

  console.log("timestamp:", timestampEpochSeconds);
  console.log("signature:", sig);
});

test("createApiSignature: sign create-withdrawal request", async () => {
  const timestampEpochSeconds = Math.floor(Date.now() / 1000);
  const httpMethod = "POST";
  const httpRequestPath = `/v2/transactions/withdrawal`;

  const httpBody = JSON.stringify({
    amount: "1",
    assetType: "ETHHOODI",
    description: "Refund of temporary deposit",
    destination: {
      type: "ADDRESS",
      id: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
    },
    source: {
      type: "WALLET",
      id: "62b40dd019871e85901ab417bb91925c",
    },
    withdrawalAmlQuestionnaire: {
      destinationType: "SELFHOSTED_WALLET",
      originatorType: "MY_ORGANIZATION",
      purpose: "TRADING_SETTLEMENT",
      recipientType: "PERSON",
      recipientLastName: "Li",
      recipientFirstName: "Bob",
      recipientCountry: "HK",
    },
  });
  const signingKey = process.env.SIGNING_KEY;
  if (!signingKey) throw new Error("SIGNING_KEY is required");
  const sig = createApiSignature({
    signingKey,
    timestampEpochSeconds,
    httpMethod,
    httpRequestPath,
    httpBody,
  });
  console.log("timestamp:", timestampEpochSeconds);
  console.log("signature:", sig);
});
