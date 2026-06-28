import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import Loading from '../components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading } from '../redux/slice/userSlice';
import { showError } from '../utils/showToast';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';

import { googleSignup } from '../firebase/googleSignup';

const auth = getAuth(getApp());

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { userLoading } = useSelector(state => state.user);
  const { theme, isDark } = useTheme();
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (email && password) {
      try {
        dispatch(setUserLoading(true));
        await signInWithEmailAndPassword(auth, email, password);
        dispatch(setUserLoading(false));
      } catch (e) {
        dispatch(setUserLoading(false));
        showError('Login Failed', e.message);
      }
    } else {
      showError('Required', 'Please fill all fields');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await googleSignup();
      setGoogleLoading(false);
    } catch (e) {
      setGoogleLoading(false);
      showError('Google Login Failed', e.message);
    }
  };

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tailwind`px-8 pt-4`}>
          <BackButton />
          
          <View style={tailwind`mt-10 mb-10 items-center`}>
            <Image
              source={require('../assets/images/login.png')}
              style={tailwind`h-56 w-56`}
              resizeMode="contain"
            />
          </View>

          <View style={tailwind`mb-10`}>
            <Text style={[tailwind`text-4xl font-black mb-2`, { color: theme.text }]}>Welcome Back</Text>
            <Text style={[tailwind`text-base font-bold`, { color: theme.subText }]}>Login to continue your journeys</Text>
          </View>

          <View style={tailwind`gap-y-6`}>
            <View>
              <Text style={[tailwind`font-bold mb-3 ml-1`, { color: theme.subText }]}>EMAIL ADDRESS</Text>
              <View style={[tailwind`flex-row items-center rounded-2xl px-4 border shadow-sm`, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <EnvelopeIcon size={20} color={theme.placeholder} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.placeholder}
                  style={[tailwind`flex-1 px-3 py-4 text-lg font-bold`, { color: theme.text }]}
                />
              </View>
            </View>

            <View>
              <Text style={[tailwind`font-bold mb-3 ml-1`, { color: theme.subText }]}>PASSWORD</Text>
              <View style={[tailwind`flex-row items-center rounded-2xl px-4 border shadow-sm`, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <LockClosedIcon size={20} color={theme.placeholder} />
                <TextInput
                  value={password}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.placeholder}
                  style={[tailwind`flex-1 px-3 py-4 text-lg font-bold`, { color: theme.text }]}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeSlashIcon size={20} color={theme.placeholder} /> : <EyeIcon size={20} color={theme.placeholder} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={tailwind`items-end mb-4`}>
                <Text style={[tailwind`font-bold`, { color: theme.button }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={tailwind`mt-8`}>
            {userLoading ? (
              <Loading />
            ) : (
              <View style={tailwind`gap-y-4`}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSignIn}
                  style={[
                    tailwind`py-5 rounded-[24px] items-center shadow-lg`,
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
                  <Text style={[tailwind`text-xl font-black`, { color: theme.buttonText }]}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleGoogleSignIn}
                  disabled={googleLoading}
                  style={[
                    tailwind`py-5 rounded-[24px] items-center flex-row justify-center border shadow-sm`,
                    { 
                      backgroundColor: theme.card,
                      borderColor: theme.cardBorder,
                      shadowColor: theme.text,
                      shadowOpacity: 0.05,
                      opacity: googleLoading ? 0.7 : 1
                    }
                  ]}
                >
                  {googleLoading ? (
                    <ActivityIndicator size="small" color={theme.button} style={tailwind`mr-3`} />
                  ) : (
                    <Image 
                      source={require('../assets/images/googleIcon.png')} 
                      style={tailwind`w-6 h-6 mr-3`} 
                      resizeMode="contain"
                    />
                  )}
                  <Text style={[tailwind`text-lg font-black`, { color: theme.text }]}>
                    {googleLoading ? 'Signing in...' : 'Sign In with Google'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={tailwind`flex-row justify-center mt-10 mb-10`}>
            <Text style={[tailwind`font-bold`, { color: theme.subText }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[tailwind`font-black`, { color: theme.button }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;
