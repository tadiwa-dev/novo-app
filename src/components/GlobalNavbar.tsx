'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { LogoutDialog } from './LogoutDialog';

export function GlobalNavbar() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <>
      <Navbar onLogoutClick={() => setShowLogoutDialog(true)} />
      <LogoutDialog 
        isOpen={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)} 
      />
    </>
  );
}