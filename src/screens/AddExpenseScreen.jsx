import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import Loading from '../components/Loading';
import { categories } from '../constants';
import { showSuccess } from '../utils/showToast';

const db = getFirestore(getApp());


const AddExpenseScreen = props => {
  const { id } = props.route.params;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidby, setPaidby] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleAddExpense = async () => {
    if (!title || !amount || !paidby || !category) {
      Snackbar.show({
        text: 'Please fill all the fields',
        backgroundColor: 'red',
      });
      return;
    }

    try {
      setLoading(true);
      const expRefs = collection(db, 'expenses')

      await addDoc(expRefs,{
        title,
          amount: Number(amount),
          paidby,
          category,
          tripId: id,
          createdAt:serverTimestamp(),
      })

      showSuccess('Expense Added 💰');
      navigation.goBack();
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong',
        backgroundColor: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
         
          <View style={tailwind`px-4 pt-2`}>
            <View style={tailwind`flex-row items-center justify-between`}>
              <BackButton />
              <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
                Add Expense
              </Text>
              <View style={{ width: 40 }} />
            </View>
          </View>

          
          <View
            style={[tailwind`bg-green-400`,{
              marginHorizontal: 20,
              marginTop: 15,
              borderRadius: 26,
              padding: 15,
              alignItems: 'center',
              elevation: 10,
            }]}
          >
            <Image
              source={require('../assets/images/expenseBanner.png')}
              style={{ height: 170, width: 170, marginBottom: 10 }}
              resizeMode="contain"
            />

            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              Record your spending 💸
            </Text>

            <Text
              style={{
                color: '#DCFCE7',
                textAlign: 'center',
                marginTop: 6,
                paddingHorizontal: 10,
              }}
            >
              Keep track of every rupee you spend on this trip.
            </Text>
          </View>

          
          <View style={tailwind`px-5 mt-6`}>
          
            <Text style={tailwind`text-slate-600 font-semibold mb-2`}>
              Expense Title
            </Text>
            <View style={tailwind`bg-white rounded-2xl px-4 py-2 mb-4 shadow`}>
              <TextInput
                placeholder="e.g. Hotel, Food, Taxi"
                placeholderTextColor="#94A3B8"
                style={{ fontSize: 16 }}
                value={title}
                onChangeText={setTitle}
              />
            </View>

           
            <Text style={tailwind`text-slate-600 font-semibold mb-2`}>
              Amount
            </Text>
            <View
              style={tailwind`bg-white rounded-2xl px-4 py-3 mb-4 flex-row items-center shadow`}
            >
              <Text
                style={{ fontSize: 18, fontWeight: 'bold', marginRight: 6 }}
              >
                ₹
              </Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#94A3B8"
                style={{ fontSize: 18, flex: 1 }}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            
            <Text style={tailwind`text-slate-600 font-semibold mb-2`}>
              Who Paid?
            </Text>
            <View style={tailwind`bg-white rounded-2xl px-4 py-3 mb-4 shadow`}>
              <TextInput
                placeholder="e.g. Saurabh"
                placeholderTextColor="#94A3B8"
                style={{ fontSize: 18 }}
                value={paidby}
                onChangeText={setPaidby}
              />
            </View>

            
            <Text style={tailwind`text-slate-600 font-semibold mb-2`}>
              Category
            </Text>
            <View style={tailwind`flex-row flex-wrap`}>
              {categories.map(cat => {
                const selected = cat.value === category;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 20,
                      marginRight: 10,
                      marginBottom: 10,
                      backgroundColor: selected ? colors.button : '#ffffff',
                      borderWidth: 1,
                      borderColor: selected ? colors.button : '#E2E8F0',
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? '#fff' : '#334155',
                        fontWeight: '600',
                      }}
                    >
                      {cat.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          
          <View style={tailwind`px-5 mt-6`}>
            {loading ? (
              <Loading />
            ) : (
              <TouchableOpacity
                onPress={handleAddExpense}
                style={{
                  backgroundColor: colors.button,
                  paddingVertical: 18,
                  borderRadius: 20,
                  alignItems: 'center',
                  elevation: 6,
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}
                >
                  Save Expense
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;
