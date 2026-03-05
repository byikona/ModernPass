
import { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { SplashScreen } from './components/SplashScreen';
import { ProfileSelection } from './components/ProfileSelection';
import { loadEncryptedFile, saveEncryptedFile } from './utils/storage';
import { encryptData, decryptData, hashPassword, verifyPassword } from './utils/crypto';
import type { EncryptedDataPayload } from './types';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [appState, setAppState] = useState<'splash' | 'profile' | 'auth' | 'dashboard'>('splash');

  const [isRegistered, setIsRegistered] = useState(false);
  const [vaultData, setVaultData] = useState<EncryptedDataPayload | null>(null);
  const [masterPassword, setMasterPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const applyTheme = (themeStr: 'light' | 'dark' | 'system' | 'amoled' = 'system') => {
    let mode = themeStr;
    if (mode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', mode);
  }

  const handleSplashComplete = () => {
    setAppState('profile');
  };

  const handleSelectProfile = async (profile: { name: string, path: string }) => {
    if (window.electronAPI?.setActiveProfile) {
      await window.electronAPI.setActiveProfile(profile.path);
    }

    // Check if vault exists/has data
    const data = await loadEncryptedFile();
    if (data) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }
    setAppState('auth');
  };

  const handleCreateProfile = async (name: string) => {
    // Profile file was already created by the child component using IPC, or we're in browser fallback.
    // We just need to select it.
    if (window.electronAPI?.getProfiles) {
      const profiles = await window.electronAPI.getProfiles();
      const newlyCreated = profiles.find(p => p.name === name);
      if (newlyCreated) {
        await handleSelectProfile(newlyCreated);
        return;
      }
    }

    // Fallback if APIs fail or browser mode
    handleSelectProfile({ name, path: 'local' });
  };

  const handleRegister = async (password: string) => {
    const newVault: EncryptedDataPayload = {
      hash: hashPassword(password),
      entries: [],
      settings: { theme: 'system', encryptionAlgorithm: 'AES' }
    };
    const encrypted = encryptData(newVault, password, newVault.settings?.encryptionAlgorithm);
    const success = await saveEncryptedFile(encrypted);

    if (success) {
      setMasterPassword(password);
      setVaultData(newVault);
      setIsRegistered(true);
      setAppState('dashboard');
      applyTheme(newVault.settings?.theme);
    } else {
      setAuthError('Failed to create vault.');
    }
  };

  const handleUnlock = async (password: string) => {
    const data = await loadEncryptedFile();
    if (!data) {
      setAuthError('Vault empty or missing.');
      return;
    }
    const decrypted = decryptData(data, password);
    if (decrypted && verifyPassword(password, decrypted.hash)) {
      setMasterPassword(password);

      // Safety defaults if migrating from older schema
      if (!decrypted.settings) {
        decrypted.settings = { theme: 'system', encryptionAlgorithm: 'AES' };
      }

      setVaultData(decrypted);
      setAppState('dashboard');
      setAuthError('');
      applyTheme(decrypted.settings.theme);
    } else {
      setAuthError('Incorrect password or corrupted data.');
    }
  };

  const handleSaveVault = async (newData: EncryptedDataPayload) => {
    setVaultData(newData);
    const algo = newData.settings?.encryptionAlgorithm || 'AES';
    const encrypted = encryptData(newData, masterPassword, algo);
    await saveEncryptedFile(encrypted);
    if (newData.settings?.theme) {
      applyTheme(newData.settings.theme);
    }
  };

  const handleLock = () => {
    setAppState('auth');
    setVaultData(null);
    setMasterPassword('');
  };

  const handleBackToProfiles = () => {
    setAppState('profile');
    setVaultData(null);
    setMasterPassword('');
    setIsRegistered(false);
    setAuthError('');
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {appState === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {appState === 'profile' && (
          <ProfileSelection
            key="profile"
            onSelectProfile={handleSelectProfile}
            onCreateProfile={handleCreateProfile}
          />
        )}

        {appState === 'auth' && (
          <div key="auth" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <AuthScreen
              isRegistered={isRegistered}
              onUnlock={handleUnlock}
              onRegister={handleRegister}
              error={authError}
              onBack={handleBackToProfiles}
            />
          </div>
        )}

        {appState === 'dashboard' && (
          <Dashboard
            key="dashboard"
            vaultData={vaultData!}
            onSave={handleSaveVault}
            onLock={handleLock}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
