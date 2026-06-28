import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import tailwind from 'twrnc';
import { useTheme } from '../context/ThemeContext';

const Loading = () => {
    const { theme } = useTheme();
    return (
        <View style={tailwind`flex-row justify-center py-8`}>
            <ActivityIndicator size="large" color={theme.button} />
        </View>
    );
};

export default Loading;