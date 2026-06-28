import { View, Text, Image } from 'react-native';
import React from 'react';
import tailwind from 'twrnc';
import { useTheme } from '../context/ThemeContext';

const EmptyList = ({ message }) => {
  const { theme, isDark } = useTheme();

  return (
    <View style={tailwind`flex justify-center items-center my-10`}>
      <Image 
        source={require('../assets/images/empty.png')} 
        style={[tailwind`h-48 w-48`, { opacity: isDark ? 0.3 : 0.8 }]} 
        resizeMode="contain"
      />
      <Text style={[tailwind`font-bold text-center mt-6 text-lg`, { color: theme.subText }]}>
        {message || "Nothing to show here"}
      </Text>
    </View>
  );
};

export default EmptyList