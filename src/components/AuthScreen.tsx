import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const AnimatedLock = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <motion.path
            d="M7 11V7a5 5 0 0 1 10 0v4"
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
        />
        <motion.rect x="5" y="11" width="14" height="10" rx="2" ry="2" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.1 }} />
        <motion.circle cx="12" cy="16" r="1" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }} />
    </motion.svg>
);

const AnimatedShield = () => (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" initial={{ pathLength: 0, fill: "rgba(255,255,255,0)" }} animate={{ pathLength: 1, fill: "rgba(255,255,255,0.2)" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }} />
        <motion.path d="M9 12l2 2 4-4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }} />
    </motion.svg>
);

interface AuthScreenProps {
    isRegistered: boolean;
    onUnlock: (password: string) => void;
    onRegister: (password: string) => void;
    error?: string;
    onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ isRegistered, onUnlock, onRegister, error, onBack }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isRegistered) {
            if (password !== confirmPassword) {
                setLocalError('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                setLocalError('Password must be at least 6 characters');
                return;
            }
            onRegister(password);
        } else {
            onUnlock(password);
        }
    };

    return (
        <motion.div
            className="auth-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 90, damping: 24, mass: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', padding: 24, margin: '0 auto' }}
        >
            <div className="titlebar-drag" />

            <motion.button
                onClick={onBack}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="ios-button"
                style={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    background: 'transparent',
                    color: 'var(--sys-blue)',
                    padding: '8px 12px',
                    zIndex: 10
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Back
                </div>
            </motion.button>

            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
                style={{ marginBottom: 40, textAlign: 'center' }}
            >
                <div style={{ backgroundColor: 'var(--sys-blue)', width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    {isRegistered ? <AnimatedLock /> : <AnimatedShield />}
                </div>
                <h1 className="ios-title">{isRegistered ? 'Welcome Back' : 'Setup Master Password'}</h1>
                <p className="ios-subhead" style={{ marginTop: 8 }}>
                    {isRegistered ? 'Enter your master password to unlock.' : 'Create a strong master password to encrypt your vault.'}
                </p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                className="titlebar-nodrag"
                style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 20 }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.4 }}
            >
                <div className="ios-list">
                    <div className="ios-list-item" style={{ padding: 0 }}>
                        <input
                            type="password"
                            className="ios-input"
                            placeholder="Master Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
                            autoFocus
                            style={{ borderRadius: 10 }}
                        />
                    </div>
                </div>
                {!isRegistered && (
                    <div className="ios-list" style={{ marginTop: -8 }}>
                        <div className="ios-list-item" style={{ padding: 0 }}>
                            <input
                                type="password"
                                className="ios-input"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(''); }}
                                style={{ borderRadius: 10 }}
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {(error || localError) && (
                        <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ color: 'var(--sys-red)', fontSize: 13, textAlign: 'center', margin: 0 }}
                        >
                            {error || localError}
                        </motion.p>
                    )}
                </AnimatePresence>

                <button type="submit" className="ios-button" style={{ marginTop: 8 }}>
                    {isRegistered ? 'Unlock Vault' : 'Create Vault'}
                    <ArrowRight size={18} />
                </button>
            </motion.form>
        </motion.div>
    );
};
