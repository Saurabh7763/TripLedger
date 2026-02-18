import { View, Text } from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import { categoryBG, colors } from '../theme'

const ExpenseCard = ({item}) => {
  return (
    <View style={[tailwind`flex  p-4 mb-3  rounded-5`,{backgroundColor:categoryBG[item.category]}]}>
      <View style={tailwind`flex-row justify-between`}>
        <View>
        <Text style={tailwind`${colors.heading} font-bold`}>{item.title}</Text>
        <Text style={tailwind`${colors.heading} text-xs`}>{item.category}</Text>
      </View>
      <View>
        <Text style={tailwind`${colors.heading} text-2xl font-bold`}>₹ {item.amount}</Text>
      </View>
      </View>
      <View style={tailwind`flex-row mt-1 items-center`}>
        <Text style={tailwind`text-xs`}>Paid by: </Text>
        {item.paidby? (
          <Text style={tailwind`text-lg font-bold -mt-1`}>{item.paidby}</Text>
        ):(
          <Text style={tailwind`text-lg font-bold -mt-1`}>Admin</Text>
        ) }
        
      </View>
    </View>
  )
}

export default ExpenseCard