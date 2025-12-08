import { Slot, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function Layout() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/"); // volta para login
      }
    };

    checkAuth();
  }, []);

  return <Slot />;
}
