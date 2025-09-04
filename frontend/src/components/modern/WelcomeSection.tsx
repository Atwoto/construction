import React from 'react';
import { Box, Typography, Avatar, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatInitials } from '../../utils/formatters';

const WelcomeContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #f59e0b 100%)',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
    gap: theme.spacing(2),
  },
}));

const WelcomeText = styled(Box)(({ theme }) => ({
  flex: 1,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: 'white',
  fontSize: '2rem',
  fontWeight: 700,
  border: '3px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(10px)',
  [theme.breakpoints.down('md')]: {
    width: 60,
    height: 60,
    fontSize: '1.5rem',
  },
}));

interface User {
  firstName: string;
  lastName: string;
}

interface WelcomeSectionProps {
  user: User;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Fade in timeout={500}>
      <WelcomeContainer>
        <ContentContainer>
          <WelcomeText>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {getGreeting()}, {user.firstName}! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1.1rem' }}>
              Here's what's happening with your construction projects today.
            </Typography>
          </WelcomeText>
          <StyledAvatar>
            {formatInitials(user.firstName, user.lastName)}
          </StyledAvatar>
        </ContentContainer>
      </WelcomeContainer>
    </Fade>
  );
};

export default WelcomeSection;