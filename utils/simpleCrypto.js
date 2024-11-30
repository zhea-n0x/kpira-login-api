require('dotenv').config();
const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');
const IV_LENGTH = 16; 

if (ENCRYPTION_KEY.length !== 32) {
    throw new Error('Encryption key must be 32 bytes.');
}

// Fungsi Enkripsi
function encrypt(str) {
    const iv = crypto.randomBytes(IV_LENGTH); 

    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(str, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const result = `${iv.toString('base64')}:${encrypted}`;
    return result;
}

// Fungsi Dekripsi
function decrypt(encrypted) {

    try {
        const [ivBase64, encryptedTextBase64] = encrypted.split(':');
        if (!ivBase64 || !encryptedTextBase64) {
            throw new Error('Invalid encrypted data format. Must be "IV:EncryptedText".');
        }

        const iv = Buffer.from(ivBase64, 'base64');
        const encryptedText = Buffer.from(encryptedTextBase64, 'base64');

        if (iv.length !== IV_LENGTH) {
            throw new Error('Invalid IV length: Must be 16 bytes.');
        }

        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

module.exports = { 
    encrypt, 
    decrypt 
};
