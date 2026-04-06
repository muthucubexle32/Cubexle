// components/layout/AppLayout.jsx
import React from 'react';
import TopNavbar from './TopNavbar';

const AppLayout = ({ 
  children, 
  onPanelChange, 
  activePanel, 
  showNavbar = true,
  onLogout
}) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNavbar && (
        <TopNavbar 
          onPanelChange={onPanelChange}
          activePanel={activePanel}
          onLogout={onLogout}
        />
      )}
      {/* Change overflow-hidden to overflow-auto */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;