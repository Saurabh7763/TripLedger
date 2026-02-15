import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import { categories } from '../constants';
import { showSuccess } from '../utils/showToast';

const AddExpenseScreen = props => {
  const { id } = props.route.params;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAddExpense = async () => {
    if (!title || !amount || !category) {
      Snackbar.show({
        text: 'Please fill all the fields',
        backgroundColor: 'red',
      });
      return;
    }

    setLoading(true);

    await firestore()
      .collection('expenses')
      .add({
        title,
        amount: Number(amount),
        category,
        tripId: id,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    setLoading(false);
    showSuccess('Expense Added 💰');
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <View style={tailwind`flex justify-between h-full mx-4`}>
        
        <View>
          <View style={tailwind`relative`}>
            <View style={tailwind`absolute top-0 left-0 z-10`}>
              
              <BackButton />
            </View>
            <Text
              style={tailwind`text-xl font-bold text-center ${colors.heading}`}
            >
              Add Expense
            </Text>
          </View>

          <View style={tailwind`flex-row justify-center my-3`}>
            <Image
              source={require('../assets/images/expenseBanner.png')}
              style={tailwind`h-72 w-72`}
            />
          </View>

          <View style={tailwind`mx-2 gap-1`}>
            <Text style={tailwind`${colors.heading} font-bold text-lg`}>
              For what?
            </Text>
            <TextInput
              style={tailwind`bg-white rounded-xl p-4 mb-3`}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={tailwind`${colors.heading} font-bold text-lg`}>
              How much?
            </Text>
            <TextInput
              style={tailwind`bg-white rounded-xl p-4 mb-3`}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={tailwind`mx-2`}>
            <Text style={tailwind`${colors.heading} font-bold text-lg`}>
              Category
            </Text>

            <View style={tailwind`flex-wrap flex-row items-center`}>
              {categories.map(cat => {
                const bg = cat.value === category ? 'bg-green-200' : 'bg-white';
                return (
                  <TouchableOpacity
                    key={cat.value}
                    style={tailwind`${bg} rounded-full px-3 p-2 mb-2 mr-3`}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text>{cat.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleAddExpense}
              style={[
                tailwind`p-3 m-2 mb-2 rounded-full`,
                { backgroundColor: colors.button },
              ]}
            >
              <Text style={tailwind`text-center text-lg font-bold text-white`}>
                Add Expense
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;
