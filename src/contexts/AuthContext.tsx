import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

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

  useEffect(() => {
    loadStoredUser();

    // Escutar mudanças na autenticação
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (!profileError && profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email!,
            role: profile.role,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
  }, []);

  async function loadStoredUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: session.user.id,
          name: profile.name,
          email: session.user.email!,
          role: profile.role,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: session.user.id,
          name: profile.name,
          email: session.user.email!,
          role: profile.role,
        });
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', error.message || 'Não foi possível fazer login');
      throw error;
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      // 1. Verificar se já existem usuários para determinar o papel
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      const role = count === 0 ? 'administrador' : 'organizador';

      // 2. Criar o usuário no auth
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        }
      });

      if (signUpError) throw signUpError;
      if (!newUser) throw new Error('Não foi possível criar o usuário');

      // 3. Criar o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          auth_id: newUser.id,
          name,
          role,
        });

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        throw profileError;
      }

      // 4. Fazer login automaticamente após o registro
      await signIn(email, password);

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
      throw error;
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', error.message || 'Não foi possível fazer logout');
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
