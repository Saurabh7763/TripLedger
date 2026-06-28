import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import { TrashIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';

const DeleteModal = ({ visible, onClose, onConfirm, title, message }) => {
  const { theme, isDark } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[tailwind`flex-1 justify-center items-center px-6`, { backgroundColor: theme.modalOverlay }]}>
        <View style={[tailwind`w-full rounded-[32px] p-8 items-center shadow-2xl`, { backgroundColor: theme.card }]}>
          
          <View style={[tailwind`w-20 h-20 rounded-full items-center justify-center mb-6`, { backgroundColor: isDark ? '#3F1616' : '#FEF2F2' }]}>
            <TrashIcon size={40} color="#EF4444" />
          </View>

          <Text style={[tailwind`text-2xl font-black text-center mb-2`, { color: theme.text }]}>
            {title || "Wait a second!"}
          </Text>
          
          <Text style={[tailwind`font-bold text-center mb-8 leading-5`, { color: theme.subText }]}>
            {message || "Are you sure you want to delete this? This action cannot be undone."}
          </Text>

          <View style={tailwind`flex-row gap-4 w-full`}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[tailwind`flex-1 py-4 rounded-2xl items-center`, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]}
              onPress={onClose}
            >
              <Text style={[tailwind`font-black`, { color: theme.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={tailwind`flex-1 py-4 bg-red-500 rounded-2xl items-center shadow-lg shadow-red-200`}
              onPress={onConfirm}
            >
              <Text style={tailwind`text-white font-black`}>Delete</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={onClose}
            style={tailwind`absolute top-6 right-6 p-1`}
          >
            <XMarkIcon size={24} color={theme.placeholder} />
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
