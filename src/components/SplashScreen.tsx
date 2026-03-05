import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    useEffect(() => {
        // Automatically transition after animation finishes (~3.5s)
        const timer = setTimeout(() => {
            onComplete();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
                backgroundColor: 'var(--bg-primary)',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999
            }}
            className="titlebar-drag"
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--sys-blue)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Outer Shield */}
                <motion.path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    initial={{ pathLength: 0, fill: "rgba(10, 132, 255, 0)" }}
                    animate={{ pathLength: 1, fill: "rgba(10, 132, 255, 0.15)" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Inner Checkmark */}
                <motion.path
                    d="M9 12l2 2 4-4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
                />

                {/* Sparkling dots */}
                <motion.circle cx="12" cy="5" r="0.5" initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0, 0], y: -5 }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                <motion.circle cx="6" cy="10" r="0.5" initial={{ opacity: 0, x: 0 }} animate={{ opacity: [0, 1, 0, 0], x: -5 }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
                <motion.circle cx="18" cy="10" r="0.5" initial={{ opacity: 0, x: 0 }} animate={{ opacity: [0, 1, 0, 0], x: 5 }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} />
            </motion.svg>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2, type: 'spring' }}
                style={{ marginTop: 32, textAlign: 'center' }}
            >
                <h1 className="ios-title" style={{ fontSize: 28, marginBottom: 8, background: 'linear-gradient(90deg, var(--sys-blue), var(--sys-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ModernKeyPass
                </h1>
                <motion.p
                    className="ios-subhead"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2.5 }}
                >
                    best security choice
                </motion.p>
            </motion.div>
        </motion.div>
    );
};
