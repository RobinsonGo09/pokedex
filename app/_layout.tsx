import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Oculta el header para la pantalla principal (index.tsx) */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Oculta el header para todas las rutas dentro de la carpeta pokedex */}
      <Stack.Screen name="pokedex" options={{ headerShown: false }} />
      {/* Si tienes una pantalla de detalles específica, asegúrate también de que tenga headerShown: false */}
      <Stack.Screen name="pokedex/details" options={{ headerShown: false }} />
    </Stack>
  );
}