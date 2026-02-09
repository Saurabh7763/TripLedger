import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import {colors} from '../theme/index'
import randomImage from '../assets/images/randomImage'
import EmptyList from '../components/EmptyList'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { getDocs, query, where } from 'firebase/firestore'
import { tripsRef } from '../firebase/firebaseConfig'
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message'
import { showSuccess } from '../utils/showToast'

const HomeScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state=>state.user)
  const [trips, setTrips] = useState([])
  const isFocused = useIsFocused()

  const fetchTrips = async()=>{
    const q = query(tripsRef, where("userId", "==", user.uid))

    const querySnapshot = await getDocs(q)

    let data = []
    querySnapshot.forEach(doc=>{
      data.push({...doc.data(), id:doc.id})
    })
    setTrips(data)
  }

  useEffect(()=>{
    if(isFocused)
      fetchTrips()
  },[isFocused])

  const handleLogout = async () => {
  try {
    // logout firebase
    await auth().signOut();

    // logout google
    await GoogleSignin.signOut();
    showSuccess("Logged Out Successfully")

  } catch (e) {
    console.log('Logout error:', e);
  }
};
  const handleTrip = ()=>{
    navigation.navigate('AddTrip')
  }
  return (
<SafeAreaView style={tailwind`flex-1`}>
  
  
  <View>
  
    <View style={tailwind`flex-row justify-between items-center p-3`}>
      <Text style={tailwind`text-3xl font-bold ${colors.heading}`}>
        TripLedger
      </Text>
      <TouchableOpacity style={tailwind`bg-white p-2 px-3 rounded-full border`}
         onPress={handleLogout}
      >
        <Text style={tailwind`${colors.heading}`}>Logout</Text>
      </TouchableOpacity>
    </View>

    
    <View style={tailwind`items-center justify-center bg-blue-200 mx-4 mb-4 rounded-xl`}>
      <Image
        source={require('../assets/images/banner.png')}
        style={tailwind`h-48 w-full`}
        resizeMode="contain"
      />
      <Text style={tailwind`text-white font-bold -mt-5 mb-2`}>
        Smart expense tracking for every trip.
      </Text>
    </View>

   
    <View style={tailwind`px-4 flex-row justify-between items-center mb-3`}>
      <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
        Recent trips
      </Text>
      <TouchableOpacity
        style={tailwind`bg-white p-2 px-3 rounded-full border`}
        onPress={handleTrip}
      >
        <Text style={tailwind`${colors.heading}`}>Add Trip</Text>
      </TouchableOpacity>
    </View>
  </View>

  
  <FlatList
    style={tailwind`flex-1 px-4`}
    data={trips}
    numColumns={2}
    ListEmptyComponent={<EmptyList message={"You haven't recorder any trips yet"}/>}
    keyExtractor={item => item.id.toString()}
    showsVerticalScrollIndicator={false}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    contentContainerStyle={{ paddingBottom: 120 }}
    renderItem={({ item }) => (
      <TouchableOpacity style={tailwind`bg-white p-3 rounded-2xl mb-3 shadow-sm`}
        onPress={()=>navigation.navigate('TripExpense',{...item})}
      >
        <Image
          source={randomImage()}
          style={{ width: 135, height: 135 }}
          resizeMode="contain"
        />
        <Text style={tailwind`${colors.heading} text-center text-base font-bold`}>
          {item.place}
        </Text>
        <Text style={tailwind`${colors.heading} text-center text-sm`}>
          {item.country}
        </Text>
      </TouchableOpacity>
    )}
  />
</SafeAreaView>

  )
}

export default HomeScreen