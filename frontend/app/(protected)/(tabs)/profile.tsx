import { useContext } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '@/utils/authContext';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
const router = useRouter();

export default function Profile() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const styles = initstyles(nowColorScheme);
  const authState = useContext(AuthContext);
  const navigation = useNavigation<any>();

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
            <Text style={styles.subtext}>帳戶資訊</Text>
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
        {authState.role === null ? (
          <MenuItem
            icon={<Ionicons name="sync-outline" size={24} color={Colors[nowColorScheme].text} />}
            label="選擇角色並進行配對"
            onPress={() => router.push({ pathname: '/(protected)/(pairing)/pairingScreen' })}
          />
        ) : (
          <>
            <MenuItem
              icon={<FontAwesome5 name="user-shield" size={24} color={Colors[nowColorScheme].text} />}
              label={`目前身份：${authState.role === 'caregiver' ? '照護者' : '被照顧者'}`}
            />
            <MenuItem
              icon={<Ionicons name="people-outline" size={24} color={Colors[nowColorScheme].text} />}
              label={`配對對象：${authState.pairedWith ?? '尚未配對'}`}
            />
            <MenuItem
              icon={<Ionicons name="close-circle-outline" size={24} color="red" />}
              label="解除配對"
              onPress={authState.unpair}
            />
          </>
        )}

        {/* 安全與定位 */}
        <Text style={styles.sectionTitle}>安全與定位</Text>
        <MenuItem
          icon={<Ionicons name="call-outline" size={24} color={Colors[nowColorScheme].text} />}
          label="設定緊急聯絡人"
        />
        <MenuItem
          icon={<Ionicons name="location-outline" size={24} color={Colors[nowColorScheme].text} />}
          label="定位授權"
        />

        {/* 社群功能 */}
        <Text style={styles.sectionTitle}>社群</Text>
        <MenuItem
          icon={<Ionicons name="add-circle-outline" size={24} color={Colors[nowColorScheme].text} />}
          label="建立社群"
        />
        <MenuItem
          icon={<Ionicons name="person-add-outline" size={24} color={Colors[nowColorScheme].text} />}
          label="交友邀請"
        />

        {/* Facebook 社團 */}
        <Text style={styles.sectionTitle}>Facebook 社團</Text>
        <MenuItem
          icon={<Ionicons name="people-circle-outline" size={24} color={Colors[nowColorScheme].text} />}
          label="NCCU 政大學生交流板"
        />

        {/* 登出 */}
        <TouchableOpacity onPress={authState.logOut} style={styles.logoutButton}>
          <Text style={styles.logoutText}>登出</Text>
        </TouchableOpacity>
      </ScrollView>
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
