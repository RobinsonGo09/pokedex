import { Link } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 1. Importamos la función de Firebase y nuestra configuración
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Asegúrate de que la ruta sea correcta

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Lógica para registrar un nuevo usuario
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa ambos campos.');
      return;
    }
    setLoading(true);
    try {
      // Usamos la función de Firebase para crear un usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Si tiene éxito, Firebase iniciará sesión automáticamente.
      // La redirección la hará nuestro layout principal.
      console.log('Usuario registrado:', userCredential.user.email);
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.');
    } catch (error: any) {
      // Manejamos los errores más comunes
      let errorMessage = 'Ocurrió un error al registrar la cuenta.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo es inválido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      }
      Alert.alert('Error de registro', errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      
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
        placeholder="Contraseña (mín. 6 caracteres)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* 3. Botón con indicador de carga */}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </Link>
    </View>
  );
}

// Los estilos son los mismos que en la pantalla de Login
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#1c1c1e' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#333', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#EE1515', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, minHeight: 50 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20 },
  linkText: { color: '#3D7DCA', textAlign: 'center', fontSize: 16 },
});