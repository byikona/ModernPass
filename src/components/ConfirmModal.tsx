import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                        onClick={onCancel}
                    />
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                        style={{ width: 270, backgroundColor: 'var(--glass-bg)', backdropFilter: 'saturate(180%) blur(20px)', WebkitBackdropFilter: 'saturate(180%) blur(20px)', borderRadius: 14, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
                    >
                        <div style={{ padding: '20px 16px', textAlign: 'center', borderBottom: '0.5px solid var(--divider)' }}>
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h3>
                            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>{message}</p>
                        </div>
                        <div style={{ display: 'flex', height: 44 }}>
                            <button
                                className="ios-body"
                                style={{ flex: 1, background: 'transparent', border: 'none', borderRight: '0.5px solid var(--divider)', color: 'var(--sys-blue)', cursor: 'pointer', outline: 'none' }}
                                onClick={onCancel}
                            >
                                {cancelText}
                            </button>
                            <button
                                style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 17, fontWeight: 600, color: 'var(--sys-red)', cursor: 'pointer', outline: 'none' }}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
