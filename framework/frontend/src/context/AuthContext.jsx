import { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const initialState = {
  token: localStorage.getItem('access_token') || null,
  role: localStorage.getItem('user_role') || null,
  user: JSON.parse(localStorage.getItem('user_data') || 'null'),
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { token: action.token, role: action.role, user: action.user };
    case 'LOGOUT':
      return { token: null, role: null, user: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_role', data.role);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN', token: data.access_token, role: data.role, user: data.user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout');
    } catch (_) {
      // token sudah tidak valid di server, lanjut cleanup
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
