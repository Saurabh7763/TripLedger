import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, query, where, onSnapshot } from '@react-native-firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import randomImage from '../assets/images/randomImage';
import { PlusIcon, MapPinIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const db = getFirestore(getApp());

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useSelector(state => state.user);
  const { theme } = useTheme();
  const [recentTrips, setRecentTrips] = useState([]);

  const listTranslateY = useSharedValue(20);
  const listOpacity = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      listTranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });
      listOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    }
  }, [isFocused]);

  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: listTranslateY.value }],
    opacity: listOpacity.value,
  }));

  useEffect(() => {
    if (!user) return;
    const tripsRef = collection(db, 'trips');
    const q = query(tripsRef, where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecentTrips(data.slice(0, 4));
    });
    return unsubscribe;
  }, [user]);

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tailwind`px-6 pt-4`}>
        <View style={tailwind`flex-row justify-between items-center mb-8`}>
          <View>
            <Text style={[tailwind`text-sm font-bold tracking-widest`, { color: theme.placeholder }]}>WELCOME BACK</Text>
            <Text style={[tailwind`text-3xl font-black`, { color: theme.text }]}>
              {user?.email?.split('@')[0]}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
            style={[
              tailwind`p-1 rounded-2xl border`,
              { backgroundColor: theme.card, borderColor: theme.cardBorder }
            ]}
          >
            <Image
              source={require('../assets/images/user.png')}
              style={tailwind`h-12 w-12 rounded-xl`}
            />
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={[
          tailwind`bg-emerald-400 p-6 rounded-[32px] flex-row items-center justify-between mb-8 shadow-lg`,
          { shadowColor: colors.button, shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 12 }
        ]}>
          <View style={tailwind`flex-1 mr-4`}>
            <Text style={tailwind`text-white text-2xl font-black leading-7 mb-2`}>
              Adventure awaits!
            </Text>
            <Text style={tailwind`text-emerald-50 text-xs font-bold leading-4 opacity-90`}>
              Track every expense and share the joy with your travel Buddies.
            </Text>
          </View>
          <Image
            source={require('../assets/images/banner.png')}
            style={tailwind`h-28 w-28`}
            resizeMode="contain"
          />
        </View>

        {/* Section Title */}
        <View style={tailwind`flex-row justify-between items-center mb-4`}>
          <Text style={[tailwind`text-2xl font-black`, { color: theme.text }]}>
            Recent Trips
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Trips')}>
            <Text style={[tailwind`font-bold`, { color: theme.button }]}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Trips List — outside the px-6 View so FlatList has full flex space */}
      <Animated.View style={[tailwind`flex-1 px-6`, listAnimatedStyle]}>
        <FlatList
          data={recentTrips}
          numColumns={2}
          ListEmptyComponent={<EmptyList message="No recent trips. Plan a new one!" />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <AnimatedTouchable
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TripExpense', { ...item })}
              style={[
                tailwind`p-3 rounded-[28px] mb-5 border w-[47%] items-center shadow-sm`,
                { 
                  backgroundColor: theme.card, 
                  borderColor: theme.cardBorder,
                  shadowColor: theme.text,
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 4
                }
              ]}
            >
              <View style={tailwind`mb-3`}>
                <Image source={randomImage()} style={tailwind`h-28 w-28`} resizeMode="contain" />
              </View>
              <View style={tailwind`items-center`}>
                <Text style={[tailwind`text-lg font-black text-center`, { color: theme.text }]} numberOfLines={1}>{item.place}</Text>
                <View style={tailwind`flex-row items-center mt-1`}>
                  <MapPinIcon size={12} color={theme.placeholder} />
                  <Text style={[tailwind`text-[10px] font-bold ml-1`, { color: theme.placeholder }]} numberOfLines={1}>{item.country}</Text>
                </View>
              </View>
            </AnimatedTouchable>
          )}
        />
      </Animated.View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddTrip')}
        activeOpacity={0.8}
        style={[
          tailwind`absolute bottom-10 right-8 w-16 h-16 rounded-[22px] items-center justify-center shadow-xl`,
          { 
            backgroundColor: '#1E293B',
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10
          }
        ]}
      >
        <PlusIcon size={30} color="white" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
