// Archivo: app/pokedex/_layout.tsx
import { Stack } from 'expo-router';

export default function PokedexLayout() {
  return (
    <Stack>
      {/* Oculta el título para la pantalla de la lista */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Oculta el título para la pantalla de detalles */}
      <Stack.Screen name="details" options={{ headerShown: false }} />
    </Stack>
  );
}