import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Competition = {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  created_at: string;
};

type CommunityDetails = {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  member_count: number;
  competitions?: Competition[];
};

export default function CommunityDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { communityId } = route.params as { communityId: string };

  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunityDetails = async () => {
    try {
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('*, competitions(*)')
        .eq('id', communityId)
        .single();

      if (communityError) throw communityError;

      // Buscar contagem de membros
      const { count: memberCount, error: countError } = await supabase
        .from('player_communities')
        .select('*', { count: 'exact' })
        .eq('community_id', communityId);

      if (countError) throw countError;

      setCommunity({
        ...communityData,
        member_count: memberCount || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes da comunidade:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da comunidade.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunityDetails();
  }, [communityId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCommunityDetails();
  };

  const handleAddParticipant = () => {
    // Navegar para a tela de adicionar participante
    navigation.navigate('AddParticipant', { communityId });
  };

  const handleCreateCompetition = () => {
    // Navegar para a tela de criar competição
    navigation.navigate('CreateCompetition', { communityId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Comunidade não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Cabeçalho da Comunidade */}
      <View style={styles.header}>
        <Text style={styles.communityName}>{community.name}</Text>
        <Text style={styles.description}>{community.description}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={24} color="#666" />
            <Text style={styles.statValue}>{community.member_count}</Text>
            <Text style={styles.statLabel}>Participantes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color="#666" />
            <Text style={styles.statValue}>
              {community.competitions?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Competições</Text>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.addParticipantButton]}
          onPress={handleAddParticipant}
        >
          <Ionicons name="person-add" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Adicionar Participante</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.createCompetitionButton]}
          onPress={handleCreateCompetition}
        >
          <Ionicons name="trophy" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Nova Competição</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Competições */}
      <View style={styles.competitionsSection}>
        <Text style={styles.sectionTitle}>Competições</Text>
        {community.competitions && community.competitions.length > 0 ? (
          community.competitions.map((competition) => (
            <TouchableOpacity
              key={competition.id}
              style={styles.competitionCard}
              onPress={() =>
                navigation.navigate('CompetitionDetails', {
                  competitionId: competition.id,
                })
              }
            >
              <View style={styles.competitionHeader}>
                <Text style={styles.competitionName}>{competition.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    styles[`status_${competition.status}`],
                  ]}
                >
                  <Text style={styles.statusText}>
                    {competition.status === 'upcoming'
                      ? 'Em Breve'
                      : competition.status === 'in_progress'
                      ? 'Em Andamento'
                      : 'Concluído'}
                  </Text>
                </View>
              </View>
              {competition.description && (
                <Text style={styles.competitionDescription}>
                  {competition.description}
                </Text>
              )}
              <Text style={styles.competitionDate}>
                Início: {new Date(competition.start_date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyCompetitions}>
            <Ionicons name="trophy-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>
              Nenhuma competição criada ainda
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  communityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addParticipantButton: {
    backgroundColor: '#007AFF',
  },
  createCompetitionButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  competitionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  competitionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  competitionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  competitionName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  status_upcoming: {
    backgroundColor: '#FFE58F',
  },
  status_in_progress: {
    backgroundColor: '#91D5FF',
  },
  status_completed: {
    backgroundColor: '#B7EB8F',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  competitionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  competitionDate: {
    fontSize: 14,
    color: '#999',
  },
  emptyCompetitions: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
});
