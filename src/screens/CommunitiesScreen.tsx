import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DrawerNavigation'>;

// Dados fictícios para teste
const myCommunities = [
  {
    id: '1',
    nome: 'Dominó Masters',
    membros: 45,
    jogosSemanais: 23,
    mediaJogadores: 4.8,
    distancia: 0, // km
    cidade: 'São Paulo',
    estado: 'SP'
  },
  {
    id: '2',
    nome: 'Dominó Club SP',
    membros: 32,
    jogosSemanais: 18,
    mediaJogadores: 4.5,
    distancia: 0, // km
    cidade: 'São Paulo',
    estado: 'SP'
  },
];

const nearbyCommunities = [
  {
    id: '3',
    nome: 'Dominó Guarulhos',
    membros: 28,
    jogosSemanais: 15,
    mediaJogadores: 4.7,
    distancia: 15, // km
    cidade: 'Guarulhos',
    estado: 'SP'
  },
  {
    id: '4',
    nome: 'Dominó ABC',
    membros: 37,
    jogosSemanais: 20,
    mediaJogadores: 4.6,
    distancia: 25, // km
    cidade: 'Santo André',
    estado: 'SP'
  },
  {
    id: '5',
    nome: 'Dominó Campinas',
    membros: 41,
    jogosSemanais: 25,
    mediaJogadores: 4.9,
    distancia: 90, // km
    cidade: 'Campinas',
    estado: 'SP'
  },
];

export default function CommunitiesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [maxDistance, setMaxDistance] = useState(50);
  const sliderValueRef = useRef(50);
  const [expandedSection, setExpandedSection] = useState<'my'|'nearby'|null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtrar comunidades usando useMemo para melhor performance
  const filteredNearbyCommunities = useMemo(() => 
    nearbyCommunities.filter(
      community => community.distancia <= maxDistance
    ),
    [maxDistance]
  );

  // Handler otimizado para o slider com debounce usando ref
  const handleSliderChange = useCallback((value: number) => {
    const roundedValue = Math.round(value);
    sliderValueRef.current = roundedValue;

    // Limpa o timer anterior se existir
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Cria um novo timer
    debounceTimerRef.current = setTimeout(() => {
      setMaxDistance(roundedValue);
      debounceTimerRef.current = null;
    }, 50); // Reduzido para 50ms para melhor responsividade
  }, []);

  // Limpa o timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handler otimizado para expandir/colapsar seções
  const toggleSection = useCallback((section: 'my' | 'nearby') => {
    setExpandedSection(current => current === section ? null : section);
  }, []);

  const CommunityCard = useCallback(({ community, showDistance = false }) => (
    <View style={styles.communityCard}>
      <View style={styles.communityHeader}>
        <View>
          <Text style={styles.communityName}>{community.nome}</Text>
          <Text style={styles.communityLocation}>
            {community.cidade}, {community.estado}
          </Text>
        </View>
        {showDistance && (
          <Text style={styles.distanceBadge}>
            {community.distancia}km
          </Text>
        )}
      </View>
      
      <View style={styles.communityStats}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={20} color="#666" />
          <Text style={styles.statValue}>{community.membros}</Text>
          <Text style={styles.statLabel}>Membros</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="game-controller-outline" size={20} color="#666" />
          <Text style={styles.statValue}>{community.jogosSemanais}</Text>
          <Text style={styles.statLabel}>Jogos/Sem</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="star-outline" size={20} color="#666" />
          <Text style={styles.statValue}>{community.mediaJogadores}</Text>
          <Text style={styles.statLabel}>Média</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Participar</Text>
      </TouchableOpacity>
    </View>
  ), []);

  const SectionHeader = useCallback(({ title, count, isExpanded, onPress }) => (
    <TouchableOpacity 
      style={[
        styles.sectionHeader,
        isExpanded && styles.sectionHeaderExpanded
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.communityCount}>({count})</Text>
      </View>
      <Ionicons 
        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
        size={24} 
        color="#333"
      />
    </TouchableOpacity>
  ), []);

  return (
    <ScrollView style={styles.container} scrollEventThrottle={16}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comunidades</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateCommunity')}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Nova Comunidade</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.distanceControl}>
        <Text style={styles.distanceLabel}>
          Distância máxima: {sliderValueRef.current}km
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={100}
          step={5}
          value={maxDistance}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007AFF"
          tapToSeek={false}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Minhas Comunidades"
          count={myCommunities.length}
          isExpanded={expandedSection === 'my'}
          onPress={() => toggleSection('my')}
        />
        {expandedSection === 'my' && (
          <View style={styles.cardContainer}>
            {myCommunities.map(community => (
              <CommunityCard 
                key={community.id} 
                community={community}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Comunidades Próximas"
          count={filteredNearbyCommunities.length}
          isExpanded={expandedSection === 'nearby'}
          onPress={() => toggleSection('nearby')}
        />
        {expandedSection === 'nearby' && (
          <View style={styles.cardContainer}>
            {filteredNearbyCommunities.map(community => (
              <CommunityCard 
                key={community.id} 
                community={community}
                showDistance
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  distanceControl: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  distanceLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionHeaderExpanded: {
    backgroundColor: '#f0f0f0',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  communityCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  communityCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  communityLocation: {
    fontSize: 14,
    color: '#666',
  },
  distanceBadge: {
    backgroundColor: '#007AFF',
    color: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginTop: 8,
  },
});
