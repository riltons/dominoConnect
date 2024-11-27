import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

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

export default function HomeScreen() {
  const { user, signOut } = useAuth();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DominoConnect</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>{user?.role}</Text>
        </View>
      </View>

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

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');
const statCardWidth = (width - 60) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  userInfo: {
    marginTop: 5,
  },
  userName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  userRole: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
  logoutButton: {
    margin: 20,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
