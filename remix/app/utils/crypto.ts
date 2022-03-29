import crypto from 'crypto';

const ENCRYPTION_KEY: string | undefined = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text: string) {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY must be set');
  }

  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY must be set');
  }

  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift() as string, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export { encrypt, decrypt };
