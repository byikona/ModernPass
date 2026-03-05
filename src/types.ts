export interface PasswordEntry {
    id: string;
    title: string;
    username: string;
    passwordStr: string;
    notes?: string;
    tags?: string[];
    createdAt: number;
}

export interface EncryptedDataPayload {
    hash: string;
    entries: PasswordEntry[];
    settings?: {
        theme: 'light' | 'dark' | 'system' | 'amoled';
        encryptionAlgorithm: 'AES' | 'AES-256-PBKDF2' | 'Custom';
    };
}
