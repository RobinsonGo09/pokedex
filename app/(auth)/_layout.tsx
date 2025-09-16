// Archivo: app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  // screenOptions aplica headerShown: false a TODAS las pantallas de este grupo (login y register)
  return <Stack screenOptions={{ headerShown: false }} />;
}