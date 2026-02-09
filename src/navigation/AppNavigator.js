import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useDispatch, useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth';
import { setUser } from '../redux/slice/userSlice.js'
import HomeScreen from '../screens/HomeScreen'
import AddTripScreen from '../screens/AddTripScreen'
import AddExpenseScreen from '../screens/AddExpenseScreen'
import TripExpenseScreen from '../screens/TripExpenseScreen.jsx'
import WelcomeScreen from '../screens/WelcomeScreen.jsx'
import SignInScreen from '../screens/SignInScreen.jsx'
import SignUpScreen from '../screens/SignUpScreen.jsx'

const Stack = createNativeStackNavigator()

const AppNavigator = () => {

  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()

  
  useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged(user => {
    console.log("AUTH CHANGED:", user);
    dispatch(setUser(user));
  });

  return unsubscribe;
}, []);

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddTrip" component={AddTripScreen} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          <Stack.Screen name="TripExpense" component={TripExpenseScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default AppNavigator
