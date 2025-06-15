import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

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

    // Function to periodically check pairing status
    const checkPairing = React.useCallback(async () => {
        if (step !== 'showCode' && step !== 'enterCode') return;

        try {
            // First check current status
            const statusResult = await authState.checkPairStatus();
            if (statusResult.success) {
                setStep('choose'); // Reset to choose step
                setPairResult('配對成功！等待按下完成以離開');
                return;
            }

            // If not paired yet, wait for pairing
            const result = await authState.waitForPairComplete();
            if (result.success) {
                setStep('choose'); // Reset to choose step
                setPairResult('配對成功！等待按下完成以離開');
                // authState.selectRole(selectedRole); // Set role after pairing
                // authState.setPairedWith( { id: result.partner_id, name: '' });
            }
        } catch (error) {
            console.warn('Check pairing status error:', error);
            if (step === 'showCode' || step === 'enterCode') {
                setStep('choose'); // Reset to choose step on error
                router.back(); // Go back if error occurs
            }
            // setPairResult('配對過程中發生錯誤，請稍後再試');
            // if (error.message?.includes('timeout')) {
            //     // If timeout, just continue polling
            //     setPairResult('正在等待照護者輸入配對代碼...');
            // } else {
            //     console.error('Checking pairing status failed:', error);
            //     setPairResult('檢查配對狀態失敗，請重試');
            // }
        }
    }, [router, step, authState]);

    // Start checking when showing code
    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        async function pollPairingStatus() {
            if (step === 'showCode' && !pairResult?.includes('成功')) {
                await checkPairing();
                timeoutId = setTimeout(pollPairingStatus, 5000); // Check every 5 seconds
            }
        }

        pollPairingStatus();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [step, checkPairing, pairResult]);

    const handlePair = async (role: 'caretaker' | 'careReceiver') => {
        try {
            setSelectedRole(role);
            if (role === 'careReceiver') {
                const code = await authState.generatePairCode();
                setPairingCode(code);
                setStep('showCode');
                // Start checking for pairing completion
                checkPairing();
            } else {
                setStep('enterCode');
            }
        } catch (error) {
            console.error('Handle pair failed:', error);
            setSelectedRole('');
            Alert.alert('Error', 'Failed to start pairing process. Please try again.');
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
            const result = await authState.submitPairCode(code);
            if (result.success) {
                const newRole = 'caretaker';
                // First set role
                await authState.selectRole(newRole);
                
                setPairResult(`配對成功！`);
                setTimeout(() => {
                    setStep('choose'); // Reset to choose step
                    router.back();
                }, 500); // Give user time to see success message
            } else {
                setPairResult('配對失敗，請檢查代碼');
            }
        } catch (error) {
            console.warn('Pairing failed:', error);
            setPairResult('配對失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    // For careReceiver, confirm after showing code
    const handleCareReceiverConfirm = async () => {
        if (!pairResult?.includes('成功')) {
            Alert.alert('提示', '尚未配對成功，請等待照護者輸入配對代碼');
            return;
        }
        
        setLoading(true);
        try {
            const newRole = 'careReceiver';
            // First set role
            await authState.selectRole(newRole);
            router.back();
        } catch (error) {
            console.error('Setting care receiver role failed:', error);
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
                        <TouchableOpacity style={styles.optionBox} onPress={() => handlePair('careReceiver')}>
                            <Ionicons name="heart-outline" size={30} color={Colors[colorScheme].text} />
                            <Text style={styles.optionText}>我是被照顧者</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBox} onPress={() => handlePair('caretaker')}>
                            <Ionicons name="person-outline" size={30} color={Colors[colorScheme].text} />
                            <Text style={styles.optionText}>我是照護者</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => {
                                handleCancel();
                                router.back()
                            }
                        }>
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>
                    </>
                )}
                {step === 'showCode' && (
                    <>
                        <Text style={styles.title}>請讓照護者輸入配對代碼</Text>
                        <View style={styles.codeBox}>
                            <Text style={styles.codeText}>{pairingCode}</Text>
                        </View>
                        {pairResult && (
                            <Text style={{ 
                                fontSize: 16, 
                                color: pairResult.includes('成功') ? 'green' : Colors[colorScheme].text,
                                marginBottom: 20,
                                textAlign: 'center'
                            }}>
                                {pairResult}
                            </Text>
                        )}
                        <TouchableOpacity 
                            style={[
                                styles.optionBox,
                                !pairResult?.includes('成功') && { opacity: 0.5 }
                            ]} 
                            onPress={handleCareReceiverConfirm}>
                            <Text style={styles.optionText}>完成</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>
                    </>
                )}
                {step === 'enterCode' && (
                    <>
                        <Text style={styles.title}>請輸入配對代碼</Text>
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
