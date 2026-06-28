import React from 'react'
import { TouchableOpacity } from 'react-native'
import { ChevronLeftIcon } from 'react-native-heroicons/solid'
import tailwind from 'twrnc'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../context/ThemeContext'

const BackButton = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()

  return (
    <TouchableOpacity 
       activeOpacity={0.7}
       style={[
         tailwind`h-10 w-10 items-center justify-center rounded-2xl shadow-sm`,
         { backgroundColor: theme.card, shadowColor: theme.text, shadowOpacity: 0.1 }
       ]}
       onPress={()=>navigation.goBack()}
    >
      <ChevronLeftIcon size={24} color={theme.surfaceIcon} />
    </TouchableOpacity>
  )
}

export default BackButton
