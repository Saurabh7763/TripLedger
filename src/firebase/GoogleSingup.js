import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const googleSignup = async () => {
  try {

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // ⭐ FORCE account picker
    await GoogleSignin.signOut();

    // Now open chooser
    const userInfo = await GoogleSignin.signIn();

    const { idToken } = await GoogleSignin.getTokens();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userCredential = await auth().signInWithCredential(googleCredential);

    return userCredential.user;

  } catch (error) {
    console.log('Google Signup Error:', error);
    throw error;
  }
};
