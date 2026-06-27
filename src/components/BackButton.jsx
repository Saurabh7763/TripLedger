import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/solid'
import tailwind from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../theme'

const BackButton = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity 
       activeOpacity={0.7}
       style={[
         tailwind`bg-white rounded-2xl items-center justify-center`,
         { width: 44, height: 44, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
       ]}
       onPress={()=>navigation.goBack()}
    >
      <ChevronLeftIcon width={24} height={24} color={colors.button} strokeWidth={2.5} />
    </TouchableOpacity>
  )
}

export default BackButton
