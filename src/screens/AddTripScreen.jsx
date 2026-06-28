import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { useSelector } from 'react-redux';
import { getApp } from '@react-native-firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { showSuccess, showError } from '../utils/showToast';
import { MapPinIcon, GlobeAltIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';

const db = getFirestore(getApp());

const AddTripScreen = () => {
    const [place, setPlace] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => state.user);
    const navigation = useNavigation();
    const { theme, isDark } = useTheme();

    const handleAddTrip = async () => {
        if (place && country) {
            setLoading(true);
            try {
                const docRef = await addDoc(collection(db, 'trips'), {
                    place,
                    country,
                    userId: user.uid,
                    createdAt: serverTimestamp()
                });
                setLoading(false);
                showSuccess('Bon Voyage! ✈️', 'Trip added successfully');
                navigation.goBack();
            } catch (e) {
                setLoading(false);
                showError('Error', 'Failed to add trip');
            }
        } else {
            showError('Missing Info', 'Please fill all fields');
        }
    };

    return (
        <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: theme.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={tailwind`px-6 pt-4`}>
                    
                    {/* Header */}
                    <View style={tailwind`flex-row items-center mb-8`}>
                        <BackButton />
                        <Text style={[tailwind`text-2xl font-black ml-4`, { color: theme.text }]}>
                            New Journey
                        </Text>
                    </View>

                    {/* Banner Illustration */}
                    <View style={[
                        tailwind`rounded-[40px] items-center justify-center py-10 mb-10 shadow-lg`,
                        { 
                            backgroundColor: isDark ? theme.card : '#F8FAFC',
                            borderWidth: 1,
                            borderColor: theme.cardBorder
                        }
                    ]}>
                        <Image
                            source={require('../assets/images/4.png')}
                            style={tailwind`h-56 w-56`}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Input Fields */}
                    <View style={tailwind`gap-y-6`}>
                        <View>
                            <Text style={[tailwind`font-bold mb-3 ml-1`, { color: theme.subText }]}>WHERE TO?</Text>
                            <View style={[tailwind`flex-row items-center rounded-2xl px-4 border`, { backgroundColor: theme.input, borderColor: theme.inputBorder }]}>
                                <MapPinIcon size={20} color={theme.placeholder} />
                                <TextInput
                                    value={place}
                                    onChangeText={setPlace}
                                    placeholder="e.g. Paris, France"
                                    placeholderTextColor={theme.placeholder}
                                    style={[tailwind`flex-1 px-3 py-4 text-lg font-bold`, { color: theme.text }]}
                                />
                            </View>
                        </View>

                        <View>
                            <Text style={[tailwind`font-bold mb-3 ml-1`, { color: theme.subText }]}>COUNTRY</Text>
                            <View style={[tailwind`flex-row items-center rounded-2xl px-4 border`, { backgroundColor: theme.input, borderColor: theme.inputBorder }]}>
                                <GlobeAltIcon size={20} color={theme.placeholder} />
                                <TextInput
                                    value={country}
                                    onChangeText={setCountry}
                                    placeholder="e.g. France"
                                    placeholderTextColor={theme.placeholder}
                                    style={[tailwind`flex-1 px-3 py-4 text-lg font-bold`, { color: theme.text }]}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Action Button */}
                    <View style={tailwind`mt-12 mb-10`}>
                        {loading ? (
                            <Loading />
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={handleAddTrip}
                                style={[
                                    tailwind`py-5 rounded-[24px] items-center shadow-lg`,
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
                                   Create Trip
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddTripScreen;