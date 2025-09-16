import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* --- INICIO DE LA POKÉBOLA DIBUJADA CON CÓDIGO --- */}
      <View style={styles.pokeball}>
        <View style={styles.topHalf} />
        <View style={styles.bottomHalf} />
        <View style={styles.centerBand} />
        <View style={styles.centerButtonOuter}>
          <View style={styles.centerButtonInner} />
        </View>
      </View>
      {/* --- FIN DE LA POKÉBOLA --- */}

      <Text style={styles.title}>Bienvenido al Mundo Pokémon</Text>
      <Text style={styles.subtitle}>Tu Pokédex personal te espera.</Text>
      
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Inicia Sesión para Continuar</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1F2D', // Un azul noche oscuro
    padding: 20,
  },
  // --- Estilos para dibujar la Pokébda ---
  pokeball: {
    width: 180,
    height: 180,
    borderRadius: 90, // Círculo perfecto
    borderWidth: 6,
    borderColor: '#000',
    backgroundColor: '#fff', // El fondo es la parte blanca
    overflow: 'hidden', // Oculta lo que se salga del círculo
    marginBottom: 40,
    position: 'relative', // Para posicionar los elementos internos
  },
  topHalf: {
    width: '100%',
    height: '50%',
    backgroundColor: '#EE1515', // Rojo Pokédex
  },
  bottomHalf: {
    width: '100%',
    height: '50%',
    backgroundColor: '#fff', // Blanco Pokédex
  },
  centerBand: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 18, // Grosor de la banda negra
    backgroundColor: '#000',
    transform: [{ translateY: -9 }], // Centra la banda verticalmente
    zIndex: 1,
  },
  centerButtonOuter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 6,
    borderColor: '#000',
    transform: [{ translateX: -30 }, { translateY: -30 }], // Centra el botón
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  centerButtonInner: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
  },
  // --- Fin de estilos de la Pokébda ---
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFCC00', // Amarillo Pokémon
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#d3d3d3', // Un gris más claro
    textAlign: 'center',
    marginBottom: 60,
  },
  loginButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#f0ededff', // Borde amarillo
    shadowColor: '#fd0202ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonText: {
    color: '#e70b0bff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});