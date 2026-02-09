import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const createUserInDatabase = async (user) => {
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    createdAt: new Date(),
    provider: 'google'
  });
};
