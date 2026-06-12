import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

const STORAGE_KEY = 'surgeiq_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState(null);

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const signup = useCallback(({ name, email, password }) => {
    // Check if email already registered (mock)
    const existingRaw = localStorage.getItem('surgeiq_users_db');
    const usersDb = existingRaw ? JSON.parse(existingRaw) : {};

    if (usersDb[email]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      joinedAt: new Date().toISOString(),
      ridesEstimated: 0,
      avatarColor: generateAvatarColor(email),
      rideHistory: [],
      apiKeys: [],
    };

    // Save to "users db"
    usersDb[email] = { ...newUser, password };
    localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));

    setUser(newUser);
    setAuthError(null);
    return { success: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    const existingRaw = localStorage.getItem('surgeiq_users_db');
    const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
    const record = usersDb[email.toLowerCase().trim()];

    if (!record) {
      return { success: false, error: 'No account found with this email.' };
    }
    if (record.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const { password: _pw, ...safeUser } = record;
    // Backwards compatibility for accounts created without fields
    if (!safeUser.rideHistory) safeUser.rideHistory = [];
    if (!safeUser.apiKeys) safeUser.apiKeys = [];
    
    setUser(safeUser);
    setAuthError(null);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthError(null);
  }, []);

  const incrementRides = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ridesEstimated: (prev.ridesEstimated || 0) + 1 };
      // Also update the DB record
      try {
        const existingRaw = localStorage.getItem('surgeiq_users_db');
        const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
        if (usersDb[prev.email]) {
          usersDb[prev.email].ridesEstimated = updated.ridesEstimated;
          localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
        }
      } catch {}
      return updated;
    });
  }, []);

  const updateProfile = useCallback(({ name, password }) => {
    let success = false;
    let error = null;
    setUser(prev => {
      if (!prev) return prev;
      try {
        const existingRaw = localStorage.getItem('surgeiq_users_db');
        const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
        if (usersDb[prev.email]) {
          usersDb[prev.email].name = name.trim();
          if (password) {
            usersDb[prev.email].password = password;
          }
          localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
          success = true;
          return { ...prev, name: name.trim() };
        } else {
          error = 'User not found in database.';
        }
      } catch (e) {
        error = e.message;
      }
      return prev;
    });
    return { success, error };
  }, []);

  const addRideToHistory = useCallback((ride) => {
    setUser(prev => {
      if (!prev) return prev;
      const newRide = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        ...ride
      };
      const rideHistory = [newRide, ...(prev.rideHistory || [])];
      const updated = {
        ...prev,
        ridesEstimated: (prev.ridesEstimated || 0) + 1,
        rideHistory
      };
      try {
        const existingRaw = localStorage.getItem('surgeiq_users_db');
        const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
        if (usersDb[prev.email]) {
          usersDb[prev.email].ridesEstimated = updated.ridesEstimated;
          usersDb[prev.email].rideHistory = updated.rideHistory;
          localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
        }
      } catch {}
      return updated;
    });
  }, []);

  const clearRideHistory = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, rideHistory: [] };
      try {
        const existingRaw = localStorage.getItem('surgeiq_users_db');
        const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
        if (usersDb[prev.email]) {
          usersDb[prev.email].rideHistory = [];
          localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
        }
      } catch {}
      return updated;
    });
  }, []);

  const generateApiKey = useCallback((keyName = 'Default Key') => {
    setUser(prev => {
      if (!prev) return prev;
      const newKey = {
        id: Math.random().toString(36).substring(2, 9),
        name: keyName.trim() || 'API Key',
        key: `sq_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
        createdAt: new Date().toISOString(),
      };
      const apiKeys = [...(prev.apiKeys || []), newKey];
      const updated = { ...prev, apiKeys };
      try {
        const existingRaw = localStorage.getItem('surgeiq_users_db');
        const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
        if (usersDb[prev.email]) {
          usersDb[prev.email].apiKeys = updated.apiKeys;
          localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
        }
      } catch {}
      return updated;
    });
  }, []);

  const revokeApiKey = useCallback((keyId) => {
    setUser(prev => {
      if (!prev) return prev;
      const apiKeys = (prev.apiKeys || []).filter(k => k.id !== keyId);
      const updated = { ...prev, apiKeys };
      try {
        const existingRaw = localStorage.getItem('surgeiq_users_db');
        const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
        if (usersDb[prev.email]) {
          usersDb[prev.email].apiKeys = updated.apiKeys;
          localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
        }
      } catch {}
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      authError,
      setAuthError,
      incrementRides,
      updateProfile,
      addRideToHistory,
      clearRideHistory,
      generateApiKey,
      revokeApiKey
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Deterministic avatar color from email string
function generateAvatarColor(email) {
  const palette = [
    '#1DB954', '#00f3ff', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#10B981', '#F97316',
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
