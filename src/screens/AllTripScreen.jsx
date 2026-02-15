import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import { useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import randomImage from '../assets/images/randomImage';


const AllTripScreen = () => {
    const navigation = useNavigation()
    const[trips, setTrips] = useState([])
    const {user} = useSelector(state=>state.user)
    const isFocused = useIsFocused()

    const fetchTrips = async () => {
        const snapshot = await firestore()
            .collection('trips')
            .where('userId', '==', user.uid)
            .get();

            let data =[]
            snapshot.forEach(doc=>{
                data.push({id:doc.id, ...doc.data()})
                setTrips(data)
            })
    }

    useEffect(()=>{
        if(isFocused && user)
            fetchTrips()
    },[isFocused, user])


 return (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1 }}>
      
      <View style={tailwind`flex-row items-center mx-4 mb-5`}>
        <BackButton />
        <Text
          style={[
            tailwind`font-bold text-lg ml-3`,
            { color: colors.heading },
          ]}
        >
          Your Trips
        </Text>
      </View>

      <FlatList
        style={tailwind`flex-1 px-4`}
        data={trips}
        numColumns={2}
        ListEmptyComponent={
          <EmptyList message={"You haven't recorded any trips yet"} />
        }
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tailwind`bg-white p-3 rounded-2xl mb-3 shadow-sm`}
            onPress={() => navigation.navigate('TripExpense', { ...item })}
          >
            <Image
              source={randomImage()}
              style={{ width: 135, height: 135 }}
              resizeMode="contain"
            />
            <Text style={tailwind`text-center text-base font-bold`}>
              {item.place}
            </Text>
            <Text style={tailwind`text-center text-sm`}>
              {item.country}
            </Text>
            <Text style={tailwind`text-center`}>
               {item.createdAt
                 ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                 : ""}
            </Text>
          </TouchableOpacity>
        )}
      />

    </View>
  </SafeAreaView>
);

};

export default AllTripScreen;
