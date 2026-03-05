import CryptoJS from 'crypto-js';

export type EncryptionAlgorithm = 'AES' | 'AES-256-PBKDF2' | 'Custom';

// Custom encryption algorithm (Legacy)
const customEncrypt = (text: string, key: string): string => {
    let xorResult = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        xorResult += String.fromCharCode(charCode);
    }
    return btoa(xorResult).split('').reverse().join('');
};

const customDecrypt = (encrypted: string, key: string): string | null => {
    try {
        const unreversed = encrypted.split('').reverse().join('');
        const decoded = atob(unreversed);
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
            const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    } catch {
        return null;
    }
};

// Maximum Security Encryption
const maximumEncrypt = (text: string, rootKey: string): string => {
    // Generate Random Salt and IV
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    // Derive 256-bit key using PBKDF2 with 100,000 iterations
    const key = CryptoJS.PBKDF2(rootKey, salt, {
        keySize: 256 / 32,
        iterations: 100000
    });

    // Encrypt payload
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });

    // Pack: Salt + IV + Ciphertext
    return salt.toString() + iv.toString() + encrypted.toString();
};

const maximumDecrypt = (packedData: string, rootKey: string): string | null => {
    try {
        // Unpack: Salt (32 hex chars) + IV (32 hex chars) + Ciphertext
        const saltHex = packedData.substring(0, 32);
        const ivHex = packedData.substring(32, 64);
        const ciphertext = packedData.substring(64);

        const salt = CryptoJS.enc.Hex.parse(saltHex);
        const iv = CryptoJS.enc.Hex.parse(ivHex);

        const key = CryptoJS.PBKDF2(rootKey, salt, {
            keySize: 256 / 32,
            iterations: 100000
        });

        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
        return null;
    }
};

export const encryptData = (data: any, rootKey: string, algorithm: EncryptionAlgorithm = 'AES-256-PBKDF2'): string => {
    const jsonStr = JSON.stringify({ ...data, _algo: algorithm });

    if (algorithm === 'Custom') {
        return customEncrypt(jsonStr, rootKey);
    } else if (algorithm === 'AES') {
        return CryptoJS.AES.encrypt(jsonStr, rootKey).toString();
    }

    // Default to strongest encryption
    return maximumEncrypt(jsonStr, rootKey);
};

export const decryptData = (encryptedData: string, rootKey: string): any => {
    let decryptedStr: string | null = null;

    // Try New Maximum Security First
    decryptedStr = maximumDecrypt(encryptedData, rootKey);

    // Try Basic AES
    if (!decryptedStr) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, rootKey);
            decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
        } catch { }
    }

    // Try Custom Fallback
    if (!decryptedStr) {
        decryptedStr = customDecrypt(encryptedData, rootKey);
    }

    if (!decryptedStr) {
        console.error('Decryption failed for all known algorithms');
        return null;
    }

    try {
        return JSON.parse(decryptedStr);
    } catch {
        return null;
    }
};

export const verifyPassword = (password: string, hash: string): boolean => {
    return CryptoJS.SHA256(password).toString() === hash;
};

export const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString();
};
