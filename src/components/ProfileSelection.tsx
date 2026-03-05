import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { User, Plus, FolderOpen, ArrowRight } from 'lucide-react';

interface Profile {
    name: string;
    path: string;
}

interface ProfileSelectionProps {
    onSelectProfile: (profile: Profile) => void;
    onCreateProfile: (name: string) => void;
}

export const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelectProfile, onCreateProfile }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        if (window.electronAPI?.getProfiles) {
            const list = await window.electronAPI.getProfiles();
            setProfiles(list);
        } else {
            console.warn('Profiles API not available');
            setProfiles([{ name: 'Local Test Profile', path: 'local' }]);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProfileName.trim()) return;

        if (window.electronAPI?.createProfile) {
            const result = await window.electronAPI.createProfile(newProfileName.trim());
            if (result.success && result.path) {
                onCreateProfile(newProfileName.trim());
                setIsCreating(false);
                setNewProfileName('');
            } else {
                setError(result.error || 'Failed to create profile');
            }
        } else {
            // Browser fallback
            onCreateProfile(newProfileName.trim());
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', padding: 24, margin: '0 auto' }}>
            <div className="titlebar-drag" />

            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                style={{ marginBottom: 40, textAlign: 'center' }}
            >
                <div style={{ backgroundColor: 'var(--sys-purple)', width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <FolderOpen size={32} color="white" />
                </div>
                <h1 className="ios-title">Select Vault</h1>
                <p className="ios-subhead" style={{ marginTop: 8 }}>Choose a profile or create a new one.</p>
            </motion.div>

            {!isCreating ? (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                    {profiles.map(profile => (
                        <motion.button
                            key={profile.path}
                            variants={itemVariants}
                            onClick={() => onSelectProfile(profile)}
                            className="ios-button"
                            style={{
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                justifyContent: 'flex-start',
                                padding: '16px 20px',
                                borderRadius: 16,
                                border: '1px solid var(--divider)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div style={{ backgroundColor: 'var(--sys-blue)', padding: 8, borderRadius: 10, marginRight: 16 }}>
                                <User size={20} color="white" />
                            </div>
                            <span style={{ fontSize: 17, fontWeight: 600 }}>{profile.name}</span>
                        </motion.button>
                    ))}

                    <motion.button
                        variants={itemVariants}
                        onClick={() => setIsCreating(true)}
                        className="ios-button"
                        style={{
                            background: 'transparent',
                            color: 'var(--sys-blue)',
                            border: '1px dashed var(--sys-blue)',
                            marginTop: 16
                        }}
                        whileHover={{ backgroundColor: 'rgba(10, 132, 255, 0.05)' }}
                    >
                        <Plus size={20} style={{ marginRight: 8 }} />
                        Create New Vault
                    </motion.button>
                </motion.div>
            ) : (
                <motion.form
                    onSubmit={handleCreate}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ width: '100%', maxWidth: 360 }}
                >
                    <div className="ios-list">
                        <div className="ios-list-item" style={{ padding: 0 }}>
                            <input
                                type="text"
                                className="ios-input"
                                placeholder="Vault Name (e.g. Work, Personal)"
                                value={newProfileName}
                                onChange={(e) => { setNewProfileName(e.target.value); setError(''); }}
                                autoFocus
                                style={{ borderRadius: 10 }}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--sys-red)', textAlign: 'center', marginTop: -10, marginBottom: 16, fontSize: 13 }}>{error}</p>}

                    <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                        <button type="button" className="ios-button ios-button-secondary" onClick={() => setIsCreating(false)} style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="ios-button" style={{ flex: 1 }} disabled={!newProfileName.trim()}>
                            Create
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.form>
            )}
        </div>
    );
};
