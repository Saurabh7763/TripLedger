import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import Loading from '../components/Loading';
import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { showSuccess } from '../utils/showToast';

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

    await firestore().collection('trips').add({
      place,
      country,
      userId: user.uid,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    setLoading(false);
    showSuccess('Trip Created ✈️');
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <View style={tailwind`flex justify-between h-full mx-4`}>
        
        <View>
          <View style={tailwind`relative`}>
            <View style={tailwind`absolute top-0 left-0 z-10`}>
             
              <BackButton />
            </View>
            <Text
              style={tailwind`text-xl font-bold text-center ${colors.heading}`}
            >
              Add Trip
            </Text>
          </View>

          <View style={tailwind`flex-row justify-center my-3`}>
            <Image
              source={require('../assets/images/4.png')}
              style={tailwind`h-72 w-72`}
            />
          </View>

          <View style={tailwind`mx-2 gap-1`}>
            <Text style={tailwind`${colors.heading} font-bold text-lg`}>
              Which Place?
            </Text>
            <TextInput
              style={tailwind`bg-white rounded-xl p-4 mb-3`}
              value={place}
              onChangeText={setPlace}
            />

            <Text style={tailwind`${colors.heading} font-bold text-lg`}>
              Which Country?
            </Text>
            <TextInput
              style={tailwind`bg-white rounded-xl p-4 mb-3`}
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>
        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleAddTrip}
              style={[
                tailwind`p-3 m-2 mb-2 rounded-full`,
                { backgroundColor: colors.button },
              ]}
            >
              <Text style={tailwind`text-center text-lg font-bold text-white`}>
                Add Trip
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddTripScreen;
