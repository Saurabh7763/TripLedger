import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import { colors } from '../theme'

const ProfileFeatures = ({title, link, handlePress}) => {
  return (
    <Pressable style={tailwind`flex-row bg-white py-4 w-[90%] px-3 rounded-5 mb-2`}
       onPress={handlePress}
    >
                    <Image source={link}
                        style={tailwind`h-5 w-5 mr-5`}
                    />
                    <Text style={tailwind`font-bold ${colors.heading}`}>{title}</Text>
    </Pressable>
  )
}

export default ProfileFeatures