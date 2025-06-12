// components/AutocompleteInput.tsx
import React, { useState } from 'react';
import {
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface AutocompleteInputProps {
  label: string;
  data: string[];
  value: string;
  onChange: (val: string) => void;
  colorScheme: 'light' | 'dark'; 
}

export default function AutocompleteInput({
  label,
  data,
  value,
  onChange,
  colorScheme,
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (text: string) => {
    onChange(text);
    if (text.length === 0) {
      setSuggestions([]);
    } else {
      const filtered = data.filter((item) => item.includes(text));
      setSuggestions(filtered);
    }
  };

  const handleSelectSuggestion = (selected: string) => {
    onChange(selected);
    setSuggestions([]);
  };

  const styles = initStyles(colorScheme);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={handleInputChange}
        style={styles.input}
        placeholder={`請輸入 ${label}`}
        placeholderTextColor={Colors[colorScheme].subtext}
      />
      {suggestions.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions.map((item) => (
            <TouchableOpacity key={item} onPress={() => handleSelectSuggestion(item)}>
              <Text style={styles.suggestion}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        )}
    </View>
  );
}

const initStyles = (mode: 'light' | 'dark') =>
  StyleSheet.create({
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[mode].text,
      marginBottom: 8,
    },
    input: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderColor: Colors[mode].border,
      borderRadius: 8,
      color: Colors[mode].text,
      backgroundColor: Colors[mode].background,
      marginBottom: 8,
    },
    suggestionBox: {
      width: '100%',
      backgroundColor: '#2C2C2E',
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: Colors[mode].border,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      marginTop: -8,
      zIndex: 10,
    },
    suggestion: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: Colors[mode].text,
      borderBottomWidth: 1,
      borderBottomColor: Colors[mode].border,
    },
  });
