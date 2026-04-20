import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const { decodeBase64, decodeUTF8 } = naclUtil;

function isHex(s: string): boolean {
  return typeof s === "string" && s.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(s);
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export interface CreateApiSignatureParams {
  signingKey: string;
  timestampEpochSeconds: number;
  httpMethod: string;
  httpRequestPath: string;
  httpBody?: string;
}

/**
 * signingKey: Ed25519 secret key (64 bytes) or seed (32 bytes), hex/base64.
 * message: timestamp_epoch_seconds + UPPER(method) + path + body
 */
export function createApiSignature({
  signingKey,
  timestampEpochSeconds,
  httpMethod,
  httpRequestPath,
  httpBody = "",
}: CreateApiSignatureParams): string {
  if (!signingKey) throw new Error("signingKey is required");
  if (!timestampEpochSeconds) throw new Error("timestampEpochSeconds is required");
  if (!httpMethod) throw new Error("httpMethod is required");
  if (!httpRequestPath) throw new Error("httpRequestPath is required");

  const msg = `${timestampEpochSeconds}${String(httpMethod).toUpperCase()}${httpRequestPath}${httpBody}`;
  const messageBytes = decodeUTF8(msg);

  const keyBytes = isHex(signingKey) ? hexToBytes(signingKey) : decodeBase64(signingKey);
  let secretKey: Uint8Array;
  if (keyBytes.length === nacl.sign.secretKeyLength) {
    secretKey = keyBytes;
  } else if (keyBytes.length === 32) {
    secretKey = nacl.sign.keyPair.fromSeed(keyBytes).secretKey;
  } else {
    throw new Error(
      `Invalid signingKey length: got ${keyBytes.length} bytes; expected 32-byte seed or 64-byte secretKey`,
    );
  }

  const sig = nacl.sign.detached(messageBytes, secretKey);
  return bytesToHex(sig);
}

const isMain =
  process.argv[1] != null &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  const timestampEpochSeconds = Math.floor(Date.now() / 1000);
  const httpMethod = "POST";
  const httpRequestPath = "/v1/example";
  const httpBody = JSON.stringify({ hello: "world" });

  const signingKey = process.env.SIGNING_KEY ?? "";
  if (!signingKey) {
    console.error("Set SIGNING_KEY env var (hex or base64).");
    process.exit(2);
  }

  const apiSignature = createApiSignature({
    signingKey,
    timestampEpochSeconds,
    httpMethod,
    httpRequestPath,
    httpBody,
  });

  console.log("Api-Signature:", apiSignature);
  console.log("Timestamp:", timestampEpochSeconds);
}
