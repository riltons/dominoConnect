import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'organizador';
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Aqui vamos verificar se existe uma sessão ativa
    loadStoredUser();
    // Carregar o total de usuários do Supabase
    loadTotalUsers();
  }, []);

  async function loadStoredUser() {
    try {
      // TODO: Implementar verificação de sessão com Supabase
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function loadTotalUsers() {
    try {
      // TODO: Implementar contagem de usuários com Supabase
      // Por enquanto, vamos usar um valor mockado
      setTotalUsers(0);
    } catch (error) {
      console.error('Erro ao carregar total de usuários:', error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      // TODO: Implementar login com Supabase
      // Exemplo de usuário mockado
      setUser({
        id: '1',
        name: 'Usuário Teste',
        email: email,
        role: 'organizador',
      });
    } catch (error) {
      throw error;
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      // TODO: Implementar registro com Supabase
      // O primeiro usuário será administrador, os demais serão organizadores
      const role = totalUsers === 0 ? 'administrador' : 'organizador';
      
      // Exemplo de usuário mockado
      setUser({
        id: '1',
        name: name,
        email: email,
        role: role,
      });

      // Incrementar o total de usuários
      setTotalUsers(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      // TODO: Implementar logout com Supabase
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
