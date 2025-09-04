import React from 'react';
import { Box, Typography, Stack, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { formatRelativeTime } from '../../utils/formatters';

const ActivityContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
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

const IconContainer = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  flexShrink: 0,
}));

const getIconAndColor = (type: string) => {
  switch (type) {
    case 'project':
      return {
        icon: LocationCityOutlinedIcon,
        color: '#2563eb',
        bgColor: 'rgba(37, 99, 235, 0.1)',
      };
    case 'invoice':
      return {
        icon: ReceiptOutlinedIcon,
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
      };
    case 'team':
      return {
        icon: PeopleOutlinedIcon,
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.1)',
      };
    case 'completion':
      return {
        icon: CheckCircleOutlinedIcon,
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.1)',
      };
    default:
      return {
        icon: LocationCityOutlinedIcon,
        color: '#64748b',
        bgColor: 'rgba(100, 116, 139, 0.1)',
      };
  }
};

interface ActivityItem {
  id: string;
  action: string;
  project: string;
  time: Date;
  type: 'project' | 'invoice' | 'team' | 'completion';
}

interface ActivityListProps {
  activities: ActivityItem[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <Stack spacing={0}>
      {activities.map((activity, index) => {
        const { icon: Icon, color, bgColor } = getIconAndColor(activity.type);
        
        return (
          <Fade in timeout={300 + index * 100} key={activity.id}>
            <ActivityContainer>
              <IconContainer sx={{ backgroundColor: bgColor, color }}>
                <Icon sx={{ fontSize: 20 }} />
              </IconContainer>
              <Box flex={1} minWidth={0}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {activity.action}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {activity.project}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                {formatRelativeTime(activity.time)}
              </Typography>
            </ActivityContainer>
          </Fade>
        );
      })}
    </Stack>
  );
};

export default ActivityList;