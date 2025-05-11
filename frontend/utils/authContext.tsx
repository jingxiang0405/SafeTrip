import { useState, createContext, PropsWithChildren, useEffect } from "react";
import { SplashScreen, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  username?: string;
  logIn: (username: string, password: string) => void;
  logOut: () => void;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  username: "",
  logIn: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>(""); // Use 'string' instead of 'String'
  const router = useRouter();

  const storeAuthState = async (username: string, token: string) => {
    try {
      const jsonValue = JSON.stringify({ username, token });
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const logIn = (username: string, password: string) => {
    setIsLoggedIn(true);
    setUsername(username); // Set the username when logging in
    storeAuthState(username, "dummy-user-token");
    router.replace("/"); // Navigate to home page after login
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUsername(""); // Clear the username when logging out
    AsyncStorage.removeItem(authStorageKey);
    router.replace("/login"); // Navigate to login page
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const { username, token } = JSON.parse(value); // Extract username and token
          // TODO check if token is valid
          setUsername(username); // Set the username from storage
          setIsLoggedIn(true); // Set logged-in state to true
        }
      } catch (e) {
        console.log("Error fetching from storage", e);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider value={{ isReady, isLoggedIn, username, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
