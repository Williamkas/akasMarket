'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useProductStore } from '../../store/useProductStore';

export default function StoreHydration() {
  const { user, hydrated: authHydrated } = useAuth();
  const hydrateCart = useCartStore((s) => s.setHydrated);
  const hydrateFavorites = useFavoritesStore((s) => s.hydrateFavorites);
  const hydrateProducts = useProductStore((s) => s.setHydrated);

  useEffect(() => {
    hydrateProducts(); // SIEMPRE hidrata productos
    if (authHydrated) {
      hydrateCart();
      hydrateFavorites();
    }
  }, [user?.id, authHydrated, hydrateCart, hydrateFavorites, hydrateProducts]);

  return null;
}
