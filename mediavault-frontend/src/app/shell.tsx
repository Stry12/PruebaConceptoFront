import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun, User, Library, FolderOpen, List } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

const navTabs = [
  { path: '/', label: 'Biblioteca', icon: Library },
  { path: '/colecciones', label: 'Colecciones', icon: FolderOpen },
  { path: '/listas', label: 'Listas', icon: List },
];

export function AppShell({ children }: AppShellProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Top Bar */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{
            maxWidth: 'var(--grid-max-width)',
            padding: '0 var(--space-6)',
            height: 'var(--space-12)',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 no-underline"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
          >
            <span style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)' }}>
              MediaVault
            </span>
          </Link>

          {/* Desktop Search — hidden when route is / (Biblioteca page has its own) */}
          <div className={`items-center flex-1 max-w-md mx-6 ${location.pathname === '/' ? 'hidden' : 'hidden md:flex'}`}>
            <div
              className="flex items-center w-full rounded-md border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                padding: 'var(--space-2) var(--space-3)',
                gap: 'var(--space-2)',
              }}
            >
              <Search size={20} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
              <input
                type="search"
                placeholder="Buscar..."
                aria-label="Buscar en tu biblioteca"
                className="w-full bg-transparent border-none outline-none"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center rounded-md"
              style={{
                width: '36px',
                height: '36px',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="flex items-center justify-center rounded-full"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--color-surface-raised)',
                color: 'var(--color-text-secondary)',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Menú de usuario"
            >
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav
          className="hidden md:flex mx-auto border-t"
          style={{
            maxWidth: 'var(--grid-max-width)',
            padding: '0 var(--space-6)',
            borderColor: 'var(--color-border)',
          }}
          aria-label="Navegación principal"
        >
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex items-center gap-2 no-underline relative"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderBottom: isActive
                    ? '2px solid var(--color-accent)'
                    : '2px solid transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <tab.icon size={16} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label="Navegación principal"
      >
        {navTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex-1 flex flex-col items-center justify-center no-underline"
              style={{
                padding: 'var(--space-2) 0',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <tab.icon size={24} />
              <span style={{ marginTop: '2px' }}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
