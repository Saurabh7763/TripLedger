import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { googleSignup } from '../firebase/googleSignup';
import { showSuccess, showError } from '../utils/showToast';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const Image1TranslateY = useSharedValue(30);
  const Image2TranslateY = useSharedValue(30);
  const Image1Opacity = useSharedValue(0);
  const Image2Opacity = useSharedValue(0);

  useEffect(() => {
    Image1TranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });
    Image1Opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    setTimeout(() => {
      Image2TranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });
      Image2Opacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, 200);
  }, []);

  const Image1animatedstyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Image1TranslateY.value }],
    opacity: Image1Opacity.value,
  }));

    const Image2animatedstyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Image2TranslateY.value }],
    opacity: Image2Opacity.value,
  }));


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
        <Animated.View style={[tailwind`flex-row justify-center `,Image1animatedstyle]}>
          <Image
            source={require('../assets/images/welcomelogo.png')}
            style={tailwind`w-96 h-96`}
          />
        </Animated.View>

        <View style={tailwind`mx-5`}>
          <Animated.Image 
            source={require('../assets/images/my-TripLedger.png')}
           style={[tailwind`mx-auto h-10 mb-10`,Image2animatedstyle]}
          />

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
