import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay, 
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const logoScale = useSharedValue(0.3);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const btnTranslateY = useSharedValue(30);
  const btnOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 1000 });
    
    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(400, withSpring(0));
    
    btnOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    btnTranslateY.value = withDelay(800, withSpring(0));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }]
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
    transform: [{ translateY: btnTranslateY.value }]
  }));

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      <View style={tailwind`h-full flex justify-around items-center px-8`}>
        
        <Animated.View style={[tailwind`items-center`, logoStyle]}>
          <View style={[
            tailwind`p-4 rounded-[40px]`,
            { 
              backgroundColor: theme.card,
              shadowColor: theme.button,
              shadowOpacity: 0.2,
              shadowRadius: 25,
              shadowOffset: { width: 0, height: 10 },
              elevation: 20
            }
          ]}>
            <Image
              source={require('../assets/images/welcomelogo.png')}
              style={tailwind`h-64 w-64`}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        <View style={tailwind`w-full`}>
          <Animated.View style={[tailwind`items-center mb-10`, textStyle]}>
            <Text style={[
              tailwind`text-5xl font-black mb-2 tracking-tighter`,
              { color: theme.text }
            ]}>
              TripLedger
            </Text>
            <Text style={[
              tailwind`text-lg font-bold text-center px-4`,
              { color: theme.subText }
            ]}>
              Your premium companion for effortless group expense tracking.
            </Text>
          </Animated.View>

          <Animated.View style={[tailwind`w-full`, btnStyle]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('SignIn')}
              style={[
                tailwind`py-5 rounded-[24px] mb-4 items-center shadow-lg`,
                { 
                  backgroundColor: theme.button,
                  shadowColor: theme.button,
                  shadowOpacity: 0.3,
                  shadowRadius: 15,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 10
                }
              ]}
            >
              <Text style={[tailwind`text-xl font-black`, { color: theme.buttonText }]}>
                Get Started
              </Text>
            </TouchableOpacity>

            <View style={tailwind`flex-row justify-center items-center`}>
              <View style={[tailwind`h-[1px] w-8`, { backgroundColor: theme.divider }]} />
              <Text style={[tailwind`mx-4 font-bold`, { color: theme.placeholder }]}>
                Premium Experience
              </Text>
              <View style={[tailwind`h-[1px] w-8`, { backgroundColor: theme.divider }]} />
            </View>
          </Animated.View>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
