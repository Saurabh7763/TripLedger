import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import { colors } from '../theme'
import BackButton from '../components/BackButton'
import Snackbar from 'react-native-snackbar'
import { Login } from '../firebase/firebaseServices'
import {  useSelector } from 'react-redux'
import Loading from '../components/Loading'

const SignInScreen = () => {

const[email,setEmail] = useState('')
const[password,setPassword] = useState('')
const { userLoading } = useSelector(state => state.user);


const handleSubmit = async () => {
  if (!email || !password) {
    Snackbar.show({
      text: 'Email and Password are required!',
      backgroundColor: 'red',
    });
    return;
  }

  try {
    await Login(email, password);
  } catch (e) {
    Snackbar.show({
      text: e.message,
      backgroundColor: 'red',
    });
  }
};


return ( <SafeAreaView>
<View style={tailwind`flex justify-between h-full mx-4`}>


    <View>
      <View style={tailwind`relative`}>
        <View style={tailwind`absolute top-0 left-0 z-10`}>
          <BackButton/>
        </View>
        <Text style={tailwind`text-xl font-bold text-center ${colors.heading}`}>Sign In</Text>
      </View>

      <View style={tailwind`flex-row justify-center my-3`}>
        <Image source={require('../assets/images/login.png')} style={tailwind`h-80 w-80`} />
      </View>

      <View style={tailwind`mx-2 gap-1`}>
        <Text style={tailwind`${colors.heading} font-bold text-lg`}>Email</Text>
        <TextInput
          style={tailwind`bg-white rounded-5 p-4 mb-3`}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={tailwind`${colors.heading} font-bold text-lg`}>Password</Text>
        <TextInput
          style={tailwind`bg-white rounded-5 p-4 mb-3 ${colors.heading}`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
    </View>

    <View>
      {userLoading ? <Loading/> :
        <TouchableOpacity
          onPress={handleSubmit}
          style={[tailwind`p-3 m-2 mb-2 rounded-full`,{backgroundColor:colors.button}]}
        >
          <Text style={tailwind`text-center text-lg font-bold text-white`}>
            Sign In
          </Text>
        </TouchableOpacity>
      }
    </View>

  </View>
</SafeAreaView>


)
}

export default SignInScreen
