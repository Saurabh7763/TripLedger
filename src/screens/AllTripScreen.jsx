import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import DeleteModal from '../components/DeleteModal';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
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
  Easing,
} from 'react-native-reanimated';
import randomImage from '../assets/images/randomImage';
import { showSuccess } from '../utils/showToast';
import { CalendarIcon, MapPinIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const db = getFirestore(getApp())

const AllTripScreen = () => {
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const { user } = useSelector(state => state.user);
  const { theme, isDark } = useTheme();
  
  const cardTranslateY = useSharedValue(30)
  const cardOpacity = useSharedValue(0)

  // Delete Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
   
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

      data.sort((a, b) => {
        const timeA = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : Date.now() / 1000;
        const timeB = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : Date.now() / 1000;
        return timeB - timeA;
      });

      setTrips(data);
    });

    return unsubscribe;
  }, [user]);

  const handleDeletePress = (trip) => {
    setSelectedTrip(trip);
    setDeleteModalVisible(true);
  };

  const confirmDeleteTrip = async () => {
    if (!selectedTrip) return;
    try {
      const expensesRef = collection(db, 'expenses');
      const q = query(expensesRef, where('tripId', '==', selectedTrip.id));
      const expenseSnapshot = await getDocs(q);
      const batch = writeBatch(db);
      expenseSnapshot.forEach(expenseDoc => {
        batch.delete(expenseDoc.ref);
      });
      const tripRef = doc(db, 'trips', selectedTrip.id);
      batch.delete(tripRef);
      await batch.commit();
      setDeleteModalVisible(false);
      setSelectedTrip(null);
      showSuccess("Trip & all expenses deleted 🗑️");
    } catch (error) {
      console.log('Delete Error:', error);
    }
  };

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      <View style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={tailwind`flex-row items-center px-6 pt-4 mb-6`}>
          <BackButton />
          <Text style={[tailwind`text-2xl font-black ml-4`, { color: theme.text }]}>
            Your Trips
          </Text>
        </View>

        <FlatList
          style={tailwind`flex-1 px-4`}
          data={trips}
          numColumns={2}
          ListEmptyComponent={
            <EmptyList message={"You haven't recorded any trips yet"} />
          }
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 6 }}
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
          renderItem={({ item }) => (
            <AnimatedTouchable
              activeOpacity={0.9}
              style={[
                {
                  backgroundColor: theme.card,
                  borderRadius: 28,
                  marginBottom: 20,
                  padding: 12,
                  width: '48%',
                  shadowColor: theme.text,
                  shadowOpacity: 0.1,
                  shadowRadius: 15,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 6,
                  borderWidth: 1,
                  borderColor: theme.cardBorder
                },
                cardAnimatedStyle
              ]}
              onPress={() => navigation.navigate('TripExpense', { ...item })}
              onLongPress={() => handleDeletePress(item)}
            >
              <View style={tailwind`items-center mb-3`}>
                <Image
                  source={randomImage()}
                  style={{ width: 120, height: 120 }}
                  resizeMode="contain"
                />
              </View>

              <View style={tailwind`px-1`}>
                <Text style={[tailwind`text-lg font-black`, { color: theme.text }]} numberOfLines={1}>
                  {item.place}
                </Text>
                
                <View style={tailwind`flex-row items-center mt-1`}>
                  <MapPinIcon size={12} color={theme.placeholder} />
                  <Text style={[tailwind`text-xs ml-1 font-bold`, { color: theme.placeholder }]} numberOfLines={1}>
                    {item.country}
                  </Text>
                </View>

                <View style={[tailwind`flex-row items-center mt-2 pt-2 border-t`, { borderTopColor: theme.divider }]}>
                  <CalendarIcon size={12} color={theme.placeholder} />
                  <Text style={[tailwind`text-[10px] ml-1 font-bold`, { color: theme.placeholder }]}>
                    {item.createdAt && item.createdAt.seconds
                      ? new Date(item.createdAt.seconds * 1000).toLocaleDateString()
                      : "Just now"}
                  </Text>
                </View>
              </View>
            </AnimatedTouchable>
          )}
        />

        {/* Delete Confirmation Modal */}
        <DeleteModal 
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={confirmDeleteTrip}
          title="Delete Trip?"
          message={`Are you sure you want to delete "${selectedTrip?.place}"? This will permanently remove all associated expenses.`}
        />

      </View>
    </SafeAreaView>
  );
};

export default AllTripScreen;
