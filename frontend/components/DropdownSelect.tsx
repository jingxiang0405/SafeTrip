import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '@/constants/Colors';

export type Option = { label: string; value: string };

interface DropdownSelectProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  colorScheme: 'light' | 'dark';
}

export default function DropdownSelect({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder = '請選擇',
  colorScheme
}: DropdownSelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const styles = createStyles(colorScheme);

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>
          {selectedLabel ?? placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onValueChange(item.value);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
  const palette = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      color: palette.text,
      marginBottom: 4,
      fontSize: 16,
    },
    selector: {
      borderWidth: 1,
      borderColor: palette.border,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: palette.background,
    },
    selectedText: {
      color: palette.text,
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
      position: 'absolute',
      top: '30%',
      left: '10%',
      right: '10%',
      backgroundColor: palette.boxBackground,
      borderRadius: 8,
      maxHeight: '40%',
    },
    item: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    itemText: {
      color: palette.text,
      fontSize: 16,
    },
  });
};
