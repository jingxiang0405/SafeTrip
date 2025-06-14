import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface EmergencyContactModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (phone: string) => void;
    currentPhone?: string;
}

export function EmergencyContactModal({
    visible,
    onClose,
    onSubmit,
    currentPhone = '',
}: EmergencyContactModalProps) {
    const [phone, setPhone] = useState(currentPhone);
    const colorScheme = useColorScheme();
    const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';

    const handleSubmit = () => {
        if (phone.length >= 8) {  // 基本的電話號碼長度驗證
            onSubmit(phone);
            onClose();
        } else {
            alert('請輸入有效的電話號碼');
        }
    };

    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: Colors[nowColorScheme].background,
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: Colors[nowColorScheme].text,
        },
        input: {
            width: '100%',
            height: 40,
            borderWidth: 1,
            borderColor: Colors[nowColorScheme].border,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 20,
            color: Colors[nowColorScheme].text,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
        button: {
            padding: 10,
            borderRadius: 5,
            width: '45%',
            alignItems: 'center',
        },
        submitButton: {
            backgroundColor: '#007AFF',
        },
        cancelButton: {
            backgroundColor: '#FF3B30',
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
        },
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>設定緊急聯絡人</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="請輸入電話號碼"
                        placeholderTextColor={Colors[nowColorScheme].subtext}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>確認</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
