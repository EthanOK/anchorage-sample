import { describe, expect, it } from "vitest";
import "dotenv/config";
import { createApiSignature } from "../src/sign-request.js";

describe("createApiSignature", () => {
  it("sign deposit-attributions request", async () => {
    const depositTransactionId = "f9fbc6d89de557729f373fd18843e99e";
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
    expect(sig).toBeTruthy();

    const apiAccessKey = process.env.API_ACCESS_KEY ?? "<API_ACCESS_KEY>";
    const curl = `curl --request ${httpMethod} \\
  --url https://api.anchorage-staging.com${httpRequestPath} \\
  --header 'Api-Access-Key: ${apiAccessKey}' \\
  --header 'Api-Signature: ${sig}' \\
  --header 'Api-Timestamp: ${timestampEpochSeconds}' \\
  --header 'accept: application/json' \\
  --header 'content-type: application/json' \\
  --data '${httpBody}'`;
    console.log(curl);
  });

  it("sign create-withdrawal BTC request", async () => {
    const timestampEpochSeconds = Math.floor(Date.now() / 1000);
    const httpMethod = "POST";
    const httpRequestPath = `/v2/transactions/withdrawal`;

    const requestBody = {
      amount: "0.002",
      assetType: "BTC_S",
      description: "Refund of temporary deposit",
      destination: {
        type: "ADDRESS",
        id: "tb1qup358hl6xfumst8tz4q2l9hjfe7ek253ah0u6z",
      },
      source: {
        type: "WALLET",
        id: "b0a7bf109dc8b553c0f6ea486489a7df",
      },
      withdrawalAmlQuestionnaire: {
        destinationType: "SELFHOSTED_WALLET",
        selfhostedDescription: "AAAA",
        originatorType: "MY_ORGANIZATION",
        purpose: "TRADING_SETTLEMENT",
        recipientType: "PERSON",
        recipientLastName: "Li",
        recipientFirstName: "Bob",
        recipientCountry: "HK",
      },
    };

    // IMPORTANT: signature must match the exact bytes sent in the request body
    const httpBody = JSON.stringify(requestBody, null, 2);
    const signingKey = process.env.SIGNING_KEY;
    if (!signingKey) throw new Error("SIGNING_KEY is required");
    const sig = createApiSignature({
      signingKey,
      timestampEpochSeconds,
      httpMethod,
      httpRequestPath,
      httpBody,
    });
    expect(sig).toBeTruthy();
    const apiAccessKey = process.env.API_ACCESS_KEY ?? "<API_ACCESS_KEY>";
    const curl = `curl --request ${httpMethod} \\
  --url https://api.anchorage-staging.com${httpRequestPath} \\
  --header 'Api-Access-Key: ${apiAccessKey}' \\
  --header 'Api-Signature: ${sig}' \\
  --header 'Api-Timestamp: ${timestampEpochSeconds}' \\
  --header 'accept: application/json' \\
  --header 'content-type: application/json' \\
  --data '${httpBody}'`;

    console.log(curl);
  });

  it("sign create-withdrawal ETH request", async () => {
    const timestampEpochSeconds = Math.floor(Date.now() / 1000);
    const httpMethod = "POST";
    const httpRequestPath = `/v2/transactions/withdrawal`;

    const requestBody = {
      amount: "0.001",
      assetType: "ETHSEP",
      description: "Refund of temporary deposit",
      destination: {
        type: "ADDRESS",
        id: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
      },
      source: {
        type: "WALLET",
        id: "79b79d70bd77e4c5afaec83d891db6b3",
      },
      // useGasStation: true,
      withdrawalAmlQuestionnaire: {
        destinationType: "SELFHOSTED_WALLET",
        selfhostedDescription: "AAAA",
        originatorType: "MY_ORGANIZATION",
        purpose: "TRADING_SETTLEMENT",
        recipientType: "PERSON",
        recipientLastName: "Li",
        recipientFirstName: "Bob",
        recipientCountry: "HK",
      },
    };

    // IMPORTANT: signature must match the exact bytes sent in the request body
    const httpBody = JSON.stringify(requestBody, null, 2);
    const signingKey = process.env.SIGNING_KEY;
    if (!signingKey) throw new Error("SIGNING_KEY is required");
    const sig = createApiSignature({
      signingKey,
      timestampEpochSeconds,
      httpMethod,
      httpRequestPath,
      httpBody,
    });
    expect(sig).toBeTruthy();
    const apiAccessKey = process.env.API_ACCESS_KEY ?? "<API_ACCESS_KEY>";
    const curl = `curl --request ${httpMethod} \\
  --url https://api.anchorage-staging.com${httpRequestPath} \\
  --header 'Api-Access-Key: ${apiAccessKey}' \\
  --header 'Api-Signature: ${sig}' \\
  --header 'Api-Timestamp: ${timestampEpochSeconds}' \\
  --header 'accept: application/json' \\
  --header 'content-type: application/json' \\
  --data '${httpBody}'`;

    console.log(curl);
  });

  it("sign create-withdrawal USDC request", async () => {
    const timestampEpochSeconds = Math.floor(Date.now() / 1000);
    const httpMethod = "POST";
    const httpRequestPath = `/v2/transactions/withdrawal`;

    const requestBody = {
      amount: "0.1",
      assetType: "USDC_SEPOLIA",
      description: "Refund of temporary deposit",
      destination: {
        type: "ADDRESS",
        id: "0x6278A1E803A76796a3A1f7F6344fE874ebfe94B2",
      },
      source: {
        type: "WALLET",
        id: "79b79d70bd77e4c5afaec83d891db6b3",
      },
      // useGasStation: true,
      withdrawalAmlQuestionnaire: {
        destinationType: "SELFHOSTED_WALLET",
        selfhostedDescription: "AAAA",
        originatorType: "MY_ORGANIZATION",
        purpose: "TRADING_SETTLEMENT",
        recipientType: "PERSON",
        recipientLastName: "Li",
        recipientFirstName: "Bob",
        recipientCountry: "HK",
      },
    };

    // IMPORTANT: signature must match the exact bytes sent in the request body
    const httpBody = JSON.stringify(requestBody, null, 2);
    const signingKey = process.env.SIGNING_KEY;
    if (!signingKey) throw new Error("SIGNING_KEY is required");
    const sig = createApiSignature({
      signingKey,
      timestampEpochSeconds,
      httpMethod,
      httpRequestPath,
      httpBody,
    });
    expect(sig).toBeTruthy();
    const apiAccessKey = process.env.API_ACCESS_KEY ?? "<API_ACCESS_KEY>";
    const curl = `curl --request ${httpMethod} \\
  --url https://api.anchorage-staging.com${httpRequestPath} \\
  --header 'Api-Access-Key: ${apiAccessKey}' \\
  --header 'Api-Signature: ${sig}' \\
  --header 'Api-Timestamp: ${timestampEpochSeconds}' \\
  --header 'accept: application/json' \\
  --header 'content-type: application/json' \\
  --data '${httpBody}'`;

    console.log(curl);
  });

  it("sign internal transfer ETH request", async () => {
    const timestampEpochSeconds = Math.floor(Date.now() / 1000);
    const httpMethod = "POST";
    const httpRequestPath = `/v2/transfers`;

    const requestBody = {
      amount: "0.0009",
      assetType: "ETHHOODI",
      destination: {
        type: "WALLET",
        id: "62b40dd019871e85901ab417bb91925c",
      },
      deductFeeFromAmountIfSameType: false,
      source: {
        type: "WALLET",
        id: "213d99a63533952d05515f9f9c34091a",
      },
      useGasStation: true,
    };

    // IMPORTANT: signature must match the exact bytes sent in the request body
    const httpBody = JSON.stringify(requestBody, null, 2);
    const signingKey = process.env.SIGNING_KEY;
    if (!signingKey) throw new Error("SIGNING_KEY is required");
    const sig = createApiSignature({
      signingKey,
      timestampEpochSeconds,
      httpMethod,
      httpRequestPath,
      httpBody,
    });
    expect(sig).toBeTruthy();
    const apiAccessKey = process.env.API_ACCESS_KEY ?? "<API_ACCESS_KEY>";
    const curl = `curl --request ${httpMethod} \\
  --url https://api.anchorage-staging.com${httpRequestPath} \\
  --header 'Api-Access-Key: ${apiAccessKey}' \\
  --header 'Api-Signature: ${sig}' \\
  --header 'Api-Timestamp: ${timestampEpochSeconds}' \\
  --header 'accept: application/json' \\
  --header 'content-type: application/json' \\
  --data '${httpBody}'`;

    console.log(curl);
  });
});
