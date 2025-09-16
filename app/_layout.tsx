import { Stack, useRouter, useSegments } from 'expo-router';
// --- LÍNEA CORREGIDA AQUÍ ---
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = React.createContext<{ user: User | null }>({ user: null });

export const useAuth = () => React.useContext(AuthContext);

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <RootLayoutNav />
      )}
    </AuthContext.Provider>
  );
}

function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAppGroup = segments[0] === '(app)';

    if (!user && inAppGroup) {
      router.replace('/login');
    } else if (user && !inAppGroup) {
      router.replace('/(app)');
    }
  }, [user, segments]);
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}