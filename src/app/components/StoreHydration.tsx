'use client';

import { useFavoritesHydration } from '../../store/useFavoritesStore';

export default function StoreHydration() {
  useFavoritesHydration();
  return null;
}
