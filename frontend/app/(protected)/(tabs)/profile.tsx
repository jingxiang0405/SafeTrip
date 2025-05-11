import { Link, useRouter } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '@/utils/authContext';
import { StyleSheet, Text, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@react-navigation/elements';

export function Index2() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}

export default function Profile() {
  const router = useRouter();
  const authState = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <ThemedText >Home screen</ThemedText>
      <ThemedText >{JSON.stringify(authState)}</ThemedText>
      <ThemedText >Hello, {authState.username}</ThemedText>
      <ThemedText style={{color: '#00a'}}>Edit app/index.tsx to edit this screen.</ThemedText>
      <Link href="/about" style={styles.button}>
        Go to About screen
      </Link>
      <Link href="/map-test" style={styles.button}>
        Go to Map
      </Link>
      <Button onPress={authState.logOut}>Log out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    // color: '#fff',
  },
});
