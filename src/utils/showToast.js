import Toast from 'react-native-toast-message';

export const showSuccess = (title, message = '') => {
  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 2500,
  });
};

export const showError = (title, message = '') => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
};
