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
import { Login } from '../firebase/firebaseServices';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { EnvelopeIcon, LockClosedIcon } from 'react-native-heroicons/outline';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!email || !password) {
      Snackbar.show({
        text: 'Email and Password are required!',
        backgroundColor: '#EF4444',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    try {
      setIsLoading(true);
      await Login(email.trim(), password);
    } catch (e) {
      Snackbar.show({
        text: e.message,
        backgroundColor: '#EF4444',
        duration: Snackbar.LENGTH_LONG,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tailwind`flex-1 px-6 pt-4`}>
            
            <View style={tailwind`flex-row justify-between items-center`}>
              <BackButton />
            </View>

            <View style={tailwind`mt-8 mb-6`}>
              <Text style={[tailwind`text-4xl font-extrabold tracking-tight`, { color: '#1E293B' }]}>
                Welcome Back
              </Text>
              <Text style={tailwind`text-slate-500 text-lg mt-1`}>
                Login to continue your trips
              </Text>
            </View>

            <View style={tailwind`items-center mb-8`}>
              <Image
                source={require('../assets/images/login.png')}
                style={{ width: 220, height: 220 }}
                resizeMode="contain"
              />
            </View>

            <View style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 32,
              shadowColor: '#64748B',
              shadowOpacity: 0.1,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
              elevation: 8,
              borderWidth: 1,
              borderColor: '#F1F5F9'
            }}>
              
              <Text style={tailwind`text-slate-700 font-semibold mb-2 ml-1`}>Email Address</Text>
              <View style={tailwind`flex-row items-center bg-slate-50 rounded-2xl px-4 mb-4 border border-slate-100`}>
                <EnvelopeIcon size={20} color="#94A3B8" />
                <TextInput
                  placeholder="name@example.com"
                  placeholderTextColor="#94A3B8"
                  style={tailwind`flex-1 px-3 py-4 text-slate-800 text-base`}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <Text style={tailwind`text-slate-700 font-semibold mb-2 ml-1`}>Password</Text>
              <View style={tailwind`flex-row items-center bg-slate-50 rounded-2xl px-4 border border-slate-100`}>
                <LockClosedIcon size={20} color="#94A3B8" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  style={tailwind`flex-1 px-3 py-4 text-slate-800 text-base`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={tailwind`mt-3 self-end`}>
                <Text style={{ color: colors.button, fontWeight: '600' }}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={tailwind`mt-8`}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    style={{
                      backgroundColor: colors.button,
                      paddingVertical: 18,
                      borderRadius: 20,
                      alignItems: 'center',
                      shadowColor: colors.button,
                      shadowOpacity: 0.3,
                      shadowRadius: 12,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 6
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={tailwind`flex-row justify-center mt-8 pb-6`}>
              <Text style={tailwind`text-slate-500 text-base`}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ color: colors.button, fontSize: 16, fontWeight: 'bold' }}>Sign Up</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignInScreen;
