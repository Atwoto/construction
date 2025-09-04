import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme, Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import ModernSidebar from './ModernSidebar';
import ModernHeader from './ModernHeader';

const LayoutContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
});

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.grey[400],
  },
}));

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ModernLayoutProps {
  user: User;
  onLogout?: () => void;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <LayoutContainer>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
            },
          }}
        >
          <ModernSidebar onNavigate={handleNavigate} />
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && <ModernSidebar onNavigate={handleNavigate} />}

      <MainContent>
        <ModernHeader
          user={user}
          onMenuToggle={handleDrawerToggle}
          onLogout={onLogout}
          showMobileMenu={isMobile}
        />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default ModernLayout;