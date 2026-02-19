import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import ProfileFeatures  from '../components/ProfileFeatures'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { showSuccess } from '../utils/showToast';
import { useSelector } from 'react-redux';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';

const db = getFirestore(getApp())
const auth = getAuth(getApp())
const ProfileScreen = () => {
  const navigation = useNavigation();
  const [tripsCount, setTripCount] = useState(0)
  const isFocused = useIsFocused();

  const { user } = useSelector(state => state.user);

  const fetchTripCount = async () => {
  try {
    const tripsRef = collection(db, 'trips')
    const q = query(tripsRef, where("userId", "==", user.uid))
    const snapshot = await getDocs(q);
   setTripCount(snapshot.size);

  } catch (error) {
    console.log('Trip Count Error:', error);
  }
};


  useEffect(() => {
  if (isFocused && user) {
    fetchTripCount();
  }
}, [isFocused, user]);


  const handleLogout = async () => {
    await signOut(auth)
    await GoogleSignin.signOut();
    showSuccess('Logged Out Successfully');
  };

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
      <ScrollView showsVerticalScrollIndicator={false}>

       
        <View style={tailwind`flex-row justify-between items-center px-5 pt-3`}>
          <BackButton />
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Image
              source={require('../assets/images/notification.png')}
              style={tailwind`h-9 w-9`}
            />
          </TouchableOpacity>
        </View>

        
        <View style={tailwind`mt-5 mx-4 bg-white p-5 rounded-3xl shadow-md items-center`}>
          
          <View style={[tailwind`p-1 rounded-full`,{backgroundColor:colors.button}]}>
            <Image
              source={require('../assets/images/user.png')}
              style={tailwind`h-24 w-24 bg-white rounded-full p-4`}
            />
          </View>

          <Text style={[tailwind`text-2xl font-bold mt-3`, { color: colors.heading }]}>
            Hi 👋, {user?.email?.split('@')[0]}
          </Text>

          <Text style={tailwind`text-gray-500 mt-1`}>
            {user?.email}
          </Text>
        </View>

       
        <View style={tailwind`flex-row justify-between mx-4 mt-6`}>
          
          <View style={tailwind`flex-1 bg-indigo-100 mr-2 p-4 rounded-2xl items-center`}>
            <Text style={[tailwind`text-2xl font-bold`, { color: colors.heading }]}>{tripsCount}</Text>
            <Text style={tailwind`text-gray-500`}>Trips</Text>
          </View>


        </View>

      
        <View style={tailwind`mt-5 mx-4`}>

          <ProfileFeatures
            title="Your Trips"
            link={require('../assets/images/trips.png')}
            handlePress = {()=>navigation.navigate('Trips')}
          />
          <ProfileFeatures
            title="Notification Settings"
            link={require('../assets/icons/NotiSetting.png')}
            handlePress = {()=>navigation.navigate('Notification')}
          />
          <ProfileFeatures
            title="Support"
            link={require('../assets/icons/support.png')}
          
          />

        </View>

     
        <View style={tailwind`mt-5 mx-4 mb-10`}>
          <TouchableOpacity
            style={tailwind`bg-red-500 p-4 rounded-2xl items-center`}
            onPress={handleLogout}
          >
            <Text style={tailwind`text-white text-lg font-bold`}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
