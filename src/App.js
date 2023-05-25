import React from 'react';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import FileBrowser from './FileBrowser';

function App() {
  return (
    <div className="App">
      <FileBrowser />
    </div>
  );
}

export default withAuthenticator(App);