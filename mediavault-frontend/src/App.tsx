import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/provider';
import { AppShell } from './app/shell';
import { BibliotecaPage } from './pages/biblioteca/BibliotecaPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<BibliotecaPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
}
