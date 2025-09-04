import React from 'react';
import { Box, Typography, Stack, Chip, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatRelativeTime } from '../../utils/formatters';

const DeadlineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(0, -1),
    padding: theme.spacing(2, 1),
  },
}));

const StatusIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'urgent':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      default:
        return theme.palette.success.main;
    }
  };

  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: getColor(),
    marginRight: theme.spacing(2),
    flexShrink: 0,
  };
});

const getChipProps = (status: string) => {
  switch (status) {
    case 'urgent':
      return {
        label: 'Urgent',
        color: 'error' as const,
        variant: 'filled' as const,
      };
    case 'warning':
      return {
        label: 'Soon',
        color: 'warning' as const,
        variant: 'filled' as const,
      };
    default:
      return {
        label: 'Normal',
        color: 'success' as const,
        variant: 'outlined' as const,
      };
  }
};

interface DeadlineItem {
  id: string;
  project: string;
  deadline: Date;
  status: 'urgent' | 'warning' | 'normal';
}

interface DeadlineListProps {
  deadlines: DeadlineItem[];
}

const DeadlineList: React.FC<DeadlineListProps> = ({ deadlines }) => {
  return (
    <Stack spacing={0}>
      {deadlines.map((deadline, index) => {
        const chipProps = getChipProps(deadline.status);
        
        return (
          <Fade in timeout={300 + index * 100} key={deadline.id}>
            <DeadlineContainer>
              <Box display="flex" alignItems="center" flex={1} minWidth={0}>
                <StatusIndicator status={deadline.status} />
                <Box minWidth={0}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                    {deadline.project}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Due {formatRelativeTime(deadline.deadline)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                {...chipProps}
                size="small"
                sx={{
                  ml: 2,
                  minWidth: 'auto',
                  height: 24,
                  fontSize: '0.75rem',
                }}
              />
            </DeadlineContainer>
          </Fade>
        );
      })}
    </Stack>
  );
};

export default DeadlineList;