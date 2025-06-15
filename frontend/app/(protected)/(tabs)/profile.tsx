import { EmergencyContactModal } from '@/components/EmergencyContactModal';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import {
    FontAwesome5,
    Ionicons
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Profile() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
    const styles = initstyles(nowColorScheme);
    const authState = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUnpair = async () => {
        try {
            setIsLoading(true);
            await authState.unpair();
            // Only reset role after successful unpair
            await authState.selectRole("");
        } catch (error) {
            console.error('Unpair failed:', error);
            alert('解除配對失敗，請稍後再試');
        } finally {
            setIsLoading(false);
        }
    };

    const MenuItem = ({
        icon,
        label,
        onPress,
    }: {
        icon: React.ReactNode;
        label: string;
        onPress?: () => void;
    }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            {icon}
            <Text style={styles.menuLabel}>{label}</Text>
        </TouchableOpacity>
    );

    // 處理撥打緊急電話
    const handleEmergencyCall = () => {
        if (authState.emergencyContact) {
            Linking.openURL(`tel:${authState.emergencyContact}`);
        }
    };

    return (
        <SafeAreaView style={styles.topBarContainer}>
            <View style={styles.topBar}>
                <Text style={{ color: Colors[nowColorScheme].text, fontWeight: 'bold', fontSize: 28 }}>
                    Profile
                </Text>
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>功能表</Text>
                </View>

                <TouchableOpacity style={styles.profileBox}>
                    <Ionicons
                        name="person-circle-outline"
                        size={40}
                        color={Colors[nowColorScheme].text}
                    />
                    <View style={styles.profileText}>
                        <Text style={styles.username}>{authState.username}</Text>
                        <Text style={styles.subtext}>{authState.userId}</Text>
                    </View>
                </TouchableOpacity>

                {/* 帳戶設定 */}
                <Text style={styles.sectionTitle}>帳戶設定</Text>
                <MenuItem
                    icon={<Ionicons name="key-outline" size={24} color={Colors[nowColorScheme].text} />}
                    label="修改密碼"
                />
                <MenuItem
                    icon={<Ionicons name="settings-outline" size={24} color={Colors[nowColorScheme].text} />}
                    label="一般設定"
                />

                {/* 身份與照顧功能 */}
                <Text style={styles.sectionTitle}>身份與照顧</Text>
                {authState.role === '' ? (
                    <MenuItem
                        icon={<Ionicons name="sync-outline" size={24} color={Colors[nowColorScheme].text} />}
                        label="選擇角色並進行配對"
                        onPress={() => router.push({ pathname: '/(protected)/(pairing)/pairingScreen' })}
                    />
                ) : (
                    <>
                        <MenuItem
                            icon={<FontAwesome5 name="user-shield" size={24} color={Colors[nowColorScheme].text} />}
                            label={`目前身份：${authState.role === 'caretaker' ? '照護者' : '被照顧者'}`}
                        />
                        <MenuItem
                            icon={<Ionicons name="people-outline" size={24} color={Colors[nowColorScheme].text} />}
                            label={`配對對象：${authState.pairedWith ? authState.pairedWith.id : '尚未配對' }`}
                        />
                        {authState.pairedWith ? (
                            <MenuItem
                                icon={<Ionicons name="close-circle-outline" size={24} color="red" />}
                                label={isLoading ? "解除配對中..." : "解除配對"}
                                onPress={handleUnpair}
                            />
                        ) : null}
                    </>
                )}

                {/* 安全與定位 */}
                <Text style={styles.sectionTitle}>安全與定位</Text>
                {authState.emergencyContact ? (
                    <>
                        <MenuItem
                            icon={<Ionicons name="call" size={24} color="red" />}
                            label={`撥打緊急聯絡人 ${authState.emergencyContact}`}
                            onPress={handleEmergencyCall}
                        />
                        <MenuItem
                            icon={<Ionicons name="create-outline" size={24} color={Colors[nowColorScheme].text} />}
                            label="更改緊急聯絡人"
                            onPress={() => setShowModal(true)}
                        />
                    </>
                ) : (
                    <MenuItem
                        icon={<Ionicons name="call-outline" size={24} color={Colors[nowColorScheme].text} />}
                        label="設定緊急聯絡人"
                        onPress={() => setShowModal(true)}
                    />
                )}
                
                <MenuItem
                    icon={<Ionicons name="location-outline" size={24} color={Colors[nowColorScheme].text} />}
                    label="定位授權"
                    onPress={async () => {
                        try {
                            // 先請求前景權限
                            const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
                            if (fgStatus !== 'granted') {
                                alert('定位權限被拒絕');
                                return;
                            }
                            // 再請求背景權限（iOS 會彈出「永遠允許」選項）
                            const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
                            if (bgStatus === 'granted') {
                                console.log('已取得「永遠允許」定位權限');
                            } else {
                                console.log('未取得「永遠允許」定位權限（僅允許使用期間）');
                            }
                        } catch (e) {
                            // alert('定位權限請求失敗');
                            console.log('定位權限請求失敗:', e);
                        }
                    }}
                />

                {/* 登出 */}
                <TouchableOpacity onPress={authState.logOut} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>登出</Text>
                </TouchableOpacity>
            </ScrollView>

            <EmergencyContactModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(phone) => authState.setEmergencyContact(phone)}
                currentPhone={authState.emergencyContact}
            />
        </SafeAreaView>
    );
}

const initstyles = (nowColorScheme: 'light' | 'dark') => {
    return StyleSheet.create({
        topBarContainer: {
            flex: 1,
            backgroundColor: Colors[nowColorScheme].background,
        },
        topBar: {
            backgroundColor: Colors[nowColorScheme].background,
            marginTop: 10,
            paddingBottom: 5,
            paddingTop: Platform.OS === 'android' ? 25 : 0,
            height: Platform.OS === 'android' ? 79 : 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomColor: Colors[nowColorScheme].border,
            borderBottomWidth: 0.5,
        },
        container: {
            flex: 1,
            backgroundColor: Colors[nowColorScheme].background,
            padding: 16,
        },
        header: {
            paddingTop: 16,
            paddingBottom: 8,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: Colors[nowColorScheme].text,
        },
        profileBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors[nowColorScheme].boxBackground,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
        },
        profileText: {
            marginLeft: 12,
        },
        username: {
            fontSize: 16,
            fontWeight: '600',
            color: Colors[nowColorScheme].text,
        },
        subtext: {
            fontSize: 12,
            color: Colors[nowColorScheme].text,
        },
        sectionTitle: {
            marginTop: 20,
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors[nowColorScheme].text,
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors[nowColorScheme].boxBackground,
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
        },
        menuLabel: {
            marginLeft: 12,
            fontSize: 16,
            color: Colors[nowColorScheme].text,
        },
        logoutButton: {
            marginTop: 30,
            alignItems: 'center',
        },
        logoutText: {
            color: 'red',
            fontWeight: 'bold',
            fontSize: 16,
        },
    });
};
