import { getApp } from '@react-native-firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';


const db = getFirestore(getApp())

export const createUserInDatabase = async (user) => {
  try {
    const userDoc = doc(db, 'users', user.uid);

    await setDoc(userDoc, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      createdAt: serverTimestamp(),
      provider: 'google',
    }, { merge: true });

  } catch (error) {
    console.log('Create user db error:', error);
  }
};

//   await firestore().collection('users').doc(user.uid).set({
//     uid: user.uid,
//     name: user.displayName,
//     email: user.email,
//     photo: user.photoURL,
//     createdAt: firestore.FieldValue.serverTimestamp(),
//     provider: 'google',
//   });
// };
