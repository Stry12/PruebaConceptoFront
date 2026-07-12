import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar />
      <Header />
      <main className="ml-[240px] mt-16 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>
  );
}
