/**
 * Secure storage utility for encrypting/decrypting sensitive data in localStorage
 * Uses Web Crypto API for encryption
 */

const STORAGE_KEY_PREFIX = "cv_builder_secure_";
const ENCRYPTION_ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;

/**
 * Generate a cryptographic key from a password
 */
async function getEncryptionKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("cv-builder-salt-v1"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a string value
 */
async function encrypt(value: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: ENCRYPTION_ALGORITHM,
      iv,
    },
    key,
    data
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  // Convert to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a string value
 */
async function decrypt(encryptedValue: string, key: CryptoKey): Promise<string> {
  try {
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedValue), (c) => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Generate a device-specific password for encryption
 * This provides basic protection while keeping it client-side
 */
function getDevicePassword(): string {
  const deviceId = localStorage.getItem(`${STORAGE_KEY_PREFIX}device_id`);

  if (deviceId) {
    return deviceId;
  }

  // Generate a new random device ID
  const newDeviceId = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  localStorage.setItem(`${STORAGE_KEY_PREFIX}device_id`, newDeviceId);
  return newDeviceId;
}

/**
 * Store a value securely in localStorage
 */
export async function secureStoreSet(key: string, value: string): Promise<void> {
  try {
    const devicePassword = getDevicePassword();
    const encryptionKey = await getEncryptionKey(devicePassword);
    const encrypted = await encrypt(value, encryptionKey);

    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, encrypted);
  } catch (error) {
    console.error("Failed to securely store value:", error);
    throw new Error("Failed to store value securely");
  }
}

/**
 * Retrieve a securely stored value from localStorage
 */
export async function secureStoreGet(key: string): Promise<string | null> {
  try {
    const encrypted = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!encrypted) {
      return null;
    }

    const devicePassword = getDevicePassword();
    const encryptionKey = await getEncryptionKey(devicePassword);
    return await decrypt(encrypted, encryptionKey);
  } catch (error) {
    console.error("Failed to retrieve secure value:", error);
    return null;
  }
}

/**
 * Remove a securely stored value from localStorage
 */
export function secureStoreRemove(key: string): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
}

/**
 * Check if a secure value exists in localStorage
 */
export function secureStoreHas(key: string): boolean {
  return localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`) !== null;
}

// Specific helpers for Mistral API key
const MISTRAL_API_KEY_STORAGE_KEY = "mistral_api_key";

export async function saveMistralApiKey(apiKey: string): Promise<void> {
  return secureStoreSet(MISTRAL_API_KEY_STORAGE_KEY, apiKey);
}

export async function getMistralApiKey(): Promise<string | null> {
  return secureStoreGet(MISTRAL_API_KEY_STORAGE_KEY);
}

export function removeMistralApiKey(): void {
  secureStoreRemove(MISTRAL_API_KEY_STORAGE_KEY);
}

export function hasMistralApiKey(): boolean {
  return secureStoreHas(MISTRAL_API_KEY_STORAGE_KEY);
}
