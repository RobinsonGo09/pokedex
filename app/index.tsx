import { CameraView, useCameraPermissions } from 'expo-camera';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PokedexScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) { return <View />; }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Necesitamos tu permiso para usar la cámara.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCamera = () => {
    setIsCameraActive(prevState => !prevState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.cameraLens} />
        <View style={styles.indicatorLights}>
          <View style={[styles.light, { backgroundColor: '#DE362C' }]} />
          <View style={[styles.light, { backgroundColor: '#F5E52B' }]} />
          <View style={[styles.light, { backgroundColor: '#50AF5D' }]} />
        </View>
      </View>
      
      <Text style={styles.title}>Pokédex</Text>

      <View style={styles.screenFrame}>
        {isCameraActive ? (
          <CameraView style={styles.cameraPreview} facing='back'>
            <View style={styles.scannerOverlay}>
               <Text style={styles.scannerText}>Escaneando...</Text>
            </View>
          </CameraView>
        ) : (
          <View style={styles.placeholderScreen}>
            <Text style={styles.placeholderText}>Cámara desactivada</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.customButton} onPress={toggleCamera}>
          <Text style={styles.buttonText}>
            {isCameraActive ? 'Detener' : 'Escanear'}
          </Text>
        </TouchableOpacity>

        {/* --- CORRECCIÓN DEL BOTÓN "ACTIVAR POKÉDEX" --- */}
        {/* Aplicamos el estilo directamente al Link y quitamos el TouchableOpacity anidado */}
        <Link href="/pokedex" style={[styles.customButton, styles.greenButton]}>
          <Text style={styles.buttonText}>Activar Pokédex</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EE1515',
    padding: 20,
    // --- CORRECCIÓN DE ESPACIOS VERTICALES ---
    // Cambiamos 'space-between' por 'space-around' para un espaciado más equilibrado
    justifyContent: 'space-around',
    borderWidth: 10,
    borderColor: '#C40D0D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // Quitamos el paddingTop para que se ajuste con space-around
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#FFCC00',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 10,
    alignSelf: 'center',
    // Ajustamos los márgenes para controlar la posición
    marginTop: -10,
    marginBottom: 5,
  },
  cameraLens: {
    width: 70,
    height: 70,
    backgroundColor: '#3D7DCA',
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#fff',
  },
  indicatorLights: {
    flexDirection: 'row',
    marginLeft: 20,
    gap: 10,
  },
  light: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  screenFrame: {
    width: '100%',
    height: '45%', // Aumentamos la altura un poco
    backgroundColor: '#DEDEDE',
    borderRadius: 20,
    padding: 15,
    borderBottomRightRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraPreview: { width: '100%', height: '100%', borderRadius: 10 },
  placeholderScreen: { width: '100%', height: '100%', borderRadius: 10, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#888', fontSize: 18, fontWeight: '500' },
  scannerOverlay: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  scannerText: { color: '#00FF00', fontSize: 14, fontFamily: 'monospace' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // Quitamos el paddingBottom para que se ajuste con space-around
  },
  customButton: {
    width: '45%',
    paddingVertical: 18,
    borderRadius: 15,
    backgroundColor: '#3D7DCA',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenButton: {
    backgroundColor: '#50AF5D',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333', padding: 20 },
  permissionText: { color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  permissionButton: { backgroundColor: '#EE1515', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  permissionButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});