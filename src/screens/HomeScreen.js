import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';


const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.user);
  const [trips, setTrips] = useState([]);
  const isFocused = useIsFocused();

  const fetchTrips = async () => {
    const snapshot = await firestore()
      .collection('trips')
      .where('userId', '==', user.uid)
      .get();

    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setTrips(data);
  };

  useEffect(() => {
    if (isFocused && user) {
      fetchTrips();
    }
  }, [isFocused, user]);

  

  return (
    <SafeAreaView style={tailwind`flex-1`}>
      <View>
        <View style={tailwind`flex-row justify-between items-center p-3`}>
        <View style={tailwind`flex-row items-center`}>
        <TouchableOpacity
          style={tailwind`border rounded-full p-2 mr-5`}
          onPress={()=>navigation.navigate('Profile')}
        >
          <Image 
            source={require('../assets/images/user.png')}
              style={tailwind`w-7 h-7`}
            />
        </TouchableOpacity>
        <Text style={tailwind`text-3xl font-bold ${colors.heading}`}>
            TripLedger
          </Text>
        </View>
          
          
        </View>
        <View
          style={tailwind`items-center justify-center bg-green-200 mx-4 mb-4 rounded-5`}
        >
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
            style={[tailwind`bg-white p-2 px-3 rounded-full`,{backgroundColor:colors.button}]}
            onPress={() => navigation.navigate('AddTrip')}
          >
            <Text style={tailwind`text-white`}>Add Trip</Text>
          </TouchableOpacity>
        </View>
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
        contentContainerStyle={{ paddingBottom: 120 }}
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
            <Text
              style={tailwind`${colors.heading} text-center text-base font-bold`}
            >
              {item.place}
            </Text>
            <Text style={tailwind`${colors.heading} text-center text-sm`}>
              {item.country}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
