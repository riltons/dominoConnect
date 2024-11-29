import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

type Player = {
  id: string;
  name: string;
  nickname?: string;
  phone?: string;
  games_played: number;
  games_won: number;
  created_at: string;
};

export default function PlayersScreen() {
  const navigation = useNavigation();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    nickname: '',
    phone: '',
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      setPlayers(data || []);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os jogadores.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayer.name.trim()) {
      Alert.alert('Erro', 'O nome do jogador é obrigatório.');
      return;
    }

    try {
      const { data, error } = await supabase.from('players').insert([
        {
          name: newPlayer.name.trim(),
          nickname: newPlayer.nickname.trim() || null,
          phone: newPlayer.phone.trim() || null,
          games_played: 0,
          games_won: 0,
        },
      ]);

      if (error) throw error;

      setModalVisible(false);
      setNewPlayer({ name: '', nickname: '', phone: '' });
      fetchPlayers();
      Alert.alert('Sucesso', 'Jogador adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o jogador.');
    }
  };

  const filteredPlayers = players.filter(
    player =>
      player.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (player.nickname?.toLowerCase() || '').includes(searchText.toLowerCase())
  );

  const renderPlayerItem = ({ item }: { item: Player }) => (
    <TouchableOpacity style={styles.playerCard}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        {item.nickname && (
          <Text style={styles.playerNickname}>"{item.nickname}"</Text>
        )}
        {item.phone && (
          <View style={styles.phoneContainer}>
            <Ionicons name="call" size={14} color="#666" />
            <Text style={styles.phoneText}>{item.phone}</Text>
          </View>
        )}
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.games_played}</Text>
          <Text style={styles.statLabel}>Jogos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.games_won}</Text>
          <Text style={styles.statLabel}>Vitórias</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {item.games_played > 0
              ? `${((item.games_won / item.games_played) * 100).toFixed(0)}%`
              : '0%'}
          </Text>
          <Text style={styles.statLabel}>Taxa</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={48} color="#999" />
      <Text style={styles.emptyText}>
        Nenhum jogador encontrado{'\n'}
        Adicione jogadores para começar!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar jogador..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredPlayers}
          renderItem={renderPlayerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          onRefresh={fetchPlayers}
          refreshing={refreshing}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Jogador</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do jogador *"
              value={newPlayer.name}
              onChangeText={(text) => setNewPlayer({ ...newPlayer, name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Apelido (opcional)"
              value={newPlayer.nickname}
              onChangeText={(text) => setNewPlayer({ ...newPlayer, nickname: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Telefone (opcional)"
              value={newPlayer.phone}
              onChangeText={(text) => setNewPlayer({ ...newPlayer, phone: text })}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewPlayer({ name: '', nickname: '', phone: '' });
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddPlayer}
              >
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  playerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  playerInfo: {
    marginBottom: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  playerNickname: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
