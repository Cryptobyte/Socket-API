import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import {
  Fab,
  Box,
  Tab,
  Grid,
  Alert,
  Button,
  Tooltip,
  Snackbar,
  TextField,
  Typography

} from '@mui/material';

import {
  Check,
  Error,
  Warning,
  HourglassEmpty

} from '@mui/icons-material';

import {
  TabList,
  TabPanel,
  TabContext

} from '@mui/lab';

import './App.css';

function App() {
  const [socketUrl, setSocketUrl] = useState('ws://localhost:8080');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('1');
  const [error, setError] = useState(null);

  const {
    readyState,
    sendJsonMessage

  } = useWebSocket(socketUrl, {
    /*
     * This is a real hacky way to do this, but it's for demonstration only
     */
    onMessage: (m) => {
      if (!m.data) return;

      let _data;

      try {
        _data = JSON.parse(m.data);

      } catch (e) {
        setError(e.message);
      }

      if (_data && _data.error) {
        setError(_data.error);
      }

      if ((_data) && (_data.token)) {
        setToken(_data.token);
        setPassword('');

        localStorage.setItem('username', username);

        /*
         * Refresh the page to trigger browsers to offer 
         * to remember password, for convienence
         */
        window.location.reload();
      }
    },
    shouldReconnect: (e) => true
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'

  }[readyState];

  const connectionColor = {
    [ReadyState.CONNECTING]: 'primary',
    [ReadyState.OPEN]: 'success',
    [ReadyState.CLOSING]: 'warning',
    [ReadyState.CLOSED]: 'error',
    [ReadyState.UNINSTANTIATED]: 'default'

  }[readyState];

  useEffect(() => {
    const ping = setInterval(() => {
      if (connectionStatus === 'Open') {
        sendJsonMessage({
          type: 'ping'
        });
      }

    }, 10000);

    return () => clearInterval(ping);

  }, []);

  React.useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      return;
    }

    localStorage.setItem('token', token);

  }, [token]);

  const handleSignup = (e) => {
    e.preventDefault();

    sendJsonMessage({
      route: 'signup',
      username: username,
      password: password
    });
  };

  const handleSignin = (e) => {
    e.preventDefault();

    sendJsonMessage({
      route: 'signin',
      username: username,
      password: password
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('username');

    setToken(null);
    setUsername('');
  };

  return (
    <div className='App'>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {(token) ? (
          <Grid direction='row' justifyContent='flex-start'>
            <Typography variant='h2' component='div' gutterBottom>
              Welcome, {username}!
            </Typography>
            
            <Grid item xs={12}>
              <Grid item xs={12}>
                <TextField
                  id='outlined-multiline-static'
                  label='Token'
                  multiline
                  fullWidth
                  rows={4}
                  defaultValue={token} />

              </Grid>

              <Grid item xs={12}>
                <Button 
                  variant='contained' 
                  sx={{ marginTop: '1rem' }}
                  onClick={() => handleLogout()}>

                  Sign out
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <div>
            <Typography variant='h1' component='div' gutterBottom>
              Socket API
            </Typography>
            <TabContext value={tab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList centered onChange={(event, newValue) => setTab(newValue)}>
                  <Tab label='Sign in' value='1' />
                  <Tab label='Sign up' value='2' />
                </TabList>
              </Box>

              <TabPanel value='1'>
                <Box component='form' onSubmit={(e) => handleSignin(e)}>
                  <Grid direction='row' justifyContent='flex-start'>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        autoComplete='username'
                        value={username}
                        sx={{ marginBottom: '1rem' }}
                        onChange={(e) => setUsername(e.target.value)} />

                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id='password'
                        label='Password'
                        type='password'
                        autoComplete='current-password'
                        value={password}
                        sx={{ marginBottom: '2rem' }}
                        onChange={(e) => setPassword(e.target.value)} />

                    </Grid>

                    <Grid item xs={12}>
                      <Tooltip title={(connectionStatus !== 'Open') ? 'Lost Connection to Server' : ''}  arrow>
                        <div>
                          <Button 
                            fullWidth
                            variant='contained' 
                            type='submit' 
                            disabled={connectionStatus !== 'Open'}>

                            Sign in
                          </Button>
                        </div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value='2'>
                <Box component='form' onSubmit={(e) => handleSignup(e)}>
                  <Grid direction='row' justifyContent='flex-start'>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id='username'
                        label='Username'
                        autoComplete='username'
                        value={username}
                        sx={{ marginBottom: '1rem' }}
                        onChange={(e) => setUsername(e.target.value)} />

                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id='password'
                        label='Password'
                        type='password'
                        autoComplete='current-password'
                        value={password}
                        sx={{ marginBottom: '2rem' }}
                        onChange={(e) => setPassword(e.target.value)} />

                    </Grid>

                    <Grid item xs={12}>
                      <Tooltip title={(connectionStatus !== 'Open') ? 'Lost Connection to Server' : ''}  arrow>
                        <div>
                          <Button 
                            fullWidth
                            variant='contained' 
                            type='submit' 
                            disabled={connectionStatus !== 'Open'}>

                            Sign up
                          </Button>
                        </div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </TabContext>
          </div>
        )}
      </div>

      <Box sx={{ '& > :not(style)': { m: 1, position: 'fixed', top: '90%', right: '1.5%' } }}>
        <Fab variant='extended' aria-label={connectionStatus}>
          {(connectionStatus === 'Open') ? <Check sx={{ mr: 1 }} color={connectionColor} /> : null}
          {(connectionStatus === 'Closed') ? <Error sx={{ mr: 1 }} color={connectionColor} /> : null}
          {(connectionStatus === 'Uninstantiated') ? <HourglassEmpty sx={{ mr: 1 }} color={connectionColor} /> : null}
          {((connectionStatus === 'Connecting') || (connectionStatus === 'Closing')) ? (
            <Warning color={connectionColor} />
          ) : null}

          {connectionStatus}
        </Fab>
      </Box>

      <Snackbar
        message={error}
        open={(error !== null)}
        autoHideDuration={3000}
        onClose={() => setError(null)}>

        <Alert severity='error' sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </div>
  );
}

export default App;
