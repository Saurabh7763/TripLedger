import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tailwind from 'twrnc'
import { colors } from '../theme'
import BackButton from '../components/BackButton'
import { useNavigation } from '@react-navigation/native'
import {categories} from '../constants/index'
import Snackbar from 'react-native-snackbar'
import { addDoc } from 'firebase/firestore'
import { expensesRef } from '../firebase/firebaseConfig'
import Loading from '../components/Loading'
import Toast from 'react-native-toast-message'
import { showSuccess } from '../utils/showToast'

const AddTripScreen = (props) => {
  const {id} = props.route.params
  const[title,setTitle] = useState('')
  const[amount,setAmount] = useState('')
  const[category,setCategory] = useState('')
  const[loading, setLoading] = useState(false)

  const navigation = useNavigation()

  const handleAddExpense=async()=>{
    if(title && amount && category ){
      setLoading(true)
      let doc = await addDoc(expensesRef, {
        title,
        amount,
        category,
        tripId : id
      })
      setLoading(false)
      if(doc && doc.id) navigation.goBack()
        showSuccess("Expense Added 💰")
    }
      
    else{
      Snackbar.show({
        text: "Please fill all the fields",
        backgroundColor: 'red',
      });
    }
  }

  return (
    <SafeAreaView>
        <View style={tailwind`flex justify-between h-full mx-4`}>
           <View>
             <View style={tailwind`relative `}>
                <View style={tailwind`absolute top-0 left-0 z-10`}>
                   <BackButton/>
                </View>
                <Text style={tailwind`text-xl font-bold text-center ${colors.heading}`}>Add expense</Text>
            </View>
            <View style={tailwind`flex-row justify-center my-3`}>
              <Image source={require('../assets/images/expenseBanner.png')} 
                style={tailwind`h-72 w-72`}
              />
            </View>
            <View style={tailwind`mx-2 gap-1`}>
              <Text style={tailwind`${colors.heading} font-bold text-lg`}>
                For what?
              </Text>
              <TextInput
                style={tailwind`bg-white rounded-full p-4 mb-3`}
                value={title}
                onChangeText={setTitle}
              />
              <Text style={tailwind`${colors.heading} font-bold text-lg`}>
                How much?
              </Text>
              <TextInput
                style={tailwind`bg-white rounded-full p-4 mb-3`}
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={tailwind`mx-2`}>          
              <Text style={tailwind`${colors.heading} font-bold text-lg`}>Category</Text>

              <View style={tailwind`flex-wrap flex-row items-center`}>
                {categories.map(cat=>{
                  let bgColor = "bg-white"
                  if(cat.value == category) bgColor = "bg-green-200"
                  return(
                    <TouchableOpacity
                     key={cat.value}
                     style={tailwind`bg-white rounded-full ${bgColor} px-3 p-2 mb-2 mr-3`}
                     onPress={()=>setCategory(cat.value)}
                    >
                      <Text>{cat.title}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
           </View>
           </View>

           

           <View>
           {loading? (
            <Loading/>
           ) : (
            <TouchableOpacity 
              onPress={handleAddExpense}
              style={[tailwind`p-3 m-2 mb-2 rounded-full`,{backgroundColor:colors.button}]}
            >
              <Text style={tailwind`text-center text-lg font-bold text-white`}>
                Add Expense
              </Text>
            </TouchableOpacity>
           )}
            
           </View>
        </View>
    </SafeAreaView>
  )
}

export default AddTripScreen