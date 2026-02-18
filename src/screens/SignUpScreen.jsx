import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import Snackbar from 'react-native-snackbar';
import { createUser } from '../firebase/firebaseServices';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userLoading } = useSelector(state => state.user);

  const handleSubmit = async () => {
    if (!email || !password) {
      Snackbar.show({
        text: 'Email and Password are required!',
        backgroundColor: 'red',
      });
      return;
    }

    // Firebase minimum password rule
    if (password.length < 6) {
      Snackbar.show({
        text: 'Password must be at least 6 characters',
        backgroundColor: 'red',
      });
      return;
    }

    try {
      await createUser(email.trim(), password);
    } catch (e) {
      Snackbar.show({
        text: e.message,
        backgroundColor: 'red',
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEF2FF' }}>
      
      {/* This prevents keyboard from covering inputs */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        
        {/* This makes screen scrollable */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          
          <View style={tailwind`flex-1 px-5`}>

            {/* Back Button */}
            <BackButton />

            {/* Heading */}
            <Text
              style={[
                tailwind`text-3xl font-bold mt-4`,
                { color: colors.heading },
              ]}
            >
              Create Account ✨
            </Text>

            <Text style={tailwind`text-gray-500 mt-2`}>
              Start tracking your trip expenses
            </Text>

            {/* Illustration */}
            <View style={tailwind`items-center my-6`}>
              <Image
                source={require('../assets/images/signup.png')}
                style={{ width: 240, height: 240 }}
                resizeMode="contain"
              />
            </View>

            {/* Form Card */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 24,
                elevation: 10,
              }}
            >

              {/* Email */}
              <Text style={tailwind`text-gray-600 mb-2`}>Email</Text>
              <TextInput
                placeholder="example@gmail.com"
                placeholderTextColor="#94A3B8"
                style={tailwind`bg-gray-100 rounded-xl px-4 py-4 mb-4`}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />

              {/* Password */}
              <Text style={tailwind`text-gray-600 mb-2`}>Password</Text>
              <TextInput
                placeholder="Minimum 6 characters"
                placeholderTextColor="#94A3B8"
                style={tailwind`bg-gray-100 rounded-xl px-4 py-4`}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
              />

              {/* Button */}
              <View style={tailwind`mt-6`}>
                {userLoading ? (
                  <Loading />
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                      backgroundColor: colors.button,
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 17,
                        fontWeight: 'bold',
                      }}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
