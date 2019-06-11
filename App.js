import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from './src/AppContainer';

export default function App() {
  return (
    <PaperProvider>
      <AppContainer />
    </PaperProvider>
  );
}
