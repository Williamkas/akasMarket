'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AuthModal from './AuthModal';

export default function AuthModalTrigger() {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setShowModal(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setShowModal(false);
    // Remove token from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, '', url.toString());
  };

  const handleSuccess = () => {
    setShowModal(false);
    // Remove token from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, '', url.toString());
  };

  return <AuthModal isOpen={showModal} onClose={handleClose} onSuccess={handleSuccess} initialMode='reset-password' />;
}
