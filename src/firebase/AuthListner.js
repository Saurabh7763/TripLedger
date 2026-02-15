import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { setUser, setUserLoading } from '../redux/slice/userSlice';

export const listenToAuthChanges = (dispatch) => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, user => {

    console.log("AUTH STATE:", user?.email);

    if (user) {
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || '',
          photo: user.photoURL || ''
        })
      );
    } else {
      dispatch(setUser(null));
    }

    
    dispatch(setUserLoading(false));
  });

  return unsubscribe;
};
