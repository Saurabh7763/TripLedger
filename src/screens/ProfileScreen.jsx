import { View, Text, Image, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import BackButton from '../components/BackButton';
import ProfileFeatures from '../components/ProfileFeatures';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { showSuccess } from '../utils/showToast';
import { useSelector } from 'react-redux';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, query, where, getDocs } from '@react-native-firebase/firestore';
import { 
  BellIcon, 
  ArrowLeftOnRectangleIcon, 
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  MapIcon,
  MoonIcon,
  SunIcon
} from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';

const db = getFirestore(getApp());
const auth = getAuth(getApp());

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [tripsCount, setTripCount] = useState(0);
  const isFocused = useIsFocused();
  const { user } = useSelector(state => state.user);
  const { theme, isDark, toggleTheme } = useTheme();

  const fetchTripCount = async () => {
    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      setTripCount(snapshot.size);
    } catch (error) {
      console.log('Trip Count Error:', error);
    }
  };

  useEffect(() => {
    if (isFocused && user) {
      fetchTripCount();
    }
  }, [isFocused, user]);

  const handleLogout = async () => {
    await signOut(auth);
    await GoogleSignin.signOut();
    showSuccess('Logged Out Successfully');
  };

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View style={tailwind`flex-row justify-between items-center px-6 pt-4`}>
          <BackButton />
          <TouchableOpacity 
            activeOpacity={0.7}
            style={[
                tailwind`p-3 rounded-2xl shadow-sm border`, 
                { backgroundColor: theme.card, borderColor: theme.cardBorder, shadowColor: theme.text, shadowOpacity: 0.05 }
            ]}
            onPress={() => navigation.navigate('Notification')}
          >
            <BellIcon size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={tailwind`mt-8 mx-6 items-center`}>
          <View 
            style={[
              tailwind`p-1 rounded-[40px] shadow-xl`,
              { backgroundColor: theme.button, shadowColor: theme.button, shadowOpacity: 0.3 }
            ]}
          >
            <Image
              source={require('../assets/images/user.png')}
              style={[tailwind`h-32 w-32 rounded-[36px]`, { backgroundColor: theme.card }]}
            />
          </View>

          <Text style={[tailwind`text-3xl font-black mt-6`, { color: theme.text }]}>
            {user?.email?.split('@')[0]}
          </Text>
          <Text style={[tailwind`text-slate-500 font-bold mt-1`, { color: theme.subText }]}>
            {user?.email}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={tailwind`flex-row px-6 mt-10 gap-4`}>
          <View style={[
              tailwind`flex-1 p-6 rounded-[32px] border shadow-sm items-center`, 
              { backgroundColor: theme.card, borderColor: theme.cardBorder }
          ]}>
            <Text style={[tailwind`text-3xl font-black`, { color: theme.button }]}>{tripsCount}</Text>
            <Text style={[tailwind`font-black text-xs tracking-widest mt-1`, { color: theme.placeholder }]}>TRIPS</Text>
          </View>
          
          <View style={[
              tailwind`flex-1 p-6 rounded-[32px] border shadow-sm items-center`,
              { backgroundColor: theme.card, borderColor: theme.cardBorder }
          ]}>
            <Text style={[tailwind`text-3xl font-black`, { color: '#6366F1' }]}>0</Text>
            <Text style={[tailwind`font-black text-xs tracking-widest mt-1`, { color: theme.placeholder }]}>REVIEWS</Text>
          </View>
        </View>

        {/* Account Sections */}
        <View style={tailwind`mt-10 px-6`}>
          <Text style={[tailwind`font-black text-xs tracking-[2px] mb-6 ml-1`, { color: theme.placeholder }]}>ACCOUNT SETTINGS</Text>
          
          {/* Theme Toggle Row */}
          <View
            style={[
                tailwind`flex-row items-center p-5 rounded-[28px] mb-4 border shadow-sm`,
                { backgroundColor: theme.card, borderColor: theme.cardBorder }
            ]}
          >
            <View style={[tailwind`w-12 h-12 rounded-2xl items-center justify-center mr-4`, { backgroundColor: isDark ? '#334155' : '#FEF9C3' }]}>
              {isDark ? <MoonIcon size={24} color="#F1F5F9" /> : <SunIcon size={24} color="#EAB308" />}
            </View>
            <View style={tailwind`flex-1`}>
              <Text style={[tailwind`text-lg font-black`, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[tailwind`text-xs font-bold`, { color: theme.subText }]}>{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</Text>
            </View>
            <Switch
              trackColor={{ false: "#CBD5E1", true: theme.button }}
              thumbColor={"#ffffff"}
              ios_backgroundColor="#CBD5E1"
              onValueChange={toggleTheme}
              value={isDark}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
                tailwind`flex-row items-center p-5 rounded-[28px] mb-4 border shadow-sm`,
                { backgroundColor: theme.card, borderColor: theme.cardBorder }
            ]}
            onPress={() => navigation.navigate('Trips')}
          >
            <View style={tailwind`w-12 h-12 rounded-2xl bg-emerald-50 items-center justify-center mr-4`}>
              <MapIcon size={24} color="#10B981" />
            </View>
            <View style={tailwind`flex-1`}>
              <Text style={[tailwind`text-lg font-black`, { color: theme.text }]}>Your Trips</Text>
              <Text style={[tailwind`text-xs font-bold`, { color: theme.subText }]}>View all your journeys</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
                tailwind`flex-row items-center p-5 rounded-[28px] mb-4 border shadow-sm`,
                { backgroundColor: theme.card, borderColor: theme.cardBorder }
            ]}
            onPress={() => navigation.navigate('Help')}
          >
            <View style={tailwind`w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mr-4`}>
              <QuestionMarkCircleIcon size={24} color="#3B82F6" />
            </View>
            <View style={tailwind`flex-1`}>
              <Text style={[tailwind`text-lg font-black`, { color: theme.text }]}>Support</Text>
              <Text style={[tailwind`text-xs font-bold`, { color: theme.subText }]}>Get help and feedback</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
                tailwind`flex-row items-center p-5 rounded-[28px] mb-8 border shadow-sm`,
                { backgroundColor: theme.card, borderColor: theme.cardBorder }
            ]}
            onPress={() => {}}
          >
            <View style={tailwind`w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center mr-4`}>
              <ShieldCheckIcon size={24} color="#64748B" />
            </View>
            <View style={tailwind`flex-1`}>
              <Text style={[tailwind`text-lg font-black`, { color: theme.text }]}>Privacy</Text>
              <Text style={[tailwind`text-xs font-bold`, { color: theme.subText }]}>Security and data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={tailwind`px-6 pt-2`}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              tailwind`flex-row items-center justify-center p-5 rounded-[28px] border-2 shadow-sm`,
              { backgroundColor: theme.card, borderColor: isDark ? '#334155' : '#FEF2F2', shadowColor: '#EF4444', shadowOpacity: 0.1 }
            ]}
            onPress={handleLogout}
          >
            <ArrowLeftOnRectangleIcon size={22} color="#EF4444" style={tailwind`mr-2`} />
            <Text style={tailwind`text-red-500 text-lg font-black`}>
              Log out
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
