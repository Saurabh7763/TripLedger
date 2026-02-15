import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

export const googleSignup = async () => {
  try {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();

    const { idToken } = userInfo.data;

    const googleCredential = GoogleAuthProvider.credential(idToken);

    const auth = getAuth(getApp());
    const userCredential = await signInWithCredential(auth, googleCredential);

    return userCredential.user;
  } catch (error) {
    console.log('Google Signup Error:', error);
    throw error;
  }
};
