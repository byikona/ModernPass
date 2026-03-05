import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { EncryptedDataPayload } from '../types';

interface SettingsPanelProps {
    vaultData: EncryptedDataPayload;
    onSave: (newData: EncryptedDataPayload) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ vaultData, onSave }) => {
    const settings = vaultData.settings || { theme: 'system', encryptionAlgorithm: 'AES' };
    const [dbPath, setDbPath] = useState<string>('Loading...');

    useEffect(() => {
        if (window.electronAPI?.getDbPath) {
            window.electronAPI.getDbPath().then(setDbPath);
        } else {
            setDbPath('Desktop Environment Required');
        }
    }, []);



    const updateSetting = <K extends keyof NonNullable<EncryptedDataPayload['settings']>>(
        key: K,
        value: NonNullable<EncryptedDataPayload['settings']>[K]
    ) => {
        // Warning: Changing encryption resets the payload, we must re-encrypt instantly with App state 
        // passing down the onSave. 
        onSave({
            ...vaultData,
            settings: { ...settings, [key]: value }
        });
    };

    return (
        <div style={{ padding: '0 16px', paddingBottom: 40 }}>
            <h1 className="ios-title" style={{ marginBottom: 24 }}>Settings</h1>

            {/* Author Profile Badge - Apple ID Style */}
            <div className="ios-list" style={{ marginBottom: 24 }}>
                <a
                    href="https://github.com/byikona"
                    target="_blank"
                    rel="noreferrer"
                    className="ios-list-item"
                    style={{ padding: '12px 16px', gap: 16, textDecoration: 'none', display: 'flex' }}
                >
                    <div style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'var(--sys-gray5)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src="https://github.com/byikona.png" alt="byikona" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', margin: 0 }}>byikona</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Developer Credentials &bull; GitHub</p>
                    </div>
                    <div style={{ color: 'var(--sys-gray3)' }}>
                        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L8 8L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </a>
            </div>

            <div className="ios-list">
                <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px 20px' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Appearance</h3>

                    <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                        <button
                            className={`ios-button ${settings.theme === 'light' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14 }}
                            onClick={() => updateSetting('theme', 'light')}
                        >Light</button>
                        <button
                            className={`ios-button ${settings.theme === 'dark' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14 }}
                            onClick={() => updateSetting('theme', 'dark')}
                        >Grey</button>
                        <button
                            className={`ios-button ${settings.theme === 'amoled' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14 }}
                            onClick={() => updateSetting('theme', 'amoled')}
                        >Amoled</button>
                        <button
                            className={`ios-button ${settings.theme === 'system' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14 }}
                            onClick={() => updateSetting('theme', 'system')}
                        >System</button>
                    </div>
                </div>
            </div>

            <div className="ios-list" style={{ marginTop: 24 }}>
                <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px 20px' }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Encryption Algorithm</h3>
                    <p className="ios-subhead" style={{ marginBottom: 16 }}>
                        Choose the encryption algorithm for your vault. Warning: changing this will re-encrypt your entire database on the next save.
                    </p>

                    <div style={{ display: 'flex', gap: 12, width: '100%', flexWrap: 'wrap' }}>
                        <button
                            className={`ios-button ${settings.encryptionAlgorithm === 'AES-256-PBKDF2' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14, minWidth: '120px' }}
                            onClick={() => updateSetting('encryptionAlgorithm', 'AES-256-PBKDF2')}
                        >AES-256 (Max)</button>
                        <button
                            className={`ios-button ${settings.encryptionAlgorithm === 'AES' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14, minWidth: '120px' }}
                            onClick={() => updateSetting('encryptionAlgorithm', 'AES')}
                        >AES (Legacy)</button>
                        <button
                            className={`ios-button ${settings.encryptionAlgorithm === 'Custom' ? '' : 'ios-button-secondary'}`}
                            style={{ flex: 1, padding: '8px', fontSize: 14, minWidth: '120px' }}
                            onClick={() => updateSetting('encryptionAlgorithm', 'Custom')}
                        >Custom (XOR)</button>
                    </div>
                </div>
            </div>

            <div className="ios-list" style={{ marginTop: 24 }}>
                <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Active Profile</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20" height="20"
                                viewBox="0 0 24 24" fill="none"
                                stroke="var(--sys-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </motion.svg>
                            <span className="ios-subhead" style={{ fontWeight: 600, color: 'var(--sys-blue)' }}>{dbPath.split('\\').pop()?.replace('.mkpsx', '') || dbPath.split('/').pop()?.replace('.mkpsx', '')}</span>
                        </div>
                    </div>

                    <p className="ios-subhead" style={{ marginBottom: 16 }}>
                        To switch or create a different profile, lock the vault and use the Profile Selection screen at startup.
                    </p>

                    <div style={{ width: '100%', backgroundColor: 'var(--sys-gray6)', padding: 12, borderRadius: 12 }}>
                        <p className="ios-subhead" style={{ fontSize: 13, wordBreak: 'break-all', fontFamily: 'monospace', margin: 0, color: 'var(--sys-gray2)' }}>
                            Path: {dbPath}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
