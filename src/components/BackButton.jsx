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
       style={tailwind`bg-white rounded-full h-8 w-8`}
       onPress={()=>navigation.goBack()}
    >
      <ChevronLeftIcon width={30} height={30} color={colors.button} />
    </TouchableOpacity>
  )
}

export default BackButton
