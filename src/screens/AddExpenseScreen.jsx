import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { categoryBG, categoryBGDark, colors } from '../theme';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { showSuccess, showError } from '../utils/showToast';
import {
  CurrencyRupeeIcon,
  TagIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  UserIcon
} from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';

const db = getFirestore(getApp());

const categories = [
  { title: 'Food', value: 'food' },
  { title: 'Commute', value: 'commute' },
  { title: 'Shopping', value: 'shopping' },
  { title: 'Entertainment', value: 'entertainment' },
  { title: 'Other', value: 'other' },
];

const AddExpenseScreen = props => {
  const { id } = props.route.params;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paidby, setPaidby] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { theme, isDark } = useTheme();

  const handleAddExpense = async () => {
    if (title && amount && category && paidby) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'expenses'), {
          title,
          amount,
          category,
          paidby,
          tripId: id,
          createdAt: serverTimestamp()
        });
        setLoading(false);
        showSuccess('Expense Added 💸');
        navigation.goBack();
      } catch (e) {
        setLoading(false);
        showError('Error', 'Failed to add expense');
      }
    } else {
      showError('Missing Info', 'Please fill all fields');
    }
  };

  const catBG = isDark ? categoryBGDark : categoryBG;

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tailwind`px-6 pt-4 pb-10`}>

          {/* Header */}
          <View style={tailwind`flex-row items-center mb-8`}>
            <BackButton />
            <Text style={[tailwind`text-2xl font-black ml-4`, { color: theme.text }]}>
              Add
            </Text>
          </View>

          {/* Banner Illustration */}
          <View style={[
            tailwind`rounded-[40px] items-center justify-center py-8 mb-10 shadow-lg`,
            {
              backgroundColor: isDark ? theme.card : '#F8FAFC',
              borderWidth: 1,
              borderColor: theme.cardBorder
            }
          ]}>
            <Image
              source={require('../assets/images/expenseBanner.png')}
              style={tailwind`h-48 w-48`}
              resizeMode="contain"
            />
          </View>

          {/* Form Fields */}
          <View style={tailwind`gap-y-6`}>
            <View>
              <Text style={[tailwind`text-xs font-black tracking-widest mb-3 ml-1`, { color: theme.subText }]}>FOR WHAT?</Text>
              <View style={[tailwind`flex-row items-center rounded-2xl px-4 border shadow-sm`, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <PencilSquareIcon size={20} color={theme.placeholder} />
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g. Dinner, Taxi, Souvenir"
                  placeholderTextColor={theme.placeholder}
                  style={[tailwind`flex-1 px-3 py-4 text-base font-black`, { color: theme.text }]}
                />
              </View>
            </View>

            <View>
              <Text style={[tailwind`text-xs font-black tracking-widest mb-3 ml-1`, { color: theme.subText }]}>HOW MUCH?</Text>
              <View style={[tailwind`flex-row items-center rounded-2xl px-4 border shadow-sm`, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <CurrencyRupeeIcon size={20} color={theme.placeholder} />
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={theme.placeholder}
                  style={[tailwind`flex-1 px-3 py-4 text-base font-black`, { color: theme.text }]}
                />
              </View>
            </View>

            <View>
              <Text style={[tailwind`text-xs font-black tracking-widest mb-3 ml-1`, { color: theme.subText }]}>WHO PAID?</Text>
              <View style={[tailwind`flex-row items-center rounded-2xl px-4 border shadow-sm`, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <UserIcon size={20} color={theme.placeholder} />
                <TextInput
                  value={paidby}
                  onChangeText={setPaidby}
                  placeholder="e.g. Saurabh, Priya, Amit"
                  placeholderTextColor={theme.placeholder}
                  style={[tailwind`flex-1 px-3 py-4 text-base font-black`, { color: theme.text }]}
                />
              </View>
            </View>

            <View>
              <Text style={[tailwind`text-xs font-black tracking-widest mb-4 ml-1`, { color: theme.subText }]}>CATEGORY</Text>
              <View style={tailwind`flex-row flex-wrap gap-3`}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    activeOpacity={0.8}
                    style={[
                      tailwind`px-5 py-3 rounded-2xl border-2 flex-row items-center`,
                      {
                        backgroundColor: category === cat.value ? (isDark ? '#1E293B' : '#E8F5E9') : theme.card,
                        borderColor: category === cat.value ? theme.button : theme.cardBorder
                      }
                    ]}
                  >
                    <View style={[tailwind`w-2.5 h-2.5 rounded-full mr-2.5`, { backgroundColor: catBG[cat.value] }]} />
                    <Text style={[
                      tailwind`font-black text-sm`,
                      { color: category === cat.value ? theme.text : theme.placeholder }
                    ]}>
                      {cat.title}
                    </Text>
                    {category === cat.value && (
                      <CheckCircleIcon size={16} color={theme.button} style={tailwind`ml-2`} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Button */}
          <View style={tailwind`mt-10 mb-6`}>
            {loading ? (
              <Loading />
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddExpense}
                style={[
                  tailwind`py-5 rounded-[24px] items-center justify-center shadow-xl w-full`,
                  {
                    backgroundColor: theme.button,
                    shadowColor: theme.button,
                    shadowOpacity: 0.3,
                    shadowRadius: 15,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 10
                  }
                ]}
              >
                <Text style={[tailwind`text-xl font-black`, { color: theme.buttonText }]}>
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;
