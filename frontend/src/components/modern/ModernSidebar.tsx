import React from 'react';
import { Box, Typography, Stack, IconButton, Divider, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100vh',
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '1px',
    height: '100%',
    background: `linear-gradient(180deg, ${theme.palette.primary.main}20 0%, transparent 50%, ${theme.palette.primary.main}20 100%)`,
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

const NavigationContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
}));

const NavigationItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean; component?: React.ElementType; to?: string }>(({ theme, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  marginBottom: theme.spacing(0.5),
  textDecoration: 'none',
  color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: isActive ? `${theme.palette.primary.main}15` : 'transparent',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  '&:hover': {
    backgroundColor: isActive ? `${theme.palette.primary.main}20` : theme.palette.action.hover,
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    transform: 'translateX(4px)',
  },
  '&::before': isActive
    ? {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '3px',
        height: '20px',
        backgroundColor: theme.palette.primary.main,
        borderRadius: '0 2px 2px 0',
      }
    : {},
}));

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: InsightsOutlinedIcon },
  { name: 'Clients', href: '/clients', icon: PeopleOutlinedIcon },
  { name: 'Projects', href: '/projects', icon: LocationCityOutlinedIcon },
  { name: 'Invoices', href: '/invoices', icon: ReceiptOutlinedIcon },
  { name: 'Employees', href: '/employees', icon: EngineeringOutlinedIcon },
  { name: 'Inventory', href: '/inventory', icon: Inventory2OutlinedIcon },
  { name: 'Documents', href: '/documents', icon: FolderOutlinedIcon },
  { name: 'Reports', href: '/reports', icon: ShowChartOutlinedIcon },
];

interface ModernSidebarProps {
  onNavigate?: (path: string) => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({ onNavigate }) => {
  const location = useLocation();

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            🏗️
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Construction CRM
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Project Management
            </Typography>
          </Box>
        </Box>
      </LogoContainer>

      <NavigationContainer>
        <Stack spacing={0.5}>
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Fade in timeout={300 + index * 50} key={item.name}>
                <NavigationItem
                  component={Link}
                  to={item.href}
                  isActive={isActive}
                  onClick={() => onNavigate?.(item.href)}
                >
                  <Icon sx={{ fontSize: 20, mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: isActive ? 600 : 400 }}>
                    {item.name}
                  </Typography>
                </NavigationItem>
              </Fade>
            );
          })}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Fade in timeout={800}>
          <NavigationItem
            component={Link}
            to="/profile"
            isActive={isActiveRoute('/profile')}
          >
            <SettingsOutlinedIcon sx={{ fontSize: 20, mr: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: isActiveRoute('/profile') ? 600 : 400 }}>
              Settings
            </Typography>
          </NavigationItem>
        </Fade>
      </NavigationContainer>
    </SidebarContainer>
  );
};

export default ModernSidebar;