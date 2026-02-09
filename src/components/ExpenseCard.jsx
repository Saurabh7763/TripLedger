import { View, Text } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import { categoryBG, colors } from '../theme'

const ExpenseCard = ({item}) => {
  return (
    <View style={[tailwind`flex-row justify-between items-center  p-4 mb-3  rounded-5`,{backgroundColor:categoryBG[item.category]}]}>
      <View>
        <Text style={tailwind`${colors.heading} font-bold`}>{item.title}</Text>
        <Text style={tailwind`${colors.heading} text-xs`}>{item.category}</Text>
      </View>
      <View>
        <Text style={tailwind`${colors.heading} font-bold`}>₹ {item.amount}</Text>
      </View>
    </View>
  )
}

export default ExpenseCard