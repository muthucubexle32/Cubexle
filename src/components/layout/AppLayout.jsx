// components/layout/AppLayout.jsx
import React from 'react';
import TopNavbar from './TopNavbar';

// AppLayout.jsx
const AppLayout = ({ children, onPanelChange, activePanel, showNavbar = true, onLogout, toggleTheme, dark }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNavbar && (
        <TopNavbar
          onPanelChange={onPanelChange}
          activePanel={activePanel}
          onLogout={onLogout}
          toggleTheme={toggleTheme}
          dark={dark}
        />
      )}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
};

export default AppLayout;
