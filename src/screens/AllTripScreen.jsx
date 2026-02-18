import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import { useSelector } from 'react-redux';
import {  useNavigation } from '@react-navigation/native';
import { getApp } from '@react-native-firebase/app';
import { onSnapshot } from '@react-native-firebase/firestore';
import { 
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc
} from '@react-native-firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

import randomImage from '../assets/images/randomImage';
import { showSuccess } from '../utils/showToast';

const db = getFirestore(getApp())

const AllTripScreen = () => {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const { user } = useSelector(state => state.user);
  const cardTranslateY = useSharedValue(30)
  const cardOpacity = useSharedValue(0)
   
  useEffect(() => {
      cardTranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });
      cardOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });
    }, []);
    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: cardTranslateY.value }],
      opacity: cardOpacity.value,
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

    setTrips(data);
  });

  return unsubscribe;
}, [user]);


  

  const deleteTripWithExpenses = async (tripId) => {
  try {

    const expensesRef = collection(db, 'expenses');
    const q = query(expensesRef, where('tripId', '==', tripId));

    const expenseSnapshot = await getDocs(q);

   
    const batch = writeBatch(db);
    expenseSnapshot.forEach(expenseDoc => {
      batch.delete(expenseDoc.ref);
    });

    const tripRef = doc(db, 'trips', tripId);
    batch.delete(tripRef);

    await batch.commit();

    showSuccess("Trip & all expenses deleted 🗑️");

  } catch (error) {
    console.log('Delete Error:', error);
  }
};


  const confirmDelete = (trip) => {
    Alert.alert(
      "Delete Trip",
      `Are you sure you want to delete "${trip.place}"?\n\nAll expenses will also be permanently deleted.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTripWithExpenses(trip.id),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>

       
        <View style={tailwind`flex-row items-center mx-4 mb-5`}>
          <BackButton />
          <Text style={[tailwind`font-bold text-lg ml-3`, { color: colors.heading }]}>
            Your Trips
          </Text>
        </View>

       
        <FlatList
          style={tailwind`flex-1 px-4`}
          data={trips}
          numColumns={2}
          extraData={trips}
          ListEmptyComponent={
            <EmptyList message={"You haven't recorded any trips yet"} />
          }
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}

          renderItem={({ item }) => (
            <AnimatedTouchable
              style={[tailwind`bg-white p-3 rounded-2xl mb-3 shadow-sm`,cardAnimatedStyle]}
              onPress={() => navigation.navigate('TripExpense', { ...item })}
              onLongPress={() => confirmDelete(item)}
            >
              <Image
                source={randomImage()}
                style={{ width: 135, height: 135 }}
                resizeMode="contain"
              />

              <Text style={tailwind`text-center text-base font-bold`}>
                {item.place}
              </Text>

              <Text style={tailwind`text-center text-sm`}>
                {item.country}
              </Text>

              <Text style={tailwind`text-center`}>
                {item.createdAt
                  ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                  : ""}
              </Text>
            </AnimatedTouchable>
          )}
        />

      </View>
    </SafeAreaView>
  );
};

export default AllTripScreen;
