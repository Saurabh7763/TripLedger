import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tailwind from 'twrnc';
import { colors } from '../theme';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { showSuccess } from '../utils/showToast';
import ProfileFeatures from '../components/ProfileFeatures';
import { useSelector } from 'react-redux';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.user);
 

  const handleLogout = async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
    showSuccess('Logged Out Successfully');
  };
  return (
    <SafeAreaView>
      <View style={tailwind`flex `}>
        <View style={tailwind`flex px-5 mb-5 `}>
          <View style={tailwind`flex-row justify-between items-center`}>
            <BackButton />
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}
            >
              <Image
                source={require('../assets/images/notification.png')}
                style={tailwind`h-10 w-10 `}
              />
            </TouchableOpacity>
          </View>
          <View
            style={tailwind`flex justify-center  items-center bg-green-200 py-3 mt-8 rounded-5`}
          >
            <Image
              source={require('../assets/images/user.png')}
              style={tailwind`h-20 w-20 bg-white rounded-full p-5 mb-2`}
            />
            <Text
              style={[tailwind`text-xl font-bold`, { color: colors.heading }]}
            >
              Hii👋, Admin
            </Text>
            <Text style={tailwind`${colors.heading}`}>{user?.email}</Text>
          </View>
        </View>

        <View style={tailwind`flex-row justify-center  items-center`}>
          <TouchableOpacity
            style={[
              tailwind` w-[90%] py-3 rounded-5 flex-row items-center justify-center`,
              { backgroundColor: colors.button },
            ]}
            onPress={() => navigation.navigate('Trips')}
          >
            <Image
              source={require('../assets/images/trips.png')}
              style={tailwind`w-10 h-10 mr-2`}
            />
            <Text style={tailwind`font-bold text-white text-xl`}>
              Your Trips
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tailwind`flex items-center mt-10`}>
          <ProfileFeatures
            title="Notification Settings"
            link={require('../assets/icons/NotiSetting.png')}
          />
          <ProfileFeatures
            title="Support"
            link={require('../assets/icons/support.png')}
          />
        </View>

        <View style={tailwind`flex-row items-center justify-center mt-10`}>
          <TouchableOpacity
            style={tailwind`bg-red-500 px-8 py-4 rounded-xl`}
            onPress={handleLogout}
          >
            <Text style={tailwind`font-bold text-white text-xl`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
