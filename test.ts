import * as crypto from 'crypto';

const algorithm = 'aes-256-ctr';

export function encryptPhoneNumber(phoneNumber: string) {
  const password = crypto.randomBytes(32); // 256 bits
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, password, iv);
  let encrypted = cipher.update(phoneNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encrypted, password };
}

export function decryptPhoneNumber(encrypted: string, iv: string, password: Buffer): string {
  const decipher = crypto.createDecipheriv(algorithm, password, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const responseEncryptPhone = encryptPhoneNumber('01056713767');
console.log(responseEncryptPhone);
const getPhoneNumber = decryptPhoneNumber(
  responseEncryptPhone['encrypted'],
  responseEncryptPhone['iv'],
  responseEncryptPhone['password'],
  )
console.log(getPhoneNumber);
