// pages/Index.js
import { useState, useEffect } from 'react';
import AppLayout from "@/components/layout/AppLayout";
import PdfViewerPanel from "@/components/home/PdfViewerPanel";
import OVPanel from "@/components/Datapanel/OVPanel";
import DiagnosticsPanel from "@/components/Datapanel/DiagnosticsPanel";
import LabsPanel from "@/components/Datapanel/LabsPanel";
import EKGPanel from "@/components/Datapanel/EKGPanel";
import SocialHistoryPanel from "@/components/Datapanel/SocialHistoryPanel";
import Toggle from "@/components/home/Toggle";
import SideMenu from "@/components/home/SideMenu";
import PmhPanel from "@/components/Datapanel/PmhPanel";
import PshPanel from "@/components/Datapanel/PshPanel";
import FamilyMedicalHistoryPanel from "@/components/Datapanel/FamilyMedicalHistoryPanel";
import HealthOverviewPanel from "@/components/Datapanel/HealthOverviewPanel";
import SpecialAttentionPanel from "@/components/Datapanel/SpecialAttentionPanel";
import DiseaseStatePanel from '@/components/Datapanel/DiseaseStatePanel';
import IndexingPanel from '@/pages/IndexingPanel';  // <-- import

const Index = ({ onLogout, toggleTheme, dark }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuSide, setMenuSide] = useState('right');
  const [activePanel, setActivePanel] = useState('ov');
  const [indexingStatus, setIndexingStatus] = useState(null); // 'Clarification' or 'Completed'

  // Load patient data and check for indexing state from navigation
  useEffect(() => {
    const loadPatientData = () => {
      const currentPatient = localStorage.getItem('currentPatient');
      if (currentPatient) {
        const patient = JSON.parse(currentPatient);
        window.dispatchEvent(new CustomEvent('patientLoaded', { detail: patient }));
      }
    };
    loadPatientData();

    // If navigated from Indexing click with state, set active panel
    if (window.history.state?.usr?.activePanel) {
      setActivePanel(window.history.state.usr.activePanel);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'currentPatient') loadPatientData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggle = () => setIsMenuOpen(!isMenuOpen);
  const handlePanelChange = (panel) => setActivePanel(panel);

  const renderRightPanel = () => {
    switch(activePanel) {
      case 'ov': 
      return <OVPanel />;
      case 'diagnostics': 
      return <DiagnosticsPanel />;
      case 'labs':
      return <LabsPanel />;
      case 'ekg': 
      return <EKGPanel />;
      case 'socialhistory': 
      return <SocialHistoryPanel />;
      case 'pmh': 
      return <PmhPanel />;
      case 'psh': 
      return <PshPanel />;
      case 'family-medical-history': 
      return <FamilyMedicalHistoryPanel />;
      case 'health-overview': 
      return <HealthOverviewPanel />;
      case 'special-attention': 
      return <SpecialAttentionPanel />;
      case 'disease-state': 
      return <DiseaseStatePanel />;
      case 'indexing': 
      return <IndexingPanel />;  // <-- new case
      default: 
      return <OVPanel />;
    }
  };

  return (
    <AppLayout 
      onPanelChange={handlePanelChange}
      activePanel={activePanel}
      onLogout={onLogout}
      toggleTheme={toggleTheme}
      dark={dark}
      indexingStatus={indexingStatus}
      onIndexingStatusChange={setIndexingStatus}
    >
      <div className="flex h-full">
        {/* Left - PDF Viewer */}
        <div className={`${isMenuOpen && menuSide === 'left' ? 'w-1/3' : 'w-1/2'} h-full transition-all duration-300`}>
          <PdfViewerPanel />
        </div>

        {/* Menu on Left Side (if selected) */}
        {menuSide === 'left' && <SideMenu isOpen={isMenuOpen} side="left" />}

        {/* Toggle Button */}
        <Toggle isOpen={isMenuOpen} onToggle={handleToggle} position={menuSide === 'left' ? 'right' : 'left'} />

        {/* Menu on Right Side (if selected) */}
        {menuSide === 'right' && <SideMenu isOpen={isMenuOpen} side="right" />}

        {/* Right - Dynamic Data Entry Panel */}
        <div className={`${isMenuOpen && menuSide === 'right' ? 'flex-1' : 'flex-1'} h-full flex gap-1 transition-all duration-300 px-3 overflow-y-auto`}>
          <div className="flex-1">
            {renderRightPanel()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;