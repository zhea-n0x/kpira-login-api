require('dotenv').config();

const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.SECRET_KEY, 'hex');

if(ENCRYPTION_KEY.length !== 32){
    throw new Error('Encryption Key not valid length!');
}

const IV_LENGTH = 16;

function encrypt(str){
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(str, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return `${iv.toString('base64')}:${encrypted}`;
}

function decrypt(encrypted){
    const [iv, encryptedText] = encrypted.split(':').map(part => Buffer.from(part, 'base64'));
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
}