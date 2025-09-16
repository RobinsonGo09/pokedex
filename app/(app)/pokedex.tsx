import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// ... (El resto del código que no cambia: interfaces, typeColors, etc.)
interface PokemonDetails { id: number; name: string; types: Array<{ type: { name:string } }>; sprites: { other: { 'official-artwork': { front_default: string; }; }; }; }
const typeColors: { [key: string]: string } = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#78C850', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD', default: '#68A090' };
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';


export default function PokedexViewerScreen() {
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState<{ name: string; url: string }[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<PokemonDetails | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const backgroundColor = useSharedValue(typeColors.default);

  // ... (Toda la lógica de useEffect y las funciones handle no cambia)
  useEffect(() => { const fetchInitialList = async () => { const response = await axios.get(`${POKEAPI_BASE_URL}?limit=151`); setPokemonList(response.data.results); }; fetchInitialList(); }, []);
  useEffect(() => { if (pokemonList.length > 0) { setLoading(true); const fetchDetails = async () => { try { const response = await axios.get<PokemonDetails>(`${POKEAPI_BASE_URL}/${pokemonList[currentIndex].name}`); setCurrentPokemon(response.data); const newColor = typeColors[response.data.types[0].type.name] || typeColors.default; backgroundColor.value = withTiming(newColor, { duration: 500 }); } catch (error) { console.error(`Error fetching details:`, error); } finally { setLoading(false); } }; fetchDetails(); } }, [currentIndex, pokemonList]);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % pokemonList.length);
  const handlePrevious = () => setCurrentIndex((prev) => (prev - 1 + pokemonList.length) % pokemonList.length);
  const handleSearch = () => { if (!searchText) return; const term = searchText.toLowerCase().trim(); const foundIndex = pokemonList.findIndex(p => p.name === term || (pokemonList.indexOf(p) + 1).toString() === term); if (foundIndex !== -1) { setCurrentIndex(foundIndex); } else { alert('Pokémon no encontrado'); } setSearchText(''); };
  const handleViewDetails = () => { if (currentPokemon) { router.push({ pathname: '/details', params: { name: currentPokemon.name } }); } };
  const animatedScreenStyle = useAnimatedStyle(() => ({ backgroundColor: backgroundColor.value }));

  return (
    <View style={styles.pokedexContainer}>
      {/* --- INICIO DE LA SECCIÓN CORREGIDA --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.blueCircle} />
          <View style={styles.smallLight} />
          <View style={styles.smallLight} />
          <View style={styles.smallLight} />
        </View>

        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.push('/')}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {/* --- FIN DE LA SECCIÓN CORREGIDA --- */}
      
      {/* El resto del JSX no cambia */}
      <View style={styles.screenSection}>
         {/* ... (código de la pantalla del pokémon) ... */}
         <Animated.View style={[styles.screenFrame, animatedScreenStyle]}>
          {loading || !currentPokemon ? ( <ActivityIndicator color="#fff" /> ) : (
            <>
              <Image source={{ uri: currentPokemon.sprites.other['official-artwork'].front_default }} style={styles.pokemonImage} />
              <View style={styles.screenInfo}>
                <Text style={styles.pokemonNumber}>N°{String(currentPokemon.id).padStart(3, '0')}</Text>
                <Text style={styles.pokemonName}>{currentPokemon.name.charAt(0).toUpperCase() + currentPokemon.name.slice(1)}</Text>
              </View>
            </>
          )}
        </Animated.View>
        <TextInput style={styles.searchInput} placeholder="Name or Number" value={searchText} onChangeText={setSearchText} onSubmitEditing={handleSearch} placeholderTextColor="#777"/>
      </View>

      <View style={styles.controlsSection}>
        {/* ... (código de los botones de control) ... */}
        <TouchableOpacity style={styles.controlButton} onPress={handlePrevious}><Text style={styles.controlButtonText}>{'< Anterior'}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}><Text style={styles.detailsButtonText}>Detalles</Text></TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={handleNext}><Text style={styles.controlButtonText}>{'Próximo >'}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pokedexContainer: { flex: 1, backgroundColor: '#D92323', padding: 15 },
  // --- ESTILOS CORREGIDOS Y RESTAURADOS ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Pone un grupo de elementos a la izquierda y otro a la derecha
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blueCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#2A97DD', 
    borderWidth: 4, 
    borderColor: '#fff', 
    marginRight: 15 
  },
  smallLight: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#D92323', 
    borderWidth: 2, 
    borderColor: '#6D1212', 
    marginHorizontal: 5 
  },
  closeButton: {
    // Ya no es 'absolute', se alinea con flexbox
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  // --- FIN DE LOS CAMBIOS ---
  screenSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  screenFrame: { width: '90%', flex: 1, maxHeight: 400, backgroundColor: '#68A090', borderRadius: 10, borderWidth: 15, borderColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  pokemonImage: { width: 200, height: 200, resizeMode: 'contain' },
  screenInfo: { backgroundColor: '#D3D3D3', width: '100%', padding: 5, alignItems: 'center', position: 'absolute', bottom: 0 },
  pokemonNumber: { fontSize: 16, color: '#333' },
  pokemonName: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  searchInput: { backgroundColor: '#fff', width: '90%', padding: 10, borderRadius: 5, textAlign: 'center', fontSize: 16 },
  controlsSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, width: '100%' },
  controlButton: { backgroundColor: '#333', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  controlButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  detailsButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2A97DD', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 },
  detailsButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});