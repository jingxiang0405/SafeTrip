import { useState, createContext, PropsWithChildren, useEffect } from "react";
import { SplashScreen, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

type Role = "caregiver" | "careReceiver" | null;

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  username?: string;
  role: Role;
  pairedWith: string | null;
  token: string;

  logIn: (username: string, password: string) => void;
  signUp: (username: string, email: string, phone: string, password: string) => void;
  logOut: () => void;

  selectRole: (newRole: Role) => void;
  pairWith: (partnerUsername: string) => void;
  unpair: () => void;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  username: "",
  role: null,
  pairedWith: null,
  token: "",

  logIn: () => {},
  signUp: () => {},
  logOut: () => {},
  selectRole: () => {},
  pairWith: () => {},
  unpair: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<Role>(null);
  const [pairedWith, setPairedWith] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  const router = useRouter();

  const storeAuthState = async (auth: {
    username: string;
    token: string;
    role: Role;
    pairedWith: string | null;
  }) => {
    try {
      const jsonValue = JSON.stringify(auth);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (e) {
      console.log("store error", e);
    }
  };

  const logIn = (username: string, password: string) => {
    const newToken = "dummy-user-token";
    setIsLoggedIn(true);
    setUsername(username);
    setToken(newToken);
    setRole(null);
    setPairedWith(null);
    storeAuthState({ username, token: newToken, role: null, pairedWith: null });
    router.replace("/");
  };

  const signUp = (username: string, email: string, phone: string, password: string) => {
    const newToken = "dummy-user-token";
    setIsLoggedIn(true);
    setUsername(username);
    setToken(newToken);
    setRole(null);
    setPairedWith(null);
    storeAuthState({ username, token: newToken, role: null, pairedWith: null });
    router.replace("/");
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUsername("");
    setToken("");
    setRole(null);
    setPairedWith(null);
    AsyncStorage.removeItem(authStorageKey);
    router.replace("/login");
  };

  const selectRole = (newRole: Role) => {
    setRole(newRole);
    storeAuthState({ username, token, role: newRole, pairedWith });
  };

  const pairWith = (partnerUsername: string) => {
    setPairedWith(partnerUsername);
    storeAuthState({ username, token, role, pairedWith: partnerUsername });
  };

  const unpair = () => {
    setPairedWith(null);
    storeAuthState({ username, token, role, pairedWith: null });
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const { username, token, role, pairedWith } = JSON.parse(value);
          setUsername(username);
          setToken(token);
          setRole(role);
          setPairedWith(pairedWith);
          setIsLoggedIn(true);
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
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isReady,
        username,
        token,
        role,
        pairedWith,
        logIn,
        signUp,
        logOut,
        selectRole,
        pairWith,
        unpair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
