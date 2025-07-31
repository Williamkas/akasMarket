'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeaderSSR from './HeaderSSR';
import HeaderWrapper from './HeaderWrapper';

export default function HeaderSwitcher() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return pathname === '/' ? <HeaderSSR /> : <HeaderWrapper />;
}
