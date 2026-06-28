import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import ExpenseCard from '../components/ExpenseCard';
import DeleteModal from '../components/DeleteModal';
import { getApp } from '@react-native-firebase/app';
import { 
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from '@react-native-firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { PlusIcon, UserGroupIcon, XMarkIcon, CheckIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const db = getFirestore(getApp())

const TripExpenseScreen = props => {
  const { id, place, country } = props.route.params;
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();
  
  const cardTranslateY = useSharedValue(20)
  const cardOpacity = useSharedValue(0)
  const [expenses, setExpenses] = useState([]);
  const [showSplit, setShowSplit] = useState(false);
  const [people, setPeople] = useState('');
  const [perPerson, setPerPerson] = useState(0);

  // Delete Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    cardTranslateY.value = withSpring(0, { damping: 12, stiffness: 100 });
    cardOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const expenseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
    opacity: cardOpacity.value,
  }));

  useEffect(() => {
    const expRef = collection(db, 'expenses');
    const q = query(expRef, where('tripId', '==', id));

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    }, error => {
      console.log('Realtime expense error:', error);
    });

    return unsubscribe; 
  }, [id]);

  const handleDeletePress = (expense) => {
    setSelectedExpense(expense);
    setDeleteModalVisible(true);
  };

  const confirmDeleteExpense = async () => {
    if (!selectedExpense) return;
    try {
      const expenseRef = doc(db, 'expenses', selectedExpense.id);
      await deleteDoc(expenseRef);
      setDeleteModalVisible(false);
      setSelectedExpense(null);
    } catch (error) {
      console.log('Delete Expense error:', error);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  useEffect(() => {
    if (people && Number(people) > 0) {
      setPerPerson((totalExpenses / Number(people)).toFixed(2));
    } else {
      setPerPerson(0);
    }
  }, [people, totalExpenses]);

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      
      {/* Header Banner */}
      <View
        style={[
          tailwind`bg-green-400`,
          {
            margin: 20,
            borderRadius: 32,
            padding: 24,
            shadowColor: colors.button,
            shadowOpacity: 0.25,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          }
        ]}
      >
        <View style={{ position: 'absolute', top: 16, left: 16 }}>
          <BackButton />
        </View>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
            {place}
          </Text>
          <Text style={{ color: '#F0F9FF', fontSize: 14, fontWeight: '500', opacity: 0.9 }}>
            {country}
          </Text>

          <View style={tailwind`mt-6 mb-4 items-center justify-center`}>
            <Image
              source={require('../assets/images/7.png')}
              style={{ height: 110, width: 110 }}
              resizeMode="contain"
            />
          </View>

          <Text style={{ color: '#F0F9FF', fontSize: 13, fontWeight: '600', opacity: 0.8 }}>
            TOTAL SPENT
          </Text>
          <Text style={{ color: 'white', fontSize: 36, fontWeight: '900', marginTop: 2 }}>
            ₹ {totalExpenses}
          </Text>
        </View>
      </View>

      {/* Expenses List */}
      <View style={tailwind`px-6 flex-row justify-between items-center mb-4`}>
        <Text style={[tailwind`text-2xl font-bold`, { color: theme.text }]}>
          Expenses
        </Text>
        <View style={[tailwind`px-3 py-1 rounded-full`, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
          <Text style={[tailwind`font-bold text-xs`, { color: theme.subText }]}>{expenses.length} ITEMS</Text>
        </View>
      </View>

      <FlatList
        style={tailwind`flex-1 px-4`}
        data={expenses}
        ListEmptyComponent={
          <EmptyList message={"No expenses yet 💸\nTap + to add your first expense"} />
        }
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
        renderItem={({ item }) => (
          <AnimatedTouchable
            onLongPress={() => handleDeletePress(item)}
            activeOpacity={0.8}
            style={[expenseAnimatedStyle, tailwind`mb-4`]}
          >
            <ExpenseCard item={item} />
          </AnimatedTouchable>
        )}
      />

      {/* Summary Tab & Split Bill */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.card,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          padding: 24,
          paddingTop: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -10 },
          elevation: 20,
        }}
      >
        <View style={tailwind`flex-row justify-between items-center`}>
          <View>
            <Text style={[tailwind`font-bold text-xs tracking-wider mb-1`, { color: theme.placeholder }]}>TOTAL SUM</Text>
            <Text style={[tailwind`text-2xl font-black`, { color: theme.text }]}>
              ₹ {totalExpenses}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.button,
              paddingHorizontal: 24,
              paddingVertical: 14,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: colors.button,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 5 },
              elevation: 8
            }}
            onPress={() => setShowSplit(true)}
          >
            <UserGroupIcon size={20} color="white" style={tailwind`mr-2`} />
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>
              Split Bill
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddExpense', { id, place, country })}
        activeOpacity={0.8}
        style={[
          tailwind`absolute w-16 h-16 rounded-[22px] items-center justify-center shadow-xl`,
          { 
            bottom: 92,
            right: 24,
            backgroundColor: isDark ? '#F1F5F9' : '#1E293B',
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 10 },
            elevation: 10,
          }
        ]}
      >
        <PlusIcon size={28} color={isDark ? '#1E293B' : 'white'} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Split Modal */}
      <Modal visible={showSplit} transparent animationType="slide">
        <View style={[tailwind`flex-1 justify-end`, { backgroundColor: theme.modalOverlay }]}>
          <View
            style={{
              backgroundColor: theme.card,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              padding: 30,
              paddingBottom: Platform.OS === 'ios' ? 45 : 30,
            }}
          >
            <View style={tailwind`items-center mb-6`}>
              <View style={[tailwind`w-12 h-1 rounded-full mb-4`, { backgroundColor: theme.divider }]} />
              <Text style={[tailwind`text-2xl font-black`, { color: theme.text }]}>
                Split Expense
              </Text>
            </View>

            <Text style={[tailwind`font-bold mb-3 ml-1`, { color: theme.subText }]}>NUMBER OF PEOPLE</Text>
            <View style={[tailwind`flex-row items-center rounded-2xl px-4 border mb-6`, { backgroundColor: theme.input, borderColor: theme.inputBorder }]}>
              <UserGroupIcon size={20} color={theme.placeholder} />
              <TextInput
                value={people}
                onChangeText={setPeople}
                keyboardType="numeric"
                placeholder="How many people?"
                placeholderTextColor={theme.placeholder}
                style={[tailwind`flex-1 px-3 py-4 text-lg font-bold`, { color: theme.text }]}
              />
            </View>

            <View
              style={{
                backgroundColor: theme.statCard,
                padding: 24,
                borderRadius: 28,
                alignItems: 'center',
                marginBottom: 30,
                borderWidth: 1,
                borderColor: theme.statBorder
              }}
            >
              <Text style={[tailwind`font-bold mb-2`, { color: theme.placeholder }]}>EACH PERSON PAYS</Text>
              <Text style={{ fontSize: 32, fontWeight: '900', color: theme.button }}>
                ₹ {perPerson}
              </Text>
            </View>

            <View style={tailwind`flex-row gap-4`}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[tailwind`flex-1 py-4 rounded-2xl items-center flex-row justify-center`, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}
                onPress={() => {
                  setShowSplit(false);
                  setPeople('');
                }}
              >
                <XMarkIcon size={20} color={theme.subText} style={tailwind`mr-2`} />
                <Text style={[tailwind`font-black`, { color: theme.subText }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[tailwind`flex-1 py-4 rounded-2xl items-center flex-row justify-center shadow-lg`, { backgroundColor: colors.button, shadowColor: colors.button }]}
                onPress={() => {
                  setShowSplit(false);
                  setPeople('');
                }}
              >
                <CheckIcon size={20} color="white" style={tailwind`mr-2`} />
                <Text style={tailwind`text-white font-black`}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDeleteExpense}
        title="Delete Expense?"
        message={`Are you sure you want to delete "${selectedExpense?.title}"? This cannot be undone.`}
      />

    </SafeAreaView>
  );
};

export default TripExpenseScreen;
