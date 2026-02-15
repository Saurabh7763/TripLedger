import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyList from '../components/EmptyList'
import tailwind from 'twrnc'
import BackButton from '../components/BackButton'

const NotificationScreen = () => {
  return (
    <SafeAreaView>
        <View style={tailwind`mx-5`}>
            <View>
            <BackButton/>
        </View>
        <View style={tailwind`flex`}>
            <EmptyList message={"You haven't any notification yet"}/>
        </View>
        </View>
    </SafeAreaView>
  )
}

export default NotificationScreen