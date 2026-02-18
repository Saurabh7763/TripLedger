import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import Snackbar from 'react-native-snackbar';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showSuccess } from '../utils/showToast';

const db = getFirestore(getApp())

const AddTripScreen = () => {
  const [place, setPlace] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.user);
  const navigation = useNavigation();

  const handleAddTrip = async () => {
    if (!place || !country) {
      Snackbar.show({
        text: 'Place and country are required!',
        backgroundColor: 'red',
      });
      return;
    }

    setLoading(true);

    const tripsRef = collection(db, 'trips')

    await addDoc(tripsRef, {
      place,
      country,
      userId: user.uid,
      createdAt: serverTimestamp(),
    })

    setLoading(false);
    showSuccess('Trip Created ✈️');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
      <View style={tailwind`flex-1 justify-between`}>

       
        <View style={tailwind`px-4 pt-2`}>
          <View style={tailwind`flex-row items-center justify-between`}>
            <BackButton />
            <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
              Create Trip
            </Text>
            <View style={{ width: 40 }} />
          </View>
        </View>

        
        <View
          style={[tailwind`bg-green-400`,{
            marginHorizontal: 20,
            marginTop: 15,
            borderRadius: 26,
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
            elevation: 10,
          }]}
        >
          <Image
            source={require('../assets/images/4.png')}
            style={{ height: 180, width: 180, marginBottom: 10 }}
            resizeMode="contain"
          />

          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Plan a new adventure ✈️
          </Text>

          <Text
            style={{
              color: '#E0E7FF',
              textAlign: 'center',
              marginTop: 6,
              paddingHorizontal: 10,
            }}
          >
            Add your destination and start tracking expenses instantly.
          </Text>
        </View>


        
        <View style={tailwind`px-5 mt-6`}>

         
          <Text style={tailwind`text-slate-600 font-semibold mb-2`}>
            Destination
          </Text>

          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 6,
              marginBottom: 18,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <TextInput
              placeholder="e.g. Manali"
              placeholderTextColor="#94A3B8"
              style={{ fontSize: 16 }}
              value={place}
              onChangeText={setPlace}
            />
          </View>

          
          <Text style={tailwind`text-slate-600 font-semibold mb-2`}>
            Country
          </Text>

          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              paddingHorizontal: 16,
              paddingVertical: 6,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 4,
            }}
          >
            <TextInput
              placeholder="e.g. India"
              placeholderTextColor="#94A3B8"
              style={{ fontSize: 16 }}
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>


      
        <View style={tailwind`px-5 pb-6`}>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddTrip}
              style={{
                backgroundColor:colors.button,
                paddingVertical: 18,
                borderRadius: 20,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
                Create Trip
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

export default AddTripScreen;
