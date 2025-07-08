'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, title = 'Iniciar sesión', description }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al iniciar sesión');
      }

      toast.success('✅ Inicio de sesión exitoso');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Error al iniciar sesión'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (registerPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: registerEmail, password: registerPassword, name, lastname })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrarse');
      }

      toast.success('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      setActiveTab('login');
      setLoginEmail(registerEmail);
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Error al registrarse'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
            {description && <p className='text-gray-600 mt-1'>{description}</p>}
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className='flex border-b'>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Email</label>
                <input
                  type='email'
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Ingresa tu email'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Contraseña</label>
                <input
                  type='password'
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Ingresa tu contraseña'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>Nombre</label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Nombre'
                    required
                  />
                </div>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>Apellido</label>
                  <input
                    type='text'
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    placeholder='Apellido'
                    required
                  />
                </div>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Email</label>
                <input
                  type='email'
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Correo electrónico'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Contraseña</label>
                <input
                  type='password'
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Contraseña'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Confirmar contraseña</label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Confirmar contraseña'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
