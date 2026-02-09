import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import {colors} from '../theme/index'
import randomImage from '../assets/images/randomImage'
import EmptyList from '../components/EmptyList'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import BackButton from '../components/BackButton'
import ExpenseCard from '../components/ExpenseCard'
import { getDocs, query, where } from 'firebase/firestore'
import { expensesRef } from '../firebase/firebaseConfig'


const TripExpenseScreen = (props) => {
    const{id, place, country} = props.route.params;
    const navigation = useNavigation();
    const[expenses, setExpenses] = useState([])
    const isFocused = useIsFocused()

    const fetchExpenses = async()=>{
      const q = query(expensesRef, where("tripId", "==", id))
      const querySnapshot =await getDocs(q)

      let data = []
    querySnapshot.forEach(doc=>{
      data.push({...doc.data(), id:doc.id})
    })
      setExpenses(data)
    }
    useEffect(()=>{
      if(isFocused)
        fetchExpenses()
    },[isFocused])

  const handleTrip = ()=>{
    navigation.navigate('AddExpense',{id, place, country})
  }
  return (
<SafeAreaView style={tailwind`flex-1`}>
  
  
  <View>
  
    <View style={tailwind`relative mx-3`}>
        <View style={tailwind`absolute top-1 left-1 z-10`}>
            <BackButton/>
        </View>
        <View>
            <Text style={tailwind`text-xl font-bold text-center ${colors.heading}`}>{place}</Text>
            <Text style={tailwind`text-xs text-center ${colors.heading}`}>{country}</Text>
        </View>
        
    </View>
    
    <View style={tailwind`items-center justify-center  mx-4 mb-4 rounded-xl`}>
      <Image
        source={require('../assets/images/7.png')}
        style={tailwind`h-48 w-full`}
        resizeMode="contain"
      />
      
    </View>

   
    <View style={tailwind`px-4 flex-row justify-between items-center mb-3`}>
      <Text style={tailwind`text-xl font-bold ${colors.heading}`}>
        Expenses
      </Text>
      <TouchableOpacity
        style={tailwind`bg-white p-2 px-3 rounded-full border`}
        onPress={handleTrip}
      >
        <Text style={tailwind`${colors.heading}`}>Add expense</Text>
      </TouchableOpacity>
    </View>
  </View>

  
  <FlatList
    style={tailwind`flex-1 px-4`}
    data={expenses}
    ListEmptyComponent={<EmptyList message={"You haven't recorder any expense yet"}/>}
    keyExtractor={item => item.id.toString()}
    showsVerticalScrollIndicator={false}
    
    renderItem={({ item }) => {
        return (
            <ExpenseCard item={item}/>
        )
    }
    }
  />
</SafeAreaView>

  )
}

export default TripExpenseScreen