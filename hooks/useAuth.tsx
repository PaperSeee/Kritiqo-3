'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string | null;
  name?: string | null;
  image?: string | null;
  user_metadata?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  oauthSignIn: (provider: 'google' | 'azure-ad') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        id: session.userId || session.user.id!,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, [session, status]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Email ou mot de passe incorrect');
      }

      router.push('/dashboard');
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // ✅ Create user with Supabase Auth with email already confirmed
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            email_confirmed: true
          }
        },
      });

      if (error) {
        console.error('❌ Supabase signup error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Erreur lors de la création du compte');
      }

      console.log('✅ Utilisateur créé dans Supabase Auth:', data.user.id);

      // ✅ Auto-confirm email via admin API if needed
      if (!data.user.email_confirmed_at && data.user.id) {
        try {
          const response = await fetch('/api/auth/confirm-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id, email })
          });
          
          if (!response.ok) {
            console.warn('⚠️ Could not auto-confirm email');
          }
        } catch (confirmError) {
          console.warn('⚠️ Auto-confirmation failed:', confirmError);
        }
      }

      // ✅ Sign in automatically with NextAuth
      console.log('✅ Connexion automatique après inscription...');
      
      const result = await nextAuthSignIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error('❌ Erreur connexion après inscription:', result.error);
        throw new Error('Compte créé mais erreur de connexion. Essayez de vous connecter manuellement.');
      }

      // ✅ Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await nextAuthSignOut({ redirect: false });
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const oauthSignIn = async (provider: 'google' | 'azure-ad') => {
    setLoading(true);
    try {
      await nextAuthSignIn(provider, { 
        callbackUrl: '/dashboard' 
      });
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      oauthSignIn
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
