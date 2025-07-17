'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { useAuth } from '../../store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  initialMode?: 'login' | 'register' | 'forgot-password' | 'reset-password';
}

type ModalMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Iniciar sesión',
  description,
  initialMode = 'login'
}) => {
  const [activeMode, setActiveMode] = useState<ModalMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearRedirectUrl, setUser } = useAuthStore();
  const { isAuthenticated } = useAuth();

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmResetPassword, setShowConfirmResetPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [registerPasswordsMatch, setRegisterPasswordsMatch] = useState(false);

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');

  // Reset password form state
  const [resetPassword, setResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Check for reset token in URL when modal opens
  useEffect(() => {
    if (isOpen) {
      const token = searchParams.get('token');
      if (token) {
        setResetToken(token);
        setActiveMode('reset-password');
      }
    }
  }, [isOpen, searchParams]);

  // Check if passwords match in reset form
  useEffect(() => {
    if (activeMode === 'reset-password') {
      const match = resetPassword === confirmResetPassword && resetPassword.length >= 6;
      setPasswordsMatch(match);
    }
  }, [resetPassword, confirmResetPassword, activeMode]);

  // Check if passwords match in register form
  useEffect(() => {
    if (activeMode === 'register') {
      const match = registerPassword === confirmPassword && registerPassword.length >= 6;
      setRegisterPasswordsMatch(match);
    }
  }, [registerPassword, confirmPassword, activeMode]);

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
        const errorMessage = result?.error?.message || result?.message || 'Error al iniciar sesión';

        if (errorMessage === 'Invalid credentials') {
          throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
        }

        if (errorMessage === 'User already logged in') {
          // If user is already logged in, close modal and refresh the page to update auth state
          toast.success('✅ Ya estás logueado');
          onClose();
          window.location.reload();
          return;
        }

        if (errorMessage === 'Invalid data' && result?.error?.details) {
          if (Array.isArray(result.error.details)) {
            const firstError = result.error.details[0];
            if (firstError && firstError.message) {
              throw new Error(firstError.message);
            }
          } else if (typeof result.error.details === 'string') {
            throw new Error(result.error.details);
          }
        }

        throw new Error(errorMessage);
      }

      // Update the auth store with user data
      if (result.data?.user) {
        setUser(result.data.user);
        console.log('User set in store:', result.data.user);
      }

      toast.success('✅ Inicio de sesión exitoso');

      // Small delay to ensure state is updated before calling onSuccess
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 100);
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
        const errorMessage = result?.error?.message || result?.message || 'Error al registrarse';

        if (errorMessage === 'Email already registered') {
          throw new Error(
            'Este correo electrónico ya está registrado. Por favor, usa otro correo o inicia sesión si ya tienes una cuenta.'
          );
        }

        if (errorMessage === 'Invalid data' && result?.error?.details) {
          if (Array.isArray(result.error.details)) {
            const firstError = result.error.details[0];
            if (firstError && firstError.message) {
              throw new Error(firstError.message);
            }
          } else if (typeof result.error.details === 'string') {
            throw new Error(result.error.details);
          }
        }

        throw new Error(errorMessage);
      }

      toast.success('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      setActiveMode('login');
      setLoginEmail(registerEmail);
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Error al registrarse'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/createForgottenPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: forgotEmail })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.error?.message || result?.message || 'Error al enviar el email de recuperación';
        throw new Error(errorMessage);
      }

      toast.success('✅ Email de recuperación enviado. Revisa tu bandeja de entrada.');
      setActiveMode('login');
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Error al enviar el email de recuperación'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (resetPassword !== confirmResetPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const response = await fetch('/api/auth/resetForgottenPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: resetToken,
          password: resetPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.error?.message || result?.message || 'Error al restablecer la contraseña';
        throw new Error(errorMessage);
      }

      toast.success('✅ Contraseña restablecida exitosamente. Ya puedes iniciar sesión.');
      // Si el usuario ya está autenticado, cerrar el modal y no mostrar login
      setTimeout(() => {
        if (isAuthenticated) {
          onClose();
        } else {
          setActiveMode('login');
        }
      }, 100);
      // Limpiar el token de la URL
      router.replace(window.location.pathname);
    } catch (error) {
      toast.error(`❌ ${error instanceof Error ? error.message : 'Error al restablecer la contraseña'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Clear any redirect URL when closing modal
    clearRedirectUrl();
    onClose();
  };

  const getTitle = () => {
    switch (activeMode) {
      case 'login':
        return 'Iniciar sesión';
      case 'register':
        return 'Crear cuenta';
      case 'forgot-password':
        return 'Recuperar contraseña';
      case 'reset-password':
        return 'Restablecer contraseña';
      default:
        return title;
    }
  };

  const getDescription = () => {
    switch (activeMode) {
      case 'login':
        return 'Inicia sesión o crea una cuenta para acceder a tu perfil.';
      case 'register':
        return 'Crea una nueva cuenta para comenzar a comprar.';
      case 'forgot-password':
        return 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.';
      case 'reset-password':
        return 'Ingresa tu nueva contraseña.';
      default:
        return description;
    }
  };

  const renderPasswordField = (
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    showPassword: boolean,
    setShowPassword: (show: boolean) => void,
    className: string = ''
  ) => (
    <div className='relative'>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        placeholder={placeholder}
        required
      />
      <button
        type='button'
        onClick={() => setShowPassword(!showPassword)}
        className='absolute inset-y-0 right-0 pr-3 flex items-center'
      >
        {showPassword ? (
          <svg
            className='h-5 w-5 text-gray-400 hover:text-gray-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
            />
          </svg>
        ) : (
          <svg
            className='h-5 w-5 text-gray-400 hover:text-gray-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
            />
          </svg>
        )}
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>{getTitle()}</h2>
            <p className='text-gray-600 mt-1'>{getDescription()}</p>
          </div>
          <button onClick={handleClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs - Only show for login/register */}
        {(activeMode === 'login' || activeMode === 'register') && (
          <div className='flex border-b'>
            <button
              onClick={() => setActiveMode('login')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeMode === 'login'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setActiveMode('register')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeMode === 'register'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Crear cuenta
            </button>
          </div>
        )}

        {/* Content */}
        <div className='p-6'>
          {activeMode === 'login' && (
            <form onSubmit={handleLogin} className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Email</label>
                <input
                  type='email'
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Ingresa tu email'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Contraseña</label>
                {renderPasswordField(
                  loginPassword,
                  setLoginPassword,
                  'Ingresa tu contraseña',
                  showLoginPassword,
                  setShowLoginPassword
                )}
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>

              <div className='text-center'>
                <button
                  type='button'
                  onClick={() => setActiveMode('forgot-password')}
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          )}

          {activeMode === 'register' && (
            <form onSubmit={handleRegister} className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-gray-700 text-sm font-medium mb-1'>Nombre</label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
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
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Correo electrónico'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Contraseña</label>
                {renderPasswordField(
                  registerPassword,
                  setRegisterPassword,
                  'Contraseña',
                  showRegisterPassword,
                  setShowRegisterPassword
                )}
              </div>
              <div className='mb-6'>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Confirmar contraseña</label>
                <div className='relative'>
                  {renderPasswordField(
                    confirmPassword,
                    setConfirmPassword,
                    'Confirmar contraseña',
                    showConfirmPassword,
                    setShowConfirmPassword
                  )}
                  {confirmPassword && (
                    <div className='mt-2'>
                      {registerPasswordsMatch ? (
                        <span className='text-green-600 text-xs flex items-center gap-1'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                          Las contraseñas coinciden
                        </span>
                      ) : (
                        <span className='text-red-600 text-xs flex items-center gap-1'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                          Las contraseñas no coinciden
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                type='submit'
                disabled={loading || !registerPasswordsMatch}
                className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
              >
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          )}

          {activeMode === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Email</label>
                <input
                  type='email'
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Ingresa tu email'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
              >
                {loading ? 'Enviando...' : 'Enviar email de recuperación'}
              </button>

              <div className='text-center'>
                <button
                  type='button'
                  onClick={() => setActiveMode('login')}
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  Volver al login
                </button>
              </div>
            </form>
          )}

          {activeMode === 'reset-password' && (
            <form onSubmit={handleResetPassword} className='space-y-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Nueva contraseña</label>
                {renderPasswordField(
                  resetPassword,
                  setResetPassword,
                  'Nueva contraseña',
                  showResetPassword,
                  setShowResetPassword
                )}
              </div>
              <div className='mb-6'>
                <label className='block text-gray-700 text-sm font-medium mb-1'>Confirmar nueva contraseña</label>
                <div className='relative'>
                  {renderPasswordField(
                    confirmResetPassword,
                    setConfirmResetPassword,
                    'Confirmar nueva contraseña',
                    showConfirmResetPassword,
                    setShowConfirmResetPassword
                  )}
                  {confirmResetPassword && (
                    <div className='mt-2'>
                      {passwordsMatch ? (
                        <span className='text-green-600 text-xs flex items-center gap-1'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                          Las contraseñas coinciden
                        </span>
                      ) : (
                        <span className='text-red-600 text-xs flex items-center gap-1'>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                          Las contraseñas no coinciden
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                type='submit'
                disabled={loading || !passwordsMatch}
                className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50'
              >
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </button>

              <div className='text-center'>
                <button
                  type='button'
                  onClick={() => setActiveMode('login')}
                  className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                >
                  Volver al login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
