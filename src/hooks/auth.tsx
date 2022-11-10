import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { AppleAuthenticationScope } from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userStorageKey } from '../utils/constants';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import { Alert } from 'react-native';

const { GOOGLE_CLIENT_ID } = process.env;
const { GOOGLE_REDIRECT_URI } = process.env;

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface IAuthContextData {
  user: User;
  signInWhithGoogle(): Promise<void>;
  signInWhithApple(): Promise<void>;
  logout(): Promise<void>;
  isLoadding: boolean;
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [isLoadding, setIsLoadding] = useState(true);

  async function signInWhithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params, type } =
        (await AuthSession.startAsync({
          authUrl,
        })) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`
        );
        const userInfo = await response.json();

        setUser({
          id: userInfo.id,
          name: userInfo.given_name!,
          email: userInfo.email!,
          photo: userInfo.picture!, // API ui-avatars para criar img com iniciais do nome inserido
        });
        await AsyncStorage.setItem(
          userStorageKey,
          JSON.stringify(user)
        );
      }
    } catch (error) {
      // console.log(error);
      throw new Error(error);
    }
  }

  async function signInWhithApple() {
    try {
      const credential =
        await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthenticationScope.FULL_NAME,
            AppleAuthenticationScope.EMAIL,
          ],
        });
      if (credential) {
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;
        setUser({
          id: String(credential.user),
          name: credential.fullName!.givenName!,
          email: credential.email!,
          photo, // API ui-avatars para criar img com iniciais do nome inserido
        });
        await AsyncStorage.setItem(
          userStorageKey,
          JSON.stringify(user)
        );
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function logout() {
    // console.log('Logout');
    // Alert.alert('Logout');
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }

  useEffect(() => {
    setIsLoadding(true);

    async function loadUserStorageData() {
      const userStoraged = await AsyncStorage.getItem(
        userStorageKey
      );
      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
      setIsLoadding(false);
    }

    loadUserStorageData();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        signInWhithGoogle,
        signInWhithApple,
        logout,
        isLoadding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { useAuth, AuthProvider };
