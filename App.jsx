import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigation from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import './src/firebase/GoogleConfig';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        translucent 
        backgroundColor="transparent" 
      />
      <AppNavigation />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
