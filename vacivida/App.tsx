import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import Routes from './routes';

import theme from './src/global/theme';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </PaperProvider>
  );
}
