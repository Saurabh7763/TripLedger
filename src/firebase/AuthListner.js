import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebaseConfig'
import { setUser, setUserLoading } from '../redux/slice/userSlice'

export const listenToAuthChanges = (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email
        })
      )
    } else {
      dispatch(setUser(null))
    }

    dispatch(setUserLoading(false))
  })
}
