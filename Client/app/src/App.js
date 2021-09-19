import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import TextField from  '@mui/material/TextField';

import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';

import './App.css';

function App() {
  const [socketUrl, setSocketUrl] = useState('ws://localhost:8080');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('1');
  const [error, setError] = useState(null);

  const {
    readyState,
    getWebSocket,
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
        setUsername('');
        setPassword('');
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

    }, 20000);

    return () => clearInterval(ping);

  }, []);

  React.useEffect(() => {
    if (!token) {
      localStorage.clear();
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

  return (
    <div className='App'>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {(token) ? (
          <div>
            <h3>Token</h3>
            <pre>{token}</pre>
            <Tooltip title={(connectionStatus !== 'Open') ? 'Lost Connection to Server' : ''}  arrow>
              <div>
                <Button 
                  variant='contained' 
                  onClick={() => setToken(null)}>

                  Clear Token
                </Button>
              </div>
            </Tooltip>
          </div>
        ) : (
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={(event, newValue) => setTab(newValue)} aria-label='lab API tabs example'>
                <Tab label='Signup' value='1' />
                <Tab label='Signin' value='2' />
              </TabList>
            </Box>

            <TabPanel value='1'>
              <Box component='form' onSubmit={(e) => handleSignup(e)}>
                <TextField
                  required
                  id='username'
                  label='Username'
                  autoComplete='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} />

                <TextField
                  required
                  id='password'
                  label='Password'
                  type='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />

                <Tooltip title={(connectionStatus !== 'Open') ? 'Lost Connection to Server' : ''}  arrow>
                  <div>
                    <Button 
                      variant='contained' 
                      type='submit' 
                      disabled={connectionStatus !== 'Open'}>

                      Signup
                    </Button>
                  </div>
                </Tooltip>
              </Box>
            </TabPanel>

            <TabPanel value='2'>
              <Box component='form' onSubmit={(e) => handleSignin(e)}>
                <TextField
                  required
                  id='username'
                  label='Username'
                  autoComplete='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} />

                <TextField
                  required
                  id='password'
                  label='Password'
                  type='password'
                  autoComplete='current-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />

                <Tooltip title={(connectionStatus !== 'Open') ? 'Lost Connection to Server' : ''}  arrow>
                  <div>
                    <Button 
                      variant='contained' 
                      type='submit' 
                      disabled={connectionStatus !== 'Open'}>

                      Signin
                    </Button>
                  </div>
                </Tooltip>
              </Box>
            </TabPanel>
          </TabContext>
        )}
      </div>

      <Box sx={{ '& > :not(style)': { m: 1, position: 'fixed', top: '90%', right: '1.5%' } }}>
        <Fab variant='extended' aria-label={connectionStatus}>
          {(connectionStatus === 'Open') ? <CheckIcon sx={{ mr: 1 }} color={connectionColor} /> : null}
          {(connectionStatus === 'Closed') ? <ErrorIcon sx={{ mr: 1 }} color={connectionColor} /> : null}
          {(connectionStatus === 'Uninstantiated') ? <HourglassEmptyIcon sx={{ mr: 1 }} color={connectionColor} /> : null}
          {((connectionStatus === 'Connecting') || (connectionStatus === 'Closing')) ? (
            <WarningIcon color={connectionColor} />
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
