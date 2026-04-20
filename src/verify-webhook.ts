/**
 * Webhook / 回调验签（与常见「在线 Ed25519 校验」表单项对应）
 *
 * - Message：原始 HTTP body 文本（UTF-8），与 Anchorage 发给你的 raw 一致
 * - Public key：验证密钥，Hex（32 字节公钥 = 64 个十六进制字符）
 * - Signature：Api-Signature，支持 Hex（128 字符）或 Base64（88 字符左右）
 *
 * 用法示例：
 *   WEBHOOK_MESSAGE='{"type":"..."}' WEBHOOK_PUBLIC_KEY=abcd... WEBHOOK_SIGNATURE=... npx tsx src/verify-webhook.ts
 *
 * 或从 .env（dotenv）读取同名变量；也可管道传入 body：
 *   cat body.json | WEBHOOK_PUBLIC_KEY=... WEBHOOK_SIGNATURE=... npx tsx src/verify-webhook.ts
 */
import "dotenv/config";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

const { decodeBase64, decodeUTF8 } = naclUtil;

export interface VerifyWebhookParams {
  message: string;
  publicKeyHex: string;
  signature: string;
}

export function verifyWebhookMessage({ message, publicKeyHex, signature }: VerifyWebhookParams): boolean {
  const publicKey = parsePublicKeyHex(publicKeyHex);
  const sigBytes = parseSignature(signature);
  const messageBytes = decodeUTF8(message);
  return nacl.sign.detached.verify(messageBytes, sigBytes, publicKey);
}

function isHex(s: string): boolean {
  return typeof s === "string" && s.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(s);
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function normalizeWhitespace(s: string): string {
  return String(s).replace(/\s+/g, "").trim();
}

function strip0x(s: string): string {
  const t = s.trim();
  if (t.startsWith("0x") || t.startsWith("0X")) return t.slice(2);
  return t;
}

/** 解析签名：优先 Hex（64 字节），否则按 Base64 */
function parseSignature(sig: string): Uint8Array {
  let raw = normalizeWhitespace(sig);
  raw = strip0x(raw);
  if (!raw) throw new Error("SIGNATURE 为空");
  if (raw.length === 128 && isHex(raw)) return hexToBytes(raw);
  const b64 = decodeBase64(raw);
  if (b64.length !== nacl.sign.signatureLength) {
    throw new Error(
      `签名解码后长度应为 ${nacl.sign.signatureLength} 字节，当前为 ${b64.length}（请确认是 Hex 或 Base64 的 Api-Signature）`,
    );
  }
  return b64;
}

/** 公钥：Hex，32 字节 */
function parsePublicKeyHex(hex: string): Uint8Array {
  let raw = normalizeWhitespace(hex);
  raw = strip0x(raw);
  if (!raw) throw new Error("PUBLIC_KEY 为空");
  if (!isHex(raw)) throw new Error("PUBLIC_KEY 应为十六进制字符串");
  const bytes = hexToBytes(raw);
  if (bytes.length !== nacl.sign.publicKeyLength) {
    throw new Error(
      `公钥长度应为 ${nacl.sign.publicKeyLength} 字节（${nacl.sign.publicKeyLength * 2} 个 hex 字符），当前为 ${bytes.length} 字节`,
    );
  }
  return bytes;
}
