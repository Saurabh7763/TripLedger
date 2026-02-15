import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import EmptyList from '../components/EmptyList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import ExpenseCard from '../components/ExpenseCard';
import firestore from '@react-native-firebase/firestore';

const TripExpenseScreen = props => {
  const { id, place, country } = props.route.params;
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState([]);
  const isFocused = useIsFocused();

  const fetchExpenses = async () => {
    const snapshot = await firestore()
      .collection('expenses')
      .where('tripId', '==', id)
      .get();

    let data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    setExpenses(data);
  };

  const totalExpenses = expenses.reduce((sum , item)=> sum + item.amount, 0)
  console.log(totalExpenses)

  useEffect(() => {
    if (isFocused) fetchExpenses();
  }, [isFocused]);

  return (
    <SafeAreaView style={tailwind`flex-1`}>
      <View>
        <View style={tailwind`relative mx-3`}>
          <View style={tailwind`absolute top-1 left-1 z-10`}>
            
            <BackButton />
          </View>
          <View>
            <Text
              style={tailwind`text-xl font-bold text-center ${colors.heading}`}
            >
              {place}
            </Text>
            <Text style={tailwind`text-xs text-center ${colors.heading}`}>
              {country}
            </Text>
          </View>
        </View>

        <View
          style={tailwind`items-center justify-center mx-4 mb-4 rounded-xl`}
        >
          <Image
            source={require('../assets/images/7.png')}
            style={tailwind`h-48 w-full`}
            resizeMode="contain"
          />
        </View>

        <View style={tailwind`px-4 flex-row justify-between items-center mb-3`}>
          <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
            Expenses
          </Text>
          <TouchableOpacity
            style={[tailwind` p-2 px-3 rounded-full `,{backgroundColor:colors.button}]}
            onPress={() =>
              navigation.navigate('AddExpense', { id, place, country })
            }
          >
            <Text style={tailwind`text-white`}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={tailwind`flex-1 px-4`}
        data={expenses}
        ListEmptyComponent={
          <EmptyList message={"You haven't recorded any expense yet"} />
        }
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ExpenseCard item={item} />}
      />

      <View style={tailwind`mx-5 mb-2 flex-row items-center justify-between`}>
        <View style={tailwind`flex-row gap-2 items-center`}>
          <Text style={[tailwind`font-bold text-xl`,{color:colors.heading}]}>Total Expenses :</Text>
        <Text style={[tailwind`font-bold text-lg`,{color:colors.heading}]}>₹{totalExpenses}</Text>
        </View>
        <TouchableOpacity style={[tailwind`px-5 py-1 mt-1  rounded-full`,{backgroundColor:colors.button}]}>
          <Text style={tailwind`text-white`}>
            Split
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripExpenseScreen;
