import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { formatInitials } from '../../utils/formatters';

const HeaderContainer = styled(Box)(({ theme }) => ({
  height: 72,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primary.main}30 50%, transparent 100%)`,
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`,
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface ModernHeaderProps {
  user: User;
  onMenuToggle?: () => void;
  onLogout?: () => void;
  showMobileMenu?: boolean;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({
  user,
  onMenuToggle,
  onLogout,
  showMobileMenu = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    onLogout?.();
  };

  return (
    <HeaderContainer>
      <Box display="flex" alignItems="center" gap={2}>
        {showMobileMenu && (
          <IconButton
            onClick={onMenuToggle}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Construction CRM
        </Typography>
      </Box>

      <UserSection>
        <IconButton
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>

        <UserInfo>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        </UserInfo>

        <StyledAvatar onClick={handleClick}>
          {formatInitials(user.firstName, user.lastName)}
        </StyledAvatar>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 8,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleClose}>
            <AccountCircleOutlinedIcon sx={{ mr: 2, fontSize: 20 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <SettingsOutlinedIcon sx={{ mr: 2, fontSize: 20 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </UserSection>
    </HeaderContainer>
  );
};

export default ModernHeader;