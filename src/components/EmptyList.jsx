import { View, Text, Image } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'

const EmptyList = ({message}) => {
  return (
    <View style={tailwind`flex justify-center items-center my-5`}>
      <Image
        style={tailwind`w-36 h-36 mb-2`}
        source={require(`../assets/images/empty.png`)}
      />
      <Text 
        style={tailwind`font-bold text-gray-400`}
      >{message || 'data not found'} </Text>
    </View>
  )
}

export default EmptyList