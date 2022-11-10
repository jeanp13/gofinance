import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { ThemeProvider } from 'styled-components';

import * as SplashScreen from 'expo-splash-screen';
// import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

import { AuthProvider } from './src/hooks/auth';
import Routes from './src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    // return <AppLoading />;
    return;
  }

  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <ThemeProvider theme={theme}>
        <StatusBar
          barStyle="default"
          backgroundColor="transparent"
          translucent
        />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
