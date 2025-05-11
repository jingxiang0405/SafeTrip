import { useContext } from 'react';
import { AuthContext } from '@/utils/authContext';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@react-navigation/elements';

export default function Profile() {
  const authState = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome, {authState.username}!</ThemedText>
      </ThemedView>
      <Button onPress={authState.logOut}>Log out</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
