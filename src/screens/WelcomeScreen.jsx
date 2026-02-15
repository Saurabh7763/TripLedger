import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { googleSignup } from '../firebase/googleSignup';
import { showSuccess, showError } from '../utils/showToast';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleGoogleSignup = async () => {
    try {
      const user = await googleSignup();
      showSuccess('Welcome 👋', user?.displayName || user?.email);
    } catch (e) {
      showError('Login Failed', e.message);
    }
  };

  return (
    <SafeAreaView>
      <View style={tailwind`flex h-full justify-evenly`}>
        <View style={tailwind`flex-row justify-center mt-10`}>
          <Image
            source={require('../assets/images/welcomelogo.png')}
            style={tailwind`w-96 h-96`}
          />
        </View>

        <View style={tailwind`mx-5`}>
          <Text
            style={tailwind`text-center text-4xl mb-10 font-bold ${colors.heading}`}
          >
            TripLedger
          </Text>

          <TouchableOpacity
            style={[
              tailwind`py-3 rounded-full mb-3`,
              { backgroundColor: colors.button },
            ]}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={tailwind`text-lg font-bold text-white text-center`}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tailwind`py-3 rounded-full mb-3`,
              { backgroundColor: colors.button },
            ]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={tailwind`text-lg font-bold text-white text-center`}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tailwind`py-3 rounded-full mb-3 bg-gray-300 flex-row items-center justify-center`}
            onPress={handleGoogleSignup}
          >
            <Image
              source={require('../assets/images/googleIcon.png')}
              style={tailwind`h-7 w-7 mr-4`}
            />
            <Text
              style={tailwind`text-lg font-bold ${colors.heading} text-center`}
            >
              Continue with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
