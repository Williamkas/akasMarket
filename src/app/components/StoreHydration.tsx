'use client';

import { useEffect } from 'react';
import { useFavoritesHydration } from '../../store/useFavoritesStore';
import { useCartStore } from '../../store/useCartStore';
import { useProductStore } from '../../store/useProductStore';

export default function StoreHydration() {
  const { setHydrated: setCartHydrated } = useCartStore();
  const { setHydrated: setProductHydrated } = useProductStore();

  useFavoritesHydration();

  useEffect(() => {
    setCartHydrated();
    setProductHydrated();
  }, [setCartHydrated, setProductHydrated]);

  return null;
}
