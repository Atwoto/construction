import React from 'react';
import { Box, Typography, Stack, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';

const ActionButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
    '& .action-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.warning.main} 100%)`,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover::before': {
    transform: 'scaleX(1)',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.primary.main}10`,
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1.5),
  transition: 'all 0.3s ease-in-out',
}));

const quickActions = [
  {
    label: 'New Project',
    icon: LocationCityOutlinedIcon,
    href: '/projects',
    description: 'Create a new construction project',
  },
  {
    label: 'Add Client',
    icon: PeopleOutlinedIcon,
    href: '/clients',
    description: 'Add a new client to your database',
  },
  {
    label: 'Create Invoice',
    icon: ReceiptOutlinedIcon,
    href: '/invoices',
    description: 'Generate an invoice for a project',
  },
  {
    label: 'View Reports',
    icon: ShowChartOutlinedIcon,
    href: '/reports',
    description: 'Access project analytics and reports',
  },
];

interface QuickActionsProps {
  onActionClick: (href: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        '& > *': {
          flex: 1,
        },
      }}
    >
      {quickActions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <Fade in timeout={300 + index * 100} key={action.label}>
            <ActionButton onClick={() => onActionClick(action.href)}>
              <IconContainer className="action-icon">
                <Icon sx={{ fontSize: 24 }} />
              </IconContainer>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {action.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
                sx={{ lineHeight: 1.3 }}
              >
                {action.description}
              </Typography>
            </ActionButton>
          </Fade>
        );
      })}
    </Stack>
  );
};

export default QuickActions;