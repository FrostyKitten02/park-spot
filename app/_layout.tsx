import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import {runMigrations} from "@/storage/migrate";
import db from "@/storage/database";
import {SQLiteProvider} from "expo-sqlite";
import AddCarModal from "@/app/AddCarModal";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function hideSplashAfterDelay() {
      if (loaded) {
        // try {
        //   db.closeSync()
        //   runMigrations();
        // } catch (err) {
        //   console.error(err);
        // }
        await new Promise(resolve => setTimeout(resolve, 250));
        await SplashScreen.hideAsync();
      }
    }

    hideSplashAfterDelay();
  }, [loaded]);


  // useEffect(() => {
  //   return () => {
  //     db.closeSync()
  //   };
  // }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName={"park-spot6"} onInit={async (db) => runMigrations(db)}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
              name="AddCarModal"
              options={{
                title: 'Add a New Car',
                presentation: 'modal'
              }}
          />
          <Stack.Screen
              name="AddParkedModal"
              options={{
                title: 'Add Parking',
                presentation: 'modal'
              }}
          />
          <Stack.Screen
              name="MapScreen"
              options={{
                  headerShown: true,
                  headerTitle: ''
              }}
          />
        </Stack>
      </SQLiteProvider>
    </ThemeProvider>
  );
}
