import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import randomImage from '../assets/images/randomImage';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getApp } from '@react-native-firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from '@react-native-firebase/firestore';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const db = getFirestore(getApp());
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.user);
  const [trips, setTrips] = useState([]);
  const listTranslateY = useSharedValue(30);
  const listOpacity = useSharedValue(0);

  useEffect(() => {
    listTranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });
    listOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, []);
  const ListAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: listTranslateY.value }],
    opacity: listOpacity.value,
  }));

  useEffect(() => {
    if (!user) return;

    const tripsRef = collection(db, 'trips');
    const q = query(tripsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by newest first to avoid needing a Firebase composite index
      data.sort((a, b) => {
        const timeA = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
        const timeB = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
        return timeB - timeA;
      });

      setTrips(data);
    }, error => {
      console.log('Realtime fetch trips error:', error);
    });

    return unsubscribe;
  }, [user]);

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: '#F1F5F9' }]}>
      <View
        style={tailwind`px-4 pt-2 mb-3 flex-row justify-between items-center`}
      >
        <View>
          <Text style={tailwind`text-slate-500 text-sm`}>Welcome back 👋</Text>

          <Text style={tailwind`text-3xl font-extrabold ${colors.heading}`}>
            TripLedger
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{
            backgroundColor: '#ffffff',
            padding: 10,
            borderRadius: 50,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Image
            source={require('../assets/images/user.png')}
            style={tailwind`w-5 h-5`}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          tailwind`bg-green-400`,
          {
            marginHorizontal: 16,
            marginBottom: 18,
            borderRadius: 24,
            padding: 18,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          },
        ]}
      >
        <View style={{ width: '65%' }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            Track every expense
          </Text>

          <Text style={{ color: '#E0E7FF', marginTop: 6 }}>
            Manage trip spending easily and never split bills manually again.
          </Text>
        </View>

        <Image
          source={require('../assets/images/banner.png')}
          style={tailwind`w-30 h-30`}
        />
      </View>

      <View style={tailwind`px-4 flex-row justify-between items-center mb-2`}>
        <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
          Your Trips
        </Text>
      </View>

      <FlatList
        style={[tailwind`flex-1 px-4`]}
        data={trips}
        numColumns={2}
        ListEmptyComponent={
          <EmptyList
            message={
              '                            No trips yet ✈️\nTap the + button to create your first journey!'
            }
          />
        }
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <AnimatedTouchable
            activeOpacity={0.85}
            style={[
              {
                backgroundColor: '#ffffff',
                borderRadius: 22,
                marginBottom: 14,
                overflow: 'hidden',
                width: '48%',
                shadowColor: '#000',
                shadowOpacity: 0.15,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 5 },
                elevation: 5,
              },
              ListAnimatedStyle,
            ]}
            onPress={() => navigation.navigate('TripExpense', { ...item })}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={randomImage()}
                style={{ width: '100%', height: 140 }}
                resizeMode="cover"
              />

              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  padding: 12,
                  backgroundColor: 'rgba(0,0,0,0.45)',
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
                >
                  {item.place}
                </Text>

                <Text style={{ color: '#E2E8F0', fontSize: 12 }}>
                  {item.country}
                </Text>
              </View>
            </View>
          </AnimatedTouchable>
        )}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('AddTrip')}
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          bottom: 28,
          right: 22,
          backgroundColor: colors.button,
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 12,
        }}
      >
        <Text style={{ color: 'white', fontSize: 30, marginTop: -2 }}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
