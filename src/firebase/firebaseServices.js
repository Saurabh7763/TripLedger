import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { createUserInDatabase } from './createUserInDatabase';

const app = getApp();
const auth = getAuth(app);

export const Login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const createUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  
  await createUserInDatabase(userCredential.user);

  return userCredential.user;
};

export const Logout = async () => {
  await signOut(auth);
};
