import React, { useState, useEffect, useRef } from 'react';
import type { PasswordEntry } from '../types';
import { Search, KeyRound, Copy, Eye, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedEmptyVault = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="var(--sys-gray3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
        <motion.rect x="3" y="3" width="18" height="18" rx="2" ry="2" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
        <motion.path d="M3 3v18l-2 2V1l2 2z" initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 40, damping: 15, delay: 0.8 }} style={{ transformOrigin: "3px 50%" }} />
        <motion.path d="M1 1h2m-2 22h2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
        <motion.circle cx="12" cy="12" r="1" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }} />
        <motion.path d="M12 13v2" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.7 }} />
        <motion.circle cx="8" cy="8" r="0.5" initial={{ y: 0, opacity: 0 }} animate={{ y: -10, opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }} />
        <motion.circle cx="16" cy="10" r="0.5" initial={{ y: 0, opacity: 0 }} animate={{ y: -15, opacity: [0, 1, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 2.5 }} />
        <motion.circle cx="10" cy="16" r="0.5" initial={{ y: 0, opacity: 0 }} animate={{ y: -8, opacity: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 2.2 }} />
    </motion.svg>
);

const AnimatedMenuIcon = ({ children }: { children: React.ReactNode }) => (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
        {children}
    </motion.div>
);

interface PasswordListProps {
    entries: PasswordEntry[];
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}

export const PasswordList: React.FC<PasswordListProps> = ({ entries, onSelect, onDelete }) => {
    const [search, setSearch] = useState('');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, entryId: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredEntries = entries.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.username.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleContextMenu = (e: React.MouseEvent, entryId: string) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            entryId
        });
    };

    const handleCopyPassword = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation();
        const entry = entries.find(e => e.id === entryId);
        if (entry) {
            navigator.clipboard.writeText(entry.passwordStr);
            setContextMenu(null);
        }
    };

    const handleCopyUsername = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation();
        const entry = entries.find(e => e.id === entryId);
        if (entry) {
            navigator.clipboard.writeText(entry.username);
            setContextMenu(null);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }} ref={containerRef}>
            <div style={{ position: 'relative' }}>
                <Search size={20} color="var(--sys-gray)" style={{ position: 'absolute', left: 12, top: 10 }} />
                <input
                    type="text"
                    className="ios-input"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: 40 }}
                />
            </div>

            <div className="ios-list" style={{ position: 'relative' }}>
                {filteredEntries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{ padding: '60px 32px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <AnimatedEmptyVault />
                        <p className="ios-body" style={{ fontWeight: 500, color: 'var(--sys-gray2)' }}>Vault is empty</p>
                    </motion.div>
                ) : (
                    filteredEntries.map(entry => (
                        <div
                            key={entry.id}
                            className="ios-list-item"
                            onClick={() => onSelect(entry.id)}
                            onContextMenu={(e) => handleContextMenu(e, entry.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--sys-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                <KeyRound size={20} color="white" />
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div className="ios-body" style={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {entry.title}
                                </div>
                                <div className="ios-subhead" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {entry.username}
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>
                                            {entry.tags.map(tag => (
                                                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '2px 6px', backgroundColor: 'var(--sys-blue)', borderRadius: 6, fontSize: 10, fontWeight: 600, color: 'white' }}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <AnimatePresence>
                    {contextMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            style={{
                                position: 'fixed',
                                top: contextMenu.y,
                                left: contextMenu.x,
                                backgroundColor: 'var(--bg-secondary)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid var(--divider)',
                                borderRadius: 12,
                                padding: 8,
                                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 180
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="ios-button"
                                style={{ background: 'transparent', color: 'var(--text-primary)', justifyContent: 'flex-start', border: 'none', padding: '10px 12px' }}
                                onClick={(e) => handleCopyUsername(e, contextMenu.entryId)}
                            >
                                <AnimatedMenuIcon><User size={16} style={{ marginRight: 8, color: 'var(--sys-purple)' }} /></AnimatedMenuIcon>
                                Copy Username
                            </button>
                            <button
                                className="ios-button"
                                style={{ background: 'transparent', color: 'var(--text-primary)', justifyContent: 'flex-start', border: 'none', padding: '10px 12px' }}
                                onClick={(e) => handleCopyPassword(e, contextMenu.entryId)}
                            >
                                <AnimatedMenuIcon><Copy size={16} style={{ marginRight: 8, color: 'var(--sys-blue)' }} /></AnimatedMenuIcon>
                                Copy Password
                            </button>
                            <button
                                className="ios-button"
                                style={{ background: 'transparent', color: 'var(--text-primary)', justifyContent: 'flex-start', border: 'none', padding: '10px 12px' }}
                                onClick={(e) => { e.stopPropagation(); onSelect(contextMenu.entryId); setContextMenu(null); }}
                            >
                                <AnimatedMenuIcon><Eye size={16} style={{ marginRight: 8, color: 'var(--sys-gray)' }} /></AnimatedMenuIcon>
                                View Details
                            </button>
                            <button
                                className="ios-button"
                                style={{ background: 'transparent', color: 'var(--sys-red)', justifyContent: 'flex-start', border: 'none', padding: '10px 12px' }}
                                onClick={(e) => { e.stopPropagation(); onDelete(contextMenu.entryId); setContextMenu(null); }}
                            >
                                <AnimatedMenuIcon><Trash2 size={16} style={{ marginRight: 8 }} /></AnimatedMenuIcon>
                                Delete
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
