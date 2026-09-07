import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_ACCOUNTS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('oneye_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('oneye_user', JSON.stringify(user));
    else localStorage.removeItem('oneye_user');
  }, [user]);

  const login = (email, password, role) => {
    const acc = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password && a.role === role
    );
    if (!acc) return { ok: false, error: 'Invalid credentials for selected role' };
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...safe } = acc;
    setUser(safe);
    return { ok: true, user: safe };
  };

  const signup = ({ name, email, role }) => {
    // Mock signup - contributors only per problem statement
    const newUser = {
      id: `u-${role}-${Date.now()}`,
      name,
      email,
      role,
    };
    setUser(newUser);
    return { ok: true, user: newUser };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
