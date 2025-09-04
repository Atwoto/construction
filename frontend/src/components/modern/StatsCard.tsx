import React from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatsCardContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.grey[100]}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
    '& .stats-arrow': {
      transform: 'translateX(4px)',
    },
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
  color: theme.palette.primary.main,
  fontSize: '1.5rem',
}));

const TrendContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  gap: theme.spacing(0.5),
}));

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  onClick,
}) => {
  return (
    <Fade in timeout={300}>
      <StatsCardContainer onClick={onClick}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <IconContainer>{icon}</IconContainer>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            {trend && (
              <TrendContainer>
                {trend.isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {Math.abs(trend.value)}%
                </Typography>
              </TrendContainer>
            )}
          </Box>
          {onClick && (
            <IconButton
              size="small"
              className="stats-arrow"
              sx={{
                color: 'text.secondary',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </StatsCardContainer>
    </Fade>
  );
};

export default StatsCard;