import { env } from '@api/env';

import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const key = crypto
  .createHash('sha512')
  .update(env.ENCRYPTION_KEY)
  .digest('hex')
  .substring(0, 32);

function isValidHex(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str);
}

function isEncrypted(data: string): boolean {
  // Check minimum length (32 chars for IV + at least 1 char for encrypted data)
  if (data.length < 33) {
    return false;
  }

  // Check if the first 32 characters (IV) are valid hex
  const iv = data.slice(0, 32);
  if (!isValidHex(iv)) {
    return false;
  }

  // Check if the remaining part (encrypted data) is valid hex
  const encrypted = data.slice(32);
  if (!isValidHex(encrypted)) {
    return false;
  }

  // Additional check: encrypted data length should be a multiple of 32 (AES block size in hex)
  // This is because AES-256-CBC produces output in 16-byte blocks, which is 32 hex characters
  if (encrypted.length % 32 !== 0) {
    return false;
  }

  return true;
}

export function decrypt(data: string) {
  // Check if data is actually encrypted
  if (!isEncrypted(data)) {
    return data; // Return original data if not encrypted
  }

  try {
    // Unpackage the combined iv + encrypted message. Since we are using a fixed
    // size IV, we can hard code the slice length.
    const inputIV = data.slice(0, 32);
    const encrypted = data.slice(32);
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(key),
      Buffer.from(inputIV, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  } catch {
    // If decryption fails, return original data
    // This handles edge cases where data might look encrypted but isn't
    return data;
  }
}
