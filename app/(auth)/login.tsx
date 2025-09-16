import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 1. Importamos la función de Firebase y nuestra configuración
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Asegúrate de que la ruta sea correcta

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  // 2. Lógica para iniciar sesión
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true); // Empezamos a cargar
    try {
      // Usamos la función de Firebase para iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Si tiene éxito, Firebase manejará la sesión.
      // La redirección la hará nuestro layout principal.
      console.log('Usuario inició sesión:', userCredential.user.email);
    } catch (error: any) {
      // Manejamos los errores más comunes
      let errorMessage = 'Ocurrió un error al iniciar sesión.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo es inválido.';
      }
      Alert.alert('Error de inicio de sesión', errorMessage);
      console.error(error);
    } finally {
      setLoading(false); // Terminamos la carga
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 3. Botón con indicador de carga */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Link href="/register" style={styles.link}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </Link>
    </View>
  );
}

// Los estilos son los mismos, solo asegúrate de que la ruta del Link sea correcta
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#1c1c1e' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#333', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#EE1515', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, minHeight: 50 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20 },
  linkText: { color: '#3D7DCA', textAlign: 'center', fontSize: 16 },
});