import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Dados fictícios para o dashboard
const userStats = {
  jogos: {
    ganhos: 45,
    perdidos: 23,
    total: 68,
    winRate: '66%'
  },
  partidas: {
    ganhas: 156,
    perdidas: 89,
    total: 245,
    winRate: '64%'
  },
  pontuacao: {
    media: 157,
    melhor: 235,
    pior: 45
  }
};

// Dados fictícios dos melhores jogadores
const topPlayers = [
  { nome: 'João Silva', vitorias: 245, pontuacaoMedia: 178, winRate: '72%' },
  { nome: 'Maria Santos', vitorias: 198, pontuacaoMedia: 165, winRate: '68%' },
  { nome: 'Pedro Oliveira', vitorias: 187, pontuacaoMedia: 159, winRate: '65%' },
];

type Community = {
  id: string;
  name: string;
  description: string | null;
  whatsapp_group_id: string | null;
  created_at: string;
  created_by: string;
  members_count?: number;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  useEffect(() => {
    fetchUserCommunities();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserCommunities();
    });

    return unsubscribe;
  }, []);

  const fetchUserCommunities = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Adiciona um contador fictício de membros por enquanto
      const communitiesWithMembers = (data || []).map(community => ({
        ...community,
        members_count: Math.floor(Math.random() * 50) + 5, // 5-55 membros
      }));

      setCommunities(communitiesWithMembers);
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
    } finally {
      setLoadingCommunities(false);
    }
  };

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const PlayerCard = ({ player, index }: { player: typeof topPlayers[0]; index: number }) => (
    <View style={styles.playerCard}>
      <View style={styles.playerRank}>
        <Text style={styles.playerRankText}>#{index + 1}</Text>
      </View>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.nome}</Text>
        <View style={styles.playerStats}>
          <Text style={styles.playerStatText}>Vitórias: {player.vitorias}</Text>
          <Text style={styles.playerStatText}>Média: {player.pontuacaoMedia}</Text>
          <Text style={styles.playerStatText}>Taxa: {player.winRate}</Text>
        </View>
      </View>
    </View>
  );

  const CommunityCard = ({ community }: { community: Community }) => (
    <TouchableOpacity 
      style={styles.communityCard}
      onPress={() => {
        // TODO: Navegar para detalhes da comunidade
        console.log('Navegar para comunidade:', community.id);
      }}
    >
      <Text style={styles.communityName}>{community.name}</Text>
      {community.description && (
        <Text style={styles.communityDescription} numberOfLines={2}>
          {community.description}
        </Text>
      )}
      <View style={styles.communityStats}>
        <View style={styles.communityStat}>
          <Ionicons name="people" size={16} color="#007AFF" />
          <Text style={styles.communityStatValue}>{community.members_count}</Text>
          <Text style={styles.communityStatLabel}>Membros</Text>
        </View>
        {community.whatsapp_group_id && (
          <View style={styles.communityStat}>
            <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
            <Text style={styles.communityStatLabel}>Grupo</Text>
          </View>
        )}
        <View style={styles.communityStat}>
          <Text style={styles.communityDate}>
            {new Date(community.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
          <View style={styles.statsGrid}>
            <StatCard title="Jogos Ganhos" value={userStats.jogos.ganhos} subtitle={`de ${userStats.jogos.total}`} />
            <StatCard title="Win Rate Jogos" value={userStats.jogos.winRate} />
            <StatCard title="Partidas Ganhas" value={userStats.partidas.ganhas} subtitle={`de ${userStats.partidas.total}`} />
            <StatCard title="Win Rate Partidas" value={userStats.partidas.winRate} />
            <StatCard title="Pontuação Média" value={userStats.pontuacao.media} />
            <StatCard title="Melhor Pontuação" value={userStats.pontuacao.melhor} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Comunidades</Text>
          {loadingCommunities ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
          ) : communities.length > 0 ? (
            <FlatList
              horizontal
              data={communities}
              renderItem={({ item }) => <CommunityCard community={item} />}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.communitiesContainer}
            />
          ) : (
            <View style={styles.emptyCommunities}>
              <Ionicons name="people-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>
                Você ainda não criou nenhuma comunidade
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.newCommunityButton}
            onPress={() => navigation.navigate('CreateCommunity' as never)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.newCommunityButtonText}>Nova Comunidade</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Melhores Jogadores</Text>
          {topPlayers.map((player, index) => (
            <PlayerCard key={player.nome} player={player} index={index} />
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Nova Partida</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Jogadores</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');
const statCardWidth = (width - 60) / 2;
const communityCardWidth = width * 0.75;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  menuSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  loader: {
    marginVertical: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: statCardWidth,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  playerCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  playerRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playerRankText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerStatText: {
    fontSize: 12,
    color: '#666',
  },
  communitiesContainer: {
    paddingRight: 20,
  },
  communityCard: {
    width: communityCardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 4,
    marginRight: 4,
  },
  communityStatLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  communityDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyCommunities: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  newCommunityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  newCommunityButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  menuItem: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
