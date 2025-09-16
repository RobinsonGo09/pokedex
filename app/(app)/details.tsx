import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// ... (Las interfaces y el mapa de colores no cambian)
interface PokemonSpecies { flavor_text_entries: Array<{ flavor_text: string; language: { name: string }; version: { name: string }; }>; }
interface PokemonDetails { id: number; name: string; height: number; weight: number; types: Array<{ type: { name: string } }>; abilities: Array<{ ability: { name: string }; is_hidden: boolean }>; stats: Array<{ base_stat: number; stat: { name: string } }>; sprites: { other: { 'official-artwork': { front_default: string; }; }; }; }
const typeColors: { [key: string]: string } = { normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD', default: '#A8A77A' };
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export default function PokemonDetailsScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const backgroundColor = useSharedValue('#fff');

  useEffect(() => {
    // ... (La lógica de useEffect para cargar datos no cambia)
    if (!name) return;
    const fetchAllDetails = async () => { setLoading(true); try { const detailsResponse = await axios.get<PokemonDetails>(`${POKEAPI_BASE_URL}/pokemon/${name}`); const speciesResponse = await axios.get<PokemonSpecies>(`${POKEAPI_BASE_URL}/pokemon-species/${name}`); setDetails(detailsResponse.data); const spanishEntry = speciesResponse.data.flavor_text_entries.find(entry => entry.language.name === 'es'); setDescription(spanishEntry ? spanishEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'No se encontró descripción.'); const newColor = typeColors[detailsResponse.data.types[0].type.name] || typeColors.default; backgroundColor.value = withTiming(newColor, { duration: 500 }); } catch (error) { console.error("Failed to fetch Pokémon details:", error); setDescription('Error al cargar los datos.'); } finally { setLoading(false); } };
    fetchAllDetails();
  }, [name]);

  const animatedContainerStyle = useAnimatedStyle(() => ({ backgroundColor: backgroundColor.value }));
  const getStatName = (stat: string) => { const names: { [key: string]: string } = { 'hp': 'HP', 'attack': 'Ataque', 'defense': 'Defensa', 'special-attack': 'At. Especial', 'special-defense': 'Def. Especial', 'speed': 'Velocidad' }; return names[stat] || stat; }

  if (loading || !details) {
    return ( <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#333" /><Text>Cargando detalles...</Text></View> );
  }

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- INICIO DEL CAMBIO --- */}
        <View style={styles.header}>
          <View style={styles.nameBadge}>
            <Text style={styles.pokemonName}>{details.name.charAt(0).toUpperCase() + details.name.slice(1)}</Text>
            <Text style={styles.pokemonId}>#{String(details.id).padStart(3, '0')}</Text>
          </View>
        </View>
        {/* --- FIN DEL CAMBIO --- */}

        <Image
          source={{ uri: details.sprites.other['official-artwork'].front_default }}
          style={styles.pokemonImage}
        />

        <View style={styles.infoCard}>
          <Text style={styles.descriptionText}>{description}</Text>
          {/* ... (El resto del contenido de la tarjeta no cambia) ... */}
          <View style={styles.typesContainer}>
            {details.types.map((typeInfo, index) => (
              <View key={index} style={[styles.typeBadge, { backgroundColor: typeColors[typeInfo.type.name] || '#ccc' }]}>
                <Text style={styles.typeText}>{typeInfo.type.name.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          <View style={styles.physicalInfoContainer}>
            <View style={styles.physicalInfoItem}>
              <Text style={styles.physicalInfoLabel}>Altura</Text>
              <Text style={styles.physicalInfoValue}>{details.height / 10} m</Text>
            </View>
            <View style={styles.physicalInfoItem}>
              <Text style={styles.physicalInfoLabel}>Peso</Text>
              <Text style={styles.physicalInfoValue}>{details.weight / 10} kg</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Estadísticas Base</Text>
          {details.stats.map((statInfo, index) => (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statName}>{getStatName(statInfo.stat.name)}</Text>
              <Text style={styles.statValue}>{statInfo.base_stat}</Text>
              <View style={styles.statBarBackground}>
                <View style={[styles.statBar, { width: `${Math.min(statInfo.base_stat / 1.5, 100)}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // ... (otros estilos como container, backButton, etc. no cambian)
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  backButtonText: { color: 'white', marginLeft: 5, fontSize: 16, fontWeight: 'bold' },
  scrollContent: { padding: 20, alignItems: 'center' },

  // --- ESTILOS ACTUALIZADOS ---
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10, // Un poco menos de espacio
  },
  nameBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Fondo oscuro semitransparente
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonName: {
    fontSize: 32, // Un poco más pequeño para que quepa bien
    fontWeight: 'bold',
    color: 'white',
    // Ya no necesitamos la sombra de texto
  },
  pokemonId: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
  },
  // --- FIN DE ESTILOS ACTUALIZADOS ---

  pokemonImage: {
    width: 250,
    height: 250,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 20,
  },
  descriptionText: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  typesContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 10 },
  typeBadge: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  typeText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  physicalInfoContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10 },
  physicalInfoItem: { alignItems: 'center' },
  physicalInfoLabel: { fontSize: 14, color: '#666' },
  physicalInfoValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' },
  statName: { flex: 0.4, fontSize: 14, color: '#666' },
  statValue: { flex: 0.15, fontSize: 14, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  statBarBackground: { flex: 0.45, height: 10, backgroundColor: '#eee', borderRadius: 5, marginLeft: 10 },
  statBar: { height: '100%', backgroundColor: '#888', borderRadius: 5 },
});