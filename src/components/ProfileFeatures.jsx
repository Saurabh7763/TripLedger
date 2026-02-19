import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import { colors } from '../theme'

const ProfileFeatures = ({title, link, handlePress}) => {
  return (
    <TouchableOpacity
            style={tailwind`flex-row items-center bg-white p-4 rounded-2xl mb-4 shadow-sm`}
            onPress={handlePress}
          >
            <Image
              source={link}
              style={tailwind`h-10 w-10 mr-4`}
            />
            <Text style={[tailwind`text-lg font-semibold`, { color: colors.heading }]}>
              {title}
            </Text>
          </TouchableOpacity>
  )
}

export default ProfileFeatures