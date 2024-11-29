import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

type Community = {
  id: string;
  name: string;
  description: string | null;
  distance: number; // em km
  created_at: string;
};

export default function DiscoverCommunitiesScreen() {
  const navigation = useNavigation();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState(50);
  const [refreshing, setRefreshing] = useState(false);

  // Simula a busca de comunidades com base na distância
  // TODO: Implementar geolocalização real e cálculo de distância
  const fetchCommunities = async (distance: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Simula distâncias aleatórias para demonstração
      const communitiesWithDistance = (data || []).map(community => ({
        ...community,
        distance: Math.random() * 100, // Distância aleatória entre 0-100km
      }));

      // Filtra por distância
      const filtered = communitiesWithDistance.filter(
        community => community.distance <= distance
      );

      setCommunities(filtered);
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunities(maxDistance);
  }, [maxDistance]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCommunities(maxDistance);
  };

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={styles.communityCard}
      onPress={() => {
        // TODO: Navegar para detalhes da comunidade
        console.log('Navegar para comunidade:', item.id);
      }}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.communityName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.communityDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.distanceBadge}>
          <Ionicons name="location" size={16} color="#007AFF" />
          <Text style={styles.distanceText}>
            {item.distance.toFixed(1)}km
          </Text>
        </View>
      </View>
      
      <Text style={styles.communityDate}>
        Criada em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.distanceLabel}>
        Distância máxima: {maxDistance.toFixed(0)}km
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={100}
        value={maxDistance}
        onValueChange={setMaxDistance}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor="#ddd"
      />
      <Text style={styles.resultsCount}>
        {communities.length} {communities.length === 1 ? 'comunidade encontrada' : 'comunidades encontradas'}
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={48} color="#999" />
      <Text style={styles.emptyText}>
        Nenhuma comunidade encontrada{'\n'}
        neste raio de distância.
      </Text>
      <Text style={styles.emptySubtext}>
        Tente aumentar a distância de busca
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={communities}
          renderItem={renderCommunityItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyList}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  distanceLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    flex: 1,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  communityDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});
