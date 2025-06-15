import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState, useRef, useEffect, useCallback } from 'react'; // Added useRef, useEffect, useCallback
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

    // useRef to hold the timeout ID for polling, ensuring it's consistent across re-renders
    const pollTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // Function to periodically check pairing status (memoized with useCallback)
    const checkPairing = useCallback(async () => {
        // Only proceed if we are in a pairing step
        if (step !== 'showCode' && step !== 'enterCode') return;

        try {
            // First check current status from the backend
            const statusResult = await authState.checkPairStatus();
            if (statusResult.success) {
                // If already paired, set the success message.
                // We do NOT call router.back() here for careReceiver; it's handled by '完成' button.
                setPairResult('配對成功！等待按下完成以離開');
                return; // Stop further checks if already successful
            }

            // If not paired yet, wait for pairing completion (for careReceiver only)
            if (step === 'showCode') { // Only careReceiver waits for external completion
                console.log('Waiting for pairing...');
                const result = await authState.waitForPairComplete();
                if (result.success) {
                    setPairResult('配對成功！等待按下完成以離開');
                    // Again, router.back() is not called here directly.
                }
            }
        } catch (error) {
            console.warn('Check pairing status error:', error);
            // On error, show a message and potentially reset the step
            setPairResult('配對過程中發生錯誤，請稍後再試');
            setStep('choose'); // Reset to choose step on error
            router.back(); // Go back if a significant error occurs
        }
    }, [step, authState, router]); // Include router in dependencies as it's used in error handling

    // Effect hook for managing the polling interval
    useEffect(() => {
        const startPolling = () => {
            // Clear any existing timeout before scheduling a new one to prevent accumulation
            if (pollTimeoutIdRef.current) {
                clearTimeout(pollTimeoutIdRef.current);
                pollTimeoutIdRef.current = undefined;
            }
            // Schedule the next check
            pollTimeoutIdRef.current = setTimeout(async () => {
                await checkPairing(); // Perform the check
                // If not yet successful, reschedule
                if (step === 'showCode' && !pairResult?.includes('成功')) {
                    startPolling(); // Recursive call to schedule next poll
                }
            }, 5000);
        };

        // If currently showing code and not yet successfully paired, start the initial check and polling
        if (step === 'showCode' && !pairResult?.includes('成功')) {
            checkPairing(); // Initial immediate check
            startPolling(); // Start the polling cycle
        } else if (pairResult?.includes('成功') && pollTimeoutIdRef.current) {
            // If pairing became successful, stop any active polling
            clearTimeout(pollTimeoutIdRef.current);
            pollTimeoutIdRef.current = undefined;
        }

        // Cleanup function: This runs when the component unmounts or before the effect re-runs
        return () => {
            if (pollTimeoutIdRef.current) {
                clearTimeout(pollTimeoutIdRef.current);
                pollTimeoutIdRef.current = undefined;
            }
        };
    }, [step, pairResult, checkPairing]); // Dependencies: re-run if step, pairResult, or checkPairing changes

    const handlePair = async (role: 'caretaker' | 'careReceiver') => {
        try {
            setSelectedRole(role);
            if (role === 'careReceiver') {
                const code = await authState.generatePairCode();
                setPairingCode(code);
                setStep('showCode');
                setPairResult(null); // Clear previous pair result
                // Polling starts automatically via useEffect
            } else {
                setStep('enterCode');
                setPairResult(null); // Clear previous pair result
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
            if (text && idx < 5) {
                inputRefs[idx + 1].current?.focus();
            }
        }
    };

    const handleVerify = async () => {
        const code = inputCode.join('');
        setLoading(true);
        try {
            const result = await authState.submitPairCode(code);
            if (result.success) {
                setPairResult('配對成功！');
                // For caretaker, we can navigate back immediately after successful submission
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
            // Role should already be set by waitForPairComplete in authContext.tsx,
            // but we can ensure it's persisted and then navigate.
            await authState.selectRole('careReceiver');
            console.log('router.back(); handleCareReceiverConfirm！');
            router.back(); // Navigate back only ONCE after user confirms
        } catch (error) {
            console.error('Setting care receiver role failed:', error);
            setPairResult('設定失敗，請稍後再試');
            setSelectedRole('');
            setPairingCode('');
        } finally {
            setLoading(false);
        }
    };

    // Cancel: reset local state and unpair from context
    const handleCancel = async () => {
        try {
            await authState.unpair();
            setStep('choose');
            setSelectedRole('');
            setPairingCode('');
            setInputCode(['', '', '', '', '', '']);
            setPairResult(null);
            console.log('router.back(); handleCancel');
            router.back(); // Navigate back
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
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
                            onPress={handleCareReceiverConfirm}
                            disabled={!pairResult?.includes('成功')} // Disable until successful
                        >
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