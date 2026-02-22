import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import BackButton from '../components/BackButton'

const HelpScreen = () => {
  return (
    <SafeAreaView style={tailwind`h-full`}>
    <View style={tailwind`flex-1 mx-5`}>
        <View>
            <BackButton/>
        </View>
        <View style={tailwind`flex justify-center items-center mt-20`}>
            <Text style={tailwind`text-center font-bold text-2xl text-neutral-400 `}>
                Comming soon!
            </Text>
        </View>
    </View>
    </SafeAreaView>
  )
}

export default HelpScreen