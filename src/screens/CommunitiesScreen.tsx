import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

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
  const [maxDistance, setMaxDistance] = useState(50);
  const [expandedSection, setExpandedSection] = useState<'my'|'nearby'|null>(null);

  const CommunityCard = ({ community, showDistance = false }) => (
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
  );

  const filteredNearbyCommunities = nearbyCommunities.filter(
    community => community.distancia <= maxDistance
  );

  const SectionHeader = ({ title, count, isExpanded, onPress }) => (
    <TouchableOpacity 
      style={styles.sectionHeader} 
      onPress={onPress}
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
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.distanceControl}>
        <Text style={styles.distanceLabel}>
          Distância máxima: {maxDistance}km
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={100}
          step={5}
          value={maxDistance}
          onValueChange={setMaxDistance}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007AFF"
          tapToSeek={true}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Minhas Comunidades"
          count={myCommunities.length}
          isExpanded={expandedSection === 'my'}
          onPress={() => setExpandedSection(
            expandedSection === 'my' ? null : 'my'
          )}
        />
        {expandedSection === 'my' && (
          <View>
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
          onPress={() => setExpandedSection(
            expandedSection === 'nearby' ? null : 'nearby'
          )}
        />
        {expandedSection === 'nearby' && (
          <View>
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
  distanceControl: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 10,
  },
  distanceLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
    flexGrow: 0,
    flexShrink: 0,
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
});
