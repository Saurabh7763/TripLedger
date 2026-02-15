import firestore from '@react-native-firebase/firestore';

export const createUserInDatabase = async user => {
  await firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    createdAt: firestore.FieldValue.serverTimestamp(),
    provider: 'google',
  });
};
