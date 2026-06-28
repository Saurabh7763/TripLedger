import { View, Text } from 'react-native';
import React from 'react';
import tailwind from 'twrnc';
import { categoryBG, categoryBGDark } from '../theme';
import { CurrencyRupeeIcon, UserIcon, TagIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';

const ExpenseCard = ({ item }) => {
  const { theme, isDark } = useTheme();
  const catBG = isDark ? categoryBGDark : categoryBG;

  return (
    <View
      style={[
        tailwind`p-5 mb-4 rounded-[24px] shadow-sm`,
        { 
          backgroundColor: theme.card,
          borderLeftWidth: 6,
          borderLeftColor: catBG[item.category] || theme.inputBorder,
          shadowColor: theme.text,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }
      ]}
    >
      <View style={tailwind`flex-row justify-between items-start`}>
        <View style={tailwind`flex-1 mr-4`}>
          <Text style={[tailwind`text-lg font-black`, { color: theme.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          
          <View style={[tailwind`flex-row items-center mt-2 self-start px-2 py-1 rounded-lg`, { backgroundColor: isDark ? '#334155' : '#F8FAFC' }]}>
            <TagIcon size={12} color={theme.subText} />
            <Text style={[tailwind`text-[10px] font-black uppercase ml-1 tracking-wider`, { color: theme.subText }]}>
              {item.category}
            </Text>
          </View>
        </View>

        <View style={tailwind`items-end`}>
          <View style={tailwind`flex-row items-center`}>
            <Text style={[tailwind`text-xl font-black`, { color: theme.text }]}>
              ₹{item.amount}
            </Text>
          </View>
        </View>
      </View>

      <View style={[tailwind`flex-row mt-4 pt-3 border-t items-center justify-between`, { borderTopColor: theme.divider }]}>
        <View style={tailwind`flex-row items-center`}>
          <View style={[tailwind`w-6 h-6 rounded-full items-center justify-center mr-2`, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}>
            <UserIcon size={14} color={theme.placeholder} />
          </View>
          <Text style={[tailwind`text-xs font-bold`, { color: theme.subText }]}>Paid by </Text>
          <Text style={[tailwind`text-xs font-black`, { color: theme.subText }]}>
            {item.paidby || 'Admin'}
          </Text>
        </View>

        <View style={{ backgroundColor: theme.card, px: 2, py: 1 }}>
           <Text style={[tailwind`text-[10px] font-bold`, { color: theme.placeholder }]}>
             {item.createdAt && item.createdAt.seconds 
                ? new Date(item.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                : 'Just now'}
           </Text>
        </View>
      </View>
    </View>
  );
};

export default ExpenseCard;