import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/shared/components/ui/Modal';
import { dummyAuthService } from '@/core/services/auth/dummy-auth-service';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    const errorMsg = await login(email, password);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      navigate('/opd-queue');
    }
  };

  const handleOpenForgot = () => {
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
    setShowForgotModal(true);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!resetEmail) {
      setResetError('Ingrese su correo electrónico');
      return;
    }
    setResetLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    const exists = await dummyAuthService.requestPasswordReset(resetEmail);
    setResetLoading(false);
    if (exists) {
      setResetSuccess(true);
    } else {
      setResetError('No se encontró una cuenta con ese correo electrónico');
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Half: Branding */}
      <section className="w-full md:w-1/2 bg-primary flex flex-col justify-center items-center p-8 lg:p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 border border-white rounded-full"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 border border-white rounded-full"></div>
        </div>
        <div className="z-10 text-center">
          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight mb-6">HospitalMS</h1>
          <div className="flex flex-col items-center space-y-4">
            <span className="material-symbols-outlined text-white" style={{ fontSize: '64px' }}>medical_services</span>
            <p className="text-white/90 text-xl font-light tracking-wide">Sistema de Gesti&oacute;n Hospitalaria</p>
          </div>
        </div>
      </section>

      {/* Right Half: Login Form */}
      <section className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-24">
        <div className="w-full max-w-[400px]">
          <header className="mb-8">
            <h2 className="text-[22px] font-semibold text-neutral-900 mb-2">Iniciar Sesi&oacute;n</h2>
            <p className="text-sm text-neutral-600">Bienvenido de nuevo. Por favor, ingrese sus credenciales.</p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-600" htmlFor="email">
                Correo electr&oacute;nico
              </label>
              <input
                id="email"
                type="email"
                placeholder="usuario@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[40px] px-3 border border-neutral-200 rounded-sm text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(15,118,110,0.1)] transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-neutral-600" htmlFor="password">
                  Contrase&ntilde;a
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[40px] px-3 pr-10 border border-neutral-200 rounded-sm text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(15,118,110,0.1)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 flex items-center"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={handleOpenForgot}
                  className="text-xs text-primary hover:text-primary-hover transition-colors"
                >
                  &iquest;Olvid&oacute; su contrase&ntilde;a?
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-error text-xs">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-[44px] bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md shadow-subtle active:scale-[0.98] transition-all duration-200 mt-2"
            >
              Iniciar Sesi&oacute;n
            </button>
          </form>

          <footer className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-center text-xs text-neutral-500">
              &copy; 2024 HospitalMS. Todos los derechos reservados.<br />
              Acceso restringido solo para personal autorizado.
            </p>
          </footer>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <Modal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} title="Recuperar Contrase&ntilde;a" maxWidth="max-w-[440px]">
        {resetSuccess ? (
          <div className="p-6">
            <div className="flex items-center gap-3 p-4 bg-success-light rounded-lg mb-4">
              <span className="material-symbols-outlined text-success" style={{ fontSize: '24px' }}>mark_email_read</span>
              <p className="text-sm text-success font-medium">Se ha enviado un enlace de recuperaci&oacute;n a:</p>
            </div>
            <p className="text-sm font-semibold text-neutral-900 mb-6">{resetEmail}</p>
            <p className="text-xs text-neutral-500 mb-6">
              Revise su bandeja de entrada y siga las instrucciones para restablecer su contrase&ntilde;a. El enlace expirar&aacute; en 24 horas.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full h-10 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md transition-all"
            >
              Volver al Inicio de Sesi&oacute;n
            </button>
          </div>
        ) : (
          <form onSubmit={handleRequestReset} className="p-6">
            <p className="text-sm text-neutral-600 mb-5">
              Ingrese el correo electr&oacute;nico asociado a su cuenta y le enviaremos un enlace para restablecer su contrase&ntilde;a.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5" htmlFor="reset-email">
                Correo electr&oacute;nico
              </label>
              <input
                id="reset-email"
                type="email"
                placeholder="usuario@hospital.com"
                value={resetEmail}
                onChange={(e) => { setResetEmail(e.target.value); setResetError(''); }}
                className="w-full h-10 px-3 border border-neutral-200 rounded-md text-sm placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(15,118,110,0.1)] transition-all"
                autoFocus
              />
            </div>
            {resetError && (
              <div className="flex items-center gap-2 text-error text-xs mb-4">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
                <span>{resetError}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="flex-1 h-10 border border-neutral-200 text-neutral-700 text-sm font-medium rounded-md hover:bg-neutral-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={resetLoading}
                className="flex-1 h-10 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-all"
              >
                {resetLoading ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </main>
  );
}
