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
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;