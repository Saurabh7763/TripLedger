import React from 'react';
import { View, Text } from 'react-native';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={{
        width: '90%',
        backgroundColor: '#22c55e',
        padding: 16,
        borderRadius: 14,
        elevation: 6,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
        {text1}
      </Text>
      {text2 ? (
        <Text style={{ color: '#fff', marginTop: 4 }}>
          {text2}
        </Text>
      ) : null}
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      style={{
        width: '90%',
        backgroundColor: '#ef4444',
        padding: 16,
        borderRadius: 14,
        elevation: 6,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
        {text1}
      </Text>
      {text2 ? (
        <Text style={{ color: '#fff', marginTop: 4 }}>
          {text2}
        </Text>
      ) : null}
    </View>
  ),
};
