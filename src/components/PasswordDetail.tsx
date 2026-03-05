import React, { useState } from 'react';
import type { PasswordEntry } from '../types';
import { Copy, Eye, EyeOff, Edit3, Trash2, Tag } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface PasswordDetailProps {
    entry: PasswordEntry;
    onEdit: () => void;
    onDelete: () => void;
}

export const PasswordDetail: React.FC<PasswordDetailProps> = ({ entry, onEdit, onDelete }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40, maxWidth: 600, margin: '0 auto' }}>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Password"
                message="Are you sure you want to delete this password? This action cannot be undone."
                confirmText="Delete"
                onConfirm={() => {
                    setIsDeleteModalOpen(false);
                    onDelete();
                }}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            {/* Header Info */}
            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <div style={{ backgroundColor: 'var(--sys-blue)', width: 80, height: 80, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32, fontWeight: 600, color: 'white' }}>
                    {entry.title.charAt(0).toUpperCase()}
                </div>
                <h1 className="ios-title">{entry.title}</h1>
            </div>

            <div className="ios-list">
                <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="ios-subhead">Username</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: 4 }}>
                        <span className="ios-body">{entry.username}</span>
                        <button
                            className="ios-button ios-button-secondary"
                            style={{ padding: '6px 10px', fontSize: 13, borderRadius: 8 }}
                            onClick={() => handleCopy(entry.username, 'username')}
                        >
                            {copied === 'username' ? 'Copied' : <Copy size={16} />}
                        </button>
                    </div>
                </div>

                <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="ios-subhead">Password</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: 4 }}>
                        <span className="ios-body" style={{ letterSpacing: showPassword ? 'normal' : 4, fontFamily: showPassword ? 'inherit' : 'monospace' }}>
                            {showPassword ? entry.passwordStr : '••••••••••••'}
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                className="ios-button ios-button-secondary"
                                style={{ padding: '6px 10px', fontSize: 13, borderRadius: 8 }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                                className="ios-button ios-button-secondary"
                                style={{ padding: '6px 10px', fontSize: 13, borderRadius: 8 }}
                                onClick={() => handleCopy(entry.passwordStr, 'password')}
                            >
                                {copied === 'password' ? 'Copied' : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {entry.notes && (
                <div className="ios-list">
                    <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="ios-subhead">Notes</span>
                        <span className="ios-body" style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{entry.notes}</span>
                    </div>
                </div>
            )}

            {entry.tags && entry.tags.length > 0 && (
                <div className="ios-list">
                    <div className="ios-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="ios-subhead">Tags</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                            {entry.tags.map((tag, idx) => (
                                <div key={idx} style={{ padding: '4px 10px', backgroundColor: 'var(--sys-blue)', color: 'white', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Tag size={12} /> {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 16 }}>
                <button
                    className="ios-button"
                    style={{ flex: 1, backgroundColor: 'var(--sys-gray5)', color: 'var(--sys-blue)' }}
                    onClick={onEdit}
                >
                    <Edit3 size={18} /> Edit
                </button>
                <button
                    className="ios-button"
                    style={{ flex: 1, backgroundColor: 'var(--sys-red)' }}
                    onClick={() => setIsDeleteModalOpen(true)}
                >
                    <Trash2 size={18} /> Delete
                </button>
            </div>
        </div>
    );
};
