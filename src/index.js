import React from 'react';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import { Logger } from 'aws-amplify';

const logger = new Logger('AWSS3Provider');
logger.level = 'error'; // Change the log level to 'error' to suppress warnings

Amplify.configure(config);

const theme = createTheme();

const root = document.getElementById('root');
createRoot(root).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);