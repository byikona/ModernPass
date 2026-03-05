import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PasswordEntry, EncryptedDataPayload } from '../types';
import { PasswordList } from './PasswordList';
import { PasswordDetail } from './PasswordDetail';
import { PasswordForm } from './PasswordForm';
import { Plus, LogOut, Shield, KeyRound, Settings as SettingsIcon } from 'lucide-react';
import { SettingsPanel } from './SettingsPanel';

interface DashboardProps {
    vaultData: EncryptedDataPayload;
    onSave: (newData: EncryptedDataPayload) => void;
    onLock: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ vaultData, onSave, onLock }) => {
    const [view, setView] = useState<'list' | 'detail' | 'form' | 'settings'>('list');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedEntry = vaultData.entries.find(e => e.id === selectedId);

    const handleCreate = (newEntry: PasswordEntry) => {
        const newData = { ...vaultData, entries: [...vaultData.entries, newEntry] };
        onSave(newData);
        setView('list');
    };

    const handleUpdate = (updatedEntry: PasswordEntry) => {
        const newData = {
            ...vaultData,
            entries: vaultData.entries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
        };
        onSave(newData);
        setView('list');
    };

    const handleDelete = (id: string) => {
        const newData = {
            ...vaultData,
            entries: vaultData.entries.filter(e => e.id !== id)
        };
        onSave(newData);
        setView('list');
    };

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98, y: 10 },
        in: { opacity: 1, scale: 1, y: 0 },
        out: { opacity: 0, scale: 0.98, y: -10 }
    };



    // Transition variants for normal fading
    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--bg-primary)' }}>
            {/* Left Dock / Sidebar */}
            <div style={{
                width: 250,
                backgroundColor: 'var(--bg-secondary)',
                borderRight: '0.5px solid var(--divider)',
                display: 'flex',
                flexDirection: 'column',
                padding: '40px 12px 20px',
                zIndex: 20,
                WebkitAppRegion: 'drag'
            } as any}>
                <div style={{ padding: '0 12px 24px', display: 'flex', alignItems: 'center', gap: 8, WebkitAppRegion: 'no-drag' } as any}>
                    <Shield size={24} color="var(--sys-blue)" />
                    <span style={{ fontSize: 18, fontWeight: 700 }}>Modern KeyPass</span>
                </div>

                <div style={{ flex: 1, WebkitAppRegion: 'no-drag', display: 'flex', flexDirection: 'column', gap: 4 } as any}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '0 12px 8px', fontWeight: 600 }}>VAULT</div>
                    <button className="ios-button" style={{ width: '100%', justifyContent: 'flex-start', background: view !== 'settings' ? 'var(--sys-blue)' : 'transparent', color: view !== 'settings' ? 'white' : 'var(--text-primary)', padding: '10px 12px', border: 'none', borderRadius: 8, textAlign: 'left', fontWeight: 600 }} onClick={() => setView('list')}>
                        <KeyRound size={18} /> All Items
                    </button>
                    <button className="ios-button" style={{ width: '100%', justifyContent: 'flex-start', background: view === 'settings' ? 'var(--sys-blue)' : 'transparent', color: view === 'settings' ? 'white' : 'var(--text-primary)', padding: '10px 12px', border: 'none', borderRadius: 8, textAlign: 'left', fontWeight: 600 }} onClick={() => setView('settings')}>
                        <SettingsIcon size={18} /> Settings
                    </button>
                </div>

                <div style={{ WebkitAppRegion: 'no-drag' } as any}>
                    <button className="ios-button ios-button-secondary" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--sys-red)' }} onClick={onLock}>
                        <LogOut size={18} /> Lock Vault
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {/* Titlebar/Header */}
                <div className="glass" style={{ position: 'absolute', top: 0, width: '100%', height: 60, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                    <div className="titlebar-drag" style={{ height: 60, top: 0 }} />
                    {view !== 'list' ? (
                        <button className="titlebar-nodrag ios-button ios-button-secondary" style={{ padding: '6px 12px' }} onClick={() => { setView('list'); setSelectedId(null); }}>
                            Back
                        </button>
                    ) : (
                        <div style={{ width: 60 }} />
                    )}
                    <h2 className="ios-header" style={{ margin: 0, position: 'absolute', width: '100%', textAlign: 'center', left: 0, pointerEvents: 'none' }}>
                        {view === 'list' ? 'All Items' : view === 'detail' ? 'Details' : view === 'settings' ? 'Settings' : 'New Entry'}
                    </h2>
                    {view === 'list' ? (
                        <button className="titlebar-nodrag ios-button ios-button-secondary" style={{ padding: '6px 12px' }} onClick={() => { setSelectedId(null); setView('form'); }}>
                            <Plus size={18} /> Add
                        </button>
                    ) : <div style={{ width: 60 }} />}
                </div>

                <div style={{ position: 'relative', flex: 1, paddingTop: 60 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            variants={pageVariants}
                            initial="initial"
                            animate="in"
                            exit="out"
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{ position: 'absolute', width: '100%', height: 'calc(100% - 60px)', padding: 24, overflowY: 'auto' }}
                        >
                            <div style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}>
                                {view === 'list' && (
                                    <PasswordList
                                        entries={vaultData.entries}
                                        onSelect={(id) => { setSelectedId(id); setView('detail'); }}
                                        onDelete={handleDelete}
                                    />
                                )}
                                {view === 'detail' && selectedEntry && (
                                    <PasswordDetail
                                        entry={selectedEntry}
                                        onEdit={() => setView('form')}
                                        onDelete={() => handleDelete(selectedEntry.id)}
                                    />
                                )}
                                {view === 'form' && (
                                    <PasswordForm
                                        entry={selectedId ? selectedEntry : undefined}
                                        onSave={selectedId ? handleUpdate : handleCreate}
                                        onCancel={() => { setView(selectedId ? 'detail' : 'list'); if (!selectedId) setSelectedId(null); }}
                                    />
                                )}
                                {view === 'settings' && (
                                    <SettingsPanel vaultData={vaultData} onSave={onSave} />
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
