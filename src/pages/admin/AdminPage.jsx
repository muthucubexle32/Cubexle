import React from 'react';
import AppLayout from '../../components/layout/AppLayout';

const AdminPage = ({ onLogout }) => {
  return (
    <AppLayout onLogout={onLogout}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p>Administrative features coming soon.</p>
      </div>
    </AppLayout>
  );
};

export default AdminPage;