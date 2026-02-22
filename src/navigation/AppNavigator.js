import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import { listenToAuthChanges } from '../firebase/AuthListner'
import ProfileScreen from '../screens/ProfileScreen.jsx'
import HomeScreen from '../screens/HomeScreen'
import AddTripScreen from '../screens/AddTripScreen'
import AddExpenseScreen from '../screens/AddExpenseScreen'
import TripExpenseScreen from '../screens/TripExpenseScreen'
import WelcomeScreen from '../screens/WelcomeScreen'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import Loading from '../components/Loading'
import NotificationScreen from '../screens/NotificationScreen.jsx'
import AllTripScreen from '../screens/AllTripScreen.jsx'
import HelpScreen from '../screens/HelpScreen.jsx'


const Stack = createNativeStackNavigator()

const AppNavigator = () => {

  const { user, userLoading } = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(dispatch)
    return unsubscribe
  }, [])

  
  if (userLoading) {
    return <Loading />
  }

  return (
    <>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTrip" component={AddTripScreen} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          <Stack.Screen name="TripExpense" component={TripExpenseScreen} />
          <Stack.Screen name='Profile' component={ProfileScreen}/>
          <Stack.Screen name='Notification' component={NotificationScreen}/>
          <Stack.Screen name='Trips' component={AllTripScreen}/>
          <Stack.Screen name='Help' component={HelpScreen}/>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </>
  )
}

export default AppNavigator
