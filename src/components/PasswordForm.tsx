import React, { useState } from 'react';
import type { PasswordEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedPen = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--sys-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 24px', display: 'block' }}>
        <motion.path d="M12 20h9" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }} />
        <motion.path
            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
            initial={{ pathLength: 0, opacity: 0, x: 10, y: -10 }}
            animate={{ pathLength: 1, opacity: 1, x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 40, damping: 10, delay: 0.2, duration: 1.5 }}
        />
        <motion.path d="M15 5l4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.0 }} />
    </motion.svg>
);

interface PasswordFormProps {
    entry?: PasswordEntry;
    onSave: (entry: PasswordEntry) => void;
    onCancel: () => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({ entry, onSave, onCancel }) => {
    const [title, setTitle] = useState(entry?.title || '');
    const [username, setUsername] = useState(entry?.username || '');
    const [passwordStr, setPasswordStr] = useState(entry?.passwordStr || '');
    const [notes, setNotes] = useState(entry?.notes || '');
    const [tagsInput, setTagsInput] = useState(entry?.tags?.join(' ') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !username || !passwordStr) return;

        const newEntry: PasswordEntry = {
            id: entry?.id || crypto.randomUUID(),
            title,
            username,
            passwordStr,
            notes,
            tags: tagsInput ? tagsInput.split(' ').map(t => t.trim()).filter(Boolean) : [],
            createdAt: entry?.createdAt || Date.now()
        };
        onSave(newEntry);
    };

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let res = '';
        for (let i = 0; i < 16; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPasswordStr(res);
    };

    const toggleTag = (tagToToggle: string) => {
        const currentTags = tagsInput.split(' ').filter(Boolean);
        if (currentTags.includes(tagToToggle)) {
            setTagsInput(currentTags.filter(t => t !== tagToToggle).join(' '));
        } else {
            setTagsInput([...currentTags, tagToToggle].join(' '));
        }
    };

    const renderTagsUI = () => {
        const tags = tagsInput.split(' ').filter(Boolean);

        return (
            <div className="ios-list-item" style={{ padding: '12px 16px', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <input
                    type="text"
                    className="ios-input"
                    placeholder="Tags (space separated, e.g. work personal)"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    style={{ padding: 0 }}
                />

                {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        <AnimatePresence>
                            {tags.map((tag, idx) => (
                                <motion.div
                                    key={`${tag}-${idx}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    style={{
                                        backgroundColor: 'var(--sys-blue)',
                                        color: 'white',
                                        padding: '4px 10px',
                                        borderRadius: 8,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 6px rgba(10, 132, 255, 0.3)'
                                    }}
                                    onClick={() => toggleTag(tag)}
                                >
                                    #{tag}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
            <AnimatedPen />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.1 }}
                className="ios-list" style={{ marginTop: 0 }}
            >
                <div className="ios-list-item" style={{ padding: 0 }}>
                    <input
                        type="text"
                        className="ios-input"
                        placeholder="Title (e.g. Google, GitHub)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ borderRadius: '10px 10px 0 0' }}
                        required
                        autoFocus
                    />
                </div>
                <div className="ios-list-item" style={{ padding: 0 }}>
                    <input
                        type="text"
                        className="ios-input"
                        placeholder="Username / Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ borderRadius: 0 }}
                        required
                    />
                </div>
                <div className="ios-list-item" style={{ padding: 0 }}>
                    <input
                        type="text"
                        className="ios-input"
                        placeholder="Password"
                        value={passwordStr}
                        onChange={(e) => setPasswordStr(e.target.value)}
                        style={{ borderRadius: '0 0 10px 10px' }}
                        required
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
            >
                <button type="button" className="ios-button ios-button-secondary" onClick={generatePassword} style={{ width: '100%' }}>
                    Generate Strong Password
                </button>
            </motion.div>

            <motion.div
                className="ios-list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.3 }}
            >
                {renderTagsUI()}
            </motion.div>

            <motion.div
                className="ios-list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.4 }}
            >
                <div className="ios-list-item" style={{ padding: 0 }}>
                    <textarea
                        className="ios-input"
                        placeholder="Notes (optional)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{ minHeight: 120, resize: 'vertical' }}
                    />
                </div>
            </motion.div>

            <motion.div
                style={{ display: 'flex', gap: 16, marginTop: 16 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.5 }}
            >
                <button type="button" className="ios-button ios-button-secondary" onClick={onCancel} style={{ flex: 1 }}>
                    Cancel
                </button>
                <button type="submit" className="ios-button" style={{ flex: 2 }} disabled={!title || !username || !passwordStr}>
                    Save
                </button>
            </motion.div>
        </form>
    );
};
