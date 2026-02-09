import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'
import { auth } from './firebaseConfig'

export const createUser = (email , password)=>{
    return createUserWithEmailAndPassword(auth, email, password)
}

export const Login = (email, password)=>{
    return signInWithEmailAndPassword(auth, email, password)
}

export const Logout = ()=>{
    return signOut(auth)
}

