import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import ExpenseCard from '../components/ExpenseCard';
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
  withDelay,
  Easing,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const db = getFirestore(getApp())

const TripExpenseScreen = props => {
  const { id, place, country } = props.route.params;
  const navigation = useNavigation();
   const cardTranslateY = useSharedValue(20)
  const cardOpacity = useSharedValue(0)
  const [expenses, setExpenses] = useState([]);
  const [showSplit, setShowSplit] = useState(false);
  const [people, setPeople] = useState('');
  const [perPerson, setPerPerson] = useState(0);
 

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




 const deleteExpense = async (expenseId, title) => {
  Alert.alert(
    'Delete Expense',
    `Are you sure you want to delete "${title}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const expenseRef = doc(db, 'expenses', expenseId);
            await deleteDoc(expenseRef);

          } catch (error) {
            console.log('Delete Expense error:', error);
            Alert.alert('Error', 'Could not delete expense');
          }
        },
      },
    ],
  );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>

     
      <View
        style={[tailwind`bg-green-400`,{
          margin: 16,
          borderRadius: 26,
          padding: 18,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }]}
      >
        <View style={{ position: 'absolute', top: 12, left: 12 }}>
          <BackButton />
        </View>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>
            {place}
          </Text>

          <Text style={{ color: '#E0E7FF', marginBottom: 12 }}>
            {country}
          </Text>

          <Image
            source={require('../assets/images/7.png')}
            style={{ height: 120, width: 120 }}
            resizeMode="contain"
          />

          <Text style={{ color: '#E0E7FF', marginTop: 10 }}>
            Total Spent
          </Text>

          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>
            ₹ {totalExpenses}
          </Text>
        </View>
      </View>


     
      <View style={tailwind`px-4 mb-2`}>
        <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
          Expenses
        </Text>
      </View>


      
      <FlatList
        style={tailwind`flex-1 px-4`}
        data={expenses}
        extraData={expenses}
        ListEmptyComponent={
          <EmptyList message={"No expenses yet 💸\nTap + to add your first expense"} />
        }
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => <AnimatedTouchable
           onLongPress={()=>deleteExpense(item.id, item.title)}
           activeOpacity={0.8}
           style={[expenseAnimatedStyle]}
        >
          <ExpenseCard item={item} />
        </AnimatedTouchable>}
      />


    
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddExpense', { id, place, country })
        }
        style={{
          position: 'absolute',
          bottom: 110,
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
        <Text style={{ color: 'white', fontSize: 30 }}>＋</Text>
      </TouchableOpacity>


     
      <View
        style={{
          marginHorizontal: 14,
          marginBottom: 10,
          backgroundColor: '#ffffff',
          borderRadius: 22,
          padding: 14,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 6,
        }}
      >
        <View>
          <Text style={{ color: '#64748B' }}>Total</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.heading }}>
            ₹ {totalExpenses}
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.button,
            paddingHorizontal: 18,
            paddingVertical: 10,
            borderRadius: 20,
          }}
          onPress={() => setShowSplit(true)}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            Split Bill
          </Text>
        </TouchableOpacity>
      </View>


     
      <Modal visible={showSplit} transparent animationType="fade">

        <View style={tailwind`flex-1 justify-center items-center bg-black/40`}>
          <View
            style={{
              backgroundColor: 'white',
              width: '85%',
              borderRadius: 24,
              padding: 20,
            }}
          >
            <Text style={tailwind`text-xl font-bold text-center mb-4`}>
              Split Expense
            </Text>

            <Text style={tailwind`mb-1 text-slate-600`}>
              Number of People
            </Text>

            <TextInput
              value={people}
              onChangeText={setPeople}
              keyboardType="numeric"
              placeholder="Enter number"
              placeholderTextColor="#94A3B8"
              style={{
                borderWidth: 1,
                borderColor: '#E2E8F0',
                borderRadius: 16,
                padding: 12,
                marginBottom: 16,
              }}
            />

            <View
              style={{
                backgroundColor: '#F1F5F9',
                padding: 14,
                borderRadius: 16,
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <Text style={{ color: '#64748B' }}>
                Each person pays
              </Text>

              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#22C55E' }}>
                ₹ {perPerson}
              </Text>
            </View>

            <View style={tailwind`flex-row justify-between`}>
              <TouchableOpacity
                style={tailwind`px-5 py-2 rounded-xl bg-red-500`}
                onPress={() => {
                  setShowSplit(false);
                  setPeople('');
                }}
              >
                <Text style={tailwind`text-white font-bold`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[tailwind`px-5 py-2 rounded-xl`, { backgroundColor:colors.button }]}
                onPress={() => {
                  setShowSplit(false);
                  setPeople('');
                }}
              >
                <Text style={tailwind`text-white font-bold`}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </Modal>

    </SafeAreaView>
  );
};

export default TripExpenseScreen;
