import React from 'react';
import {
  Divider, List, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { red } from '@mui/material/colors';
import BarChartIcon from '@mui/icons-material/BarChart';
import RouteIcon from '@mui/icons-material/Route';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAdministrator } from '../../common/util/permissions';

const MenuItem = ({
  title, link, icon, selected,
}) => (
  <ListItemButton
    key={link}
    component={Link}
    to={link}
    selected={selected}
    sx={{
      '& svg': {
        color: red[500],
        transition: '0.2s',
        transform: 'translateX(0) rotate(0)',
      },
      '&:hover, &:focus': {
        bgcolor: 'unset',
        '& svg:first-of-type': {
          transform: 'translateX(4px) rotate(8deg) scale(1.1)',
        },
        '& svg:last-of-type': {
          right: 0,
          opacity: 1,
        },
      },
      '&:after': {
        content: '""',
        position: 'absolute',
        height: '80%',
        display: 'block',
        left: 0,
        width: '1px',
        bgcolor: 'divider',
      },
    }}
  >
    <ListItemIcon>
      {icon}
    </ListItemIcon>
    <ListItemText primary={title} />
  </ListItemButton>
);

const ReportsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const admin = useAdministrator();

  return (
    <>
      <List>
        <MenuItem
          title={t('reportRoute')}
          link="/reports/route"
          icon={<TimelineIcon />}
          selected={location.pathname === '/reports/route'}
        />
        <MenuItem
          title={t('reportEvents')}
          link="/reports/event"
          icon={<NotificationsActiveIcon />}
          selected={location.pathname === '/reports/event'}
        />
        <MenuItem
          title={t('reportTrips')}
          link="/reports/trip"
          icon={<PlayCircleFilledIcon />}
          selected={location.pathname === '/reports/trip'}
        />
        <MenuItem
          title={t('reportStops')}
          link="/reports/stop"
          icon={<PauseCircleFilledIcon />}
          selected={location.pathname === '/reports/stop'}
        />
        <MenuItem
          title={t('reportSummary')}
          link="/reports/summary"
          icon={<FormatListBulletedIcon />}
          selected={location.pathname === '/reports/summary'}
        />
        <MenuItem
          title={t('reportChart')}
          link="/reports/chart"
          icon={<TrendingUpIcon />}
          selected={location.pathname === '/reports/chart'}
        />
        <MenuItem
          title={t('reportReplay')}
          link="/replay"
          icon={<RouteIcon />}
        />
      </List>
      {admin && (
        <>
          <Divider />
          <List>
            <MenuItem
              title={t('statisticsTitle')}
              link="/reports/statistics"
              icon={<BarChartIcon />}
              selected={location.pathname === '/reports/statistics'}
            />
          </List>
        </>
      )}
    </>
  );
};

export default ReportsMenu;
