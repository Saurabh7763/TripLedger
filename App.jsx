import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';
import { store } from './src/redux/store/store';
import './src/firebase/GoogleConfig';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/AppToast';

const App = () => {
  return (
    <Provider store={store}>
      
      <AppNavigator /> 
      <Toast config={toastConfig} />
    </Provider>
  );
};

export default App;
