import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppSelector } from '../../store';

export const AppLayout: React.FC = () => {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  return (
    <div className={`app-layout ${collapsed ? 'app-layout--collapsed' : ''}`}>
      <Sidebar />
      <div className="app-layout__main">
        <Header />
        <main className="app-layout__content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
