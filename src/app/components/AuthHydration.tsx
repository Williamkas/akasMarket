'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase/client';

export default function AuthHydration() {
  const { setHydrated, setUser } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Rehydrate the store
      await useAuthStore.persist.rehydrate();

      // Check if user is already authenticated using Supabase client directly
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (session?.user && !error) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, lastname')
            .eq('id', session.user.id)
            .single();

          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || null,
            lastname: profile?.lastname || null
          };

          setUser(userData);
          console.log('User session restored:', userData);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.log('Error checking session:', error);
      }

      setHydrated();
    };

    initializeAuth();
  }, [setHydrated, setUser]);

  return null;
}
