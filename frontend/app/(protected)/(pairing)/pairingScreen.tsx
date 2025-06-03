import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export const unstable_settings = {
  presentation: 'modal',
};

// --- Mock backend functions ---
function mockGeneratePairingCode() {
  // Returns a random 6-digit code as string
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function VerifyPairingCode(code: string) {
  // Always succeed for demo, return a mock username
  if (code.length === 6) return { success: true, username: '被照顧者A' };
  return { success: false };
}

export default function PairingScreen() {
  const authState = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = createStyles(colorScheme);

  const [step, setStep] = useState<'choose'|'showCode'|'enterCode'>('choose');
  const [pairingCode, setPairingCode] = useState('');
  const [inputCode, setInputCode] = useState(['','','','','','']);
  const [pairResult, setPairResult] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'caregiver' | 'careReceiver' | null>(null);

  const inputRefs = Array.from({ length: 6 }, () => React.createRef<TextInput>());

  const handlePair = (role: 'caregiver' | 'careReceiver') => {
    setSelectedRole(role);
    if (role === 'careReceiver') {
      // Generate code for 被照顧者
      setPairingCode(mockGeneratePairingCode());
      setStep('showCode');
    } else {
      setStep('enterCode');
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
  const handleVerify = () => {
    const code = inputCode.join('');
    setLoading(true);
    setTimeout(() => {
      const result = VerifyPairingCode(code);
      setLoading(false);
      if (result.success) {
        setPairResult(`配對成功！對象：${result.username ?? '被照顧者A'}`);
        authState.selectRole('caregiver');
        authState.pairWith(result.username ?? '被照顧者A');
        setTimeout(() => {
          router.back();
        }, 200); // 1秒後自動退出配對畫面
      } else {
        setPairResult('配對失敗，請檢查代碼');
        authState.unpair();
      }
    }, 800);
  };

  // For careReceiver, confirm after showing code
  const handleCareReceiverConfirm = () => {
    authState.selectRole('careReceiver');
    // pairingWith can be set later if needed
    authState.pairWith('照護者A'); // Mock pairing with caregiver
    router.back();
  };

  // Cancel: reset local state, do not set role
  const handleCancel = () => {
    setStep('choose');
    setSelectedRole(null);
    setPairingCode('');
    setInputCode(['','','','','','']);
    setPairResult(null);
    setLoading(false);
    router.back();
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
                  autoFocus={i===0}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.optionBox} onPress={handleVerify} disabled={loading || inputCode.some(c=>!c)}>
              <Text style={styles.optionText}>{loading ? '驗證中...' : '配對'}</Text>
            </TouchableOpacity>
            {pairResult && <Text style={{color: pairResult.includes('成功') ? 'green' : 'red', marginTop: 10}}>{pairResult}</Text>}
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
