import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';

const AppLayout = ({ 
  children, 
  onPanelChange, 
  activePanel, 
  showNavbar = true 
}) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {showNavbar && (
        <TopNavbar 
          onPanelChange={onPanelChange}
          activePanel={activePanel}
        />
      )}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;