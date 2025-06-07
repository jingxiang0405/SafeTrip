import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export const unstable_settings = {
    presentation: 'modal',
};

export default function PairingScreen() {
    const authState = useContext(AuthContext);
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const styles = createStyles(colorScheme);

    const [step, setStep] = useState<'choose' | 'showCode' | 'enterCode'>('choose');
    const [pairingCode, setPairingCode] = useState('');
    const [inputCode, setInputCode] = useState(['', '', '', '', '', '']);
    const [pairResult, setPairResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('');

    const inputRefs = Array.from({ length: 6 }, () => React.createRef<TextInput>());

    const handlePair = async (role: 'caregiver' | 'careReceiver') => {
        try {
            setSelectedRole(role);
            if (role === 'careReceiver') {
                // Generate code for 被照顧者
                // TODO: Backend 
                // Returns a random 6-digit code as string
                // const code = await GenerateCode();
                const code = '123456';
                setPairingCode(code);
                setStep('showCode');
            } else {
                setStep('enterCode');
            }
        } catch (error) {
            console.error('Handle pair failed:', error);
            setSelectedRole('');
        }
    };

    const handleInputChange = (text: string, idx: number) => {
        if (/^\d?$/.test(text)) {
            const arr = [...inputCode];
            arr[idx] = text;
            setInputCode(arr);
            // Auto focus next field if filled (native, not document)
            if (text && idx < 5) {
                inputRefs[idx + 1].current?.focus();
            }
        }
    };

    // When pairing is successful, THEN set role in context
    const handleVerify = async () => {
        const code = inputCode.join('');
        setLoading(true);
        try {
            // TODO: Backend
            // const result = await PairWithCode(code);
            const result = {
                status: 200,
                data: {
                    username: "被照顧者A",
                }
            };

            if (result.status === 200) {
                const newRole = 'caregiver';
                // First set role
                await authState.selectRole(newRole);
                
                // Then do pairing, passing the role we just set
                await authState.pairWith({
                    name: result.data.username ?? '', 
                    id: 123
                }, newRole); // Pass the role we just set
                
                setPairResult(`配對成功！對象：${result.data.username ?? "Unknown"}`);
                router.back();
            } else {
                setPairResult('配對失敗，請檢查代碼');
            }
        } catch (error) {
            console.error('Pairing failed:', error);
            setPairResult('配對失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    // For careReceiver, confirm after showing code
    const handleCareReceiverConfirm = async () => {
        setLoading(true);
        try {
            const newRole = 'careReceiver';
            // First set role
            await authState.selectRole(newRole);
            
            // Then do pairing, passing the role we just set
            await authState.pairWith({
                name: '照護者A', 
                id: 123
            }, newRole); // Pass the role we just set
            
            router.back();
        } catch (error) {
            console.error('Setting care receiver failed:', error);
            setPairResult('設定失敗，請稍後再試');
            setSelectedRole('');
            setPairingCode('');
        } finally {
            setLoading(false);
        }
    };

    // Cancel: reset local state, do not set role
    const handleCancel = async () => {
        try {
            await authState.unpair();
            setStep('choose');
            setSelectedRole('');
            setPairingCode('');
            setInputCode(['', '', '', '', '', '']);
            setPairResult(null);
            router.back();
        } catch (error) {
            console.error('Cancel failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // UI rendering
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innercontainer}>
                {step === 'choose' && (
                    <>
                        <Text style={styles.title}>選擇您的身份</Text>
                        <TouchableOpacity style={styles.optionBox} onPress={() => handlePair('caregiver')}>
                            <Ionicons name="person-outline" size={30} color={Colors[colorScheme].text} />
                            <Text style={styles.optionText}>我是照護者</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBox} onPress={() => handlePair('careReceiver')}>
                            <Ionicons name="heart-outline" size={30} color={Colors[colorScheme].text} />
                            <Text style={styles.optionText}>我是被照顧者</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>
                    </>
                )}
                {step === 'showCode' && (
                    <>
                        <Text style={styles.title}>請讓照護者輸入此配對代碼</Text>
                        <View style={styles.codeBox}>
                            <Text style={styles.codeText}>{pairingCode}</Text>
                        </View>
                        <TouchableOpacity style={styles.optionBox} onPress={handleCareReceiverConfirm}>
                            <Text style={styles.optionText}>完成</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>
                    </>
                )}
                {step === 'enterCode' && (
                    <>
                        <Text style={styles.title}>請輸入被照顧者的6位配對代碼</Text>
                        <View style={styles.inputRow}>
                            {inputCode.map((v, i) => (
                                <TextInput
                                    key={i}
                                    ref={inputRefs[i]}
                                    style={styles.codeInput}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={v}
                                    onChangeText={t => handleInputChange(t, i)}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </View>
                        <TouchableOpacity style={styles.optionBox} onPress={handleVerify} disabled={loading || inputCode.some(c => !c)}>
                            <Text style={styles.optionText}>{loading ? '驗證中...' : '配對'}</Text>
                        </TouchableOpacity>
                        {pairResult && <Text style={{ color: pairResult.includes('成功') ? 'green' : 'red', marginTop: 10 }}>{pairResult}</Text>}
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelText}>返回</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

function createStyles(colorScheme: 'light' | 'dark') {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors[colorScheme].background,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        innercontainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%',
            maxWidth: 600,
            minWidth: 300
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors[colorScheme].text,
            marginBottom: 40,
        },
        optionBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors[colorScheme].boxBackground,
            padding: 16,
            marginVertical: 10,
            width: '100%',
            borderRadius: 12,
        },
        optionText: {
            fontSize: 18,
            marginLeft: 12,
            color: Colors[colorScheme].text,
        },
        cancelButton: {
            marginTop: 40,
        },
        cancelText: {
            fontSize: 16,
            color: 'red',
        },
        codeBox: {
            backgroundColor: Colors[colorScheme].boxBackground,
            padding: 24,
            borderRadius: 12,
            marginVertical: 24,
        },
        codeText: {
            fontSize: 36,
            fontWeight: 'bold',
            letterSpacing: 8,
            color: Colors[colorScheme].tint,
            textAlign: 'center',
        },
        inputRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 24,
            gap: 8,
        },
        codeInput: {
            width: 40,
            height: 50,
            borderWidth: 1,
            borderColor: Colors[colorScheme].border,
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 28,
            color: Colors[colorScheme].text,
            backgroundColor: Colors[colorScheme].boxBackground,
        },
    });
}
