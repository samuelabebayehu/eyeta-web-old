import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  useMediaQuery, InputLabel, Select, MenuItem, FormControl, Button, TextField, Link, Snackbar, IconButton, Tooltip, Typography, Card, CardContent,
  InputAdornment,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { grey } from '@mui/material/colors';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState, { savePersistedState } from '../common/util/usePersistedState';
import { handleLoginTokenListeners, nativeEnvironment, nativePostMessage } from '../common/components/NativeInterface';
import { useCatch } from '../reactHelper';
import LogoImageBlue from './LogoImageBlue';
import StickyFooterA from '../common/components/StickyFooter';

const greetingTime = require('greeting-time');

const useStyles = makeStyles((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  container: {
    background: grey[50],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  extraContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  registerButton: {
    minWidth: 'unset',
  },
  resetPassword: {
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    marginTop: theme.spacing(2),
  },
  footer: {
    position: 'fixed',
    bottom: 0,
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  // const [uname, setUname] = usePersistedState('loginUserName', '');
  const [password, setPassword] = useState('');

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => !state.session.server.attributes['ui.disableLoginLanguage']);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const generateLoginToken = async () => {
    if (nativeEnvironment) {
      let token = '';
      try {
        const expiration = moment().add(6, 'months').toISOString();
        const response = await fetch('/api/session/token', {
          method: 'POST',
          body: new URLSearchParams(`expiration=${expiration}`),
        });
        if (response.ok) {
          token = await response.text();
        }
      } catch (error) {
        token = '';
      }
      nativePostMessage(`login|${token}`);
    }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),
      });
      if (response.ok) {
        const user = await response.json();
        savePersistedState('savedUsername', user.name);
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        navigate('/');
      } else {
        throw Error(await response.text());
      }
    } catch (error) {
      setFailed(true);
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetch(`/api/session?token=${encodeURIComponent(token)}`);
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      navigate('/');
    } else {
      throw Error(await response.text());
    }
  });

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password) {
      handlePasswordLogin(e);
    }
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  return (
    <LoginLayout>
      {/* greetingTime(new Date()); */}
      <div>
        <Typography variant="h3" className={classes.title}>
          {greetingTime(new Date())}
          {' '}
          {usePersistedState('savedUsername')}
        </Typography>
      </div>
      <div className={classes.options}>
        {nativeEnvironment && (
          <Tooltip title={t('settingsServer')}>
            <IconButton onClick={() => navigate('/change-server')}>
              <LockOpenIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <Card sx={{ maxWidth: 350, borderRadius: '12px' }}>
        <CardContent>
          <div className={classes.container}>
            {useMediaQuery(theme.breakpoints.down('lg')) && <LogoImageBlue color={theme.palette.primary.main} />}
            <TextField
              required
              error={failed}
              label={t('userEmail')}
              name="email"
              value={email}
              autoComplete="email"
              autoFocus={!email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={handleSpecialKey}
              helperText={failed && 'Invalid username or password'}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <AccountCircleIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              error={failed}
              label={t('userPassword')}
              name="password"
              value={password}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              autoFocus={!!email}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handleSpecialKey}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={handlePasswordLogin}
              onKeyUp={handleSpecialKey}
              variant="contained"
              color="secondary"
              disabled={!email || !password}
            >
              {t('loginLogin')}
            </Button>
            <div className={classes.extraContainer}>
              <Button
                className={classes.registerButton}
                onClick={() => navigate('/register')}
                disabled={!registrationEnabled}
                color="secondary"
              >
                {t('loginRegister')}
              </Button>
              {languageEnabled && (
                <FormControl fullWidth>
                  <InputLabel>{t('loginLanguage')}</InputLabel>
                  <Select label={t('loginLanguage')} value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {languageList.map((it) => <MenuItem key={it.code} value={it.code}>{it.name}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
            </div>
            {emailEnabled && (
              <Link
                onClick={() => navigate('/reset-password')}
                className={classes.resetPassword}
                underline="none"
                variant="caption"
              >
                {t('loginReset')}
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={(
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
      <div className={classes.footer}>
        <StickyFooterA />
      </div>
    </LoginLayout>
  );
};

export default LoginPage;
