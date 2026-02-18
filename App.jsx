import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store/store';
import './src/firebase/GoogleConfig';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/AppToast';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    
      <Provider store={store}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast config={toastConfig} />

      </Provider>

  );
};

export default App;
