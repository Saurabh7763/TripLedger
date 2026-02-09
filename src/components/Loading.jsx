import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../theme'
import tailwind from 'twrnc'

const Loading = () => {
  return (
    <View style={tailwind`flex-row justify-center my-5`}>
      <ActivityIndicator size={'large'} color={colors.button}/>
    </View>
  )
}

export default Loading