import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export function HistoricoScreen() {
  // Exemplo de dados - depois vamos integrar com o banco de dados
  const historicoExemplo = [
    { id: '1', data: '27/02/2024', vencedor: 'Time A', placar: '6 x 4' },
    { id: '2', data: '26/02/2024', vencedor: 'Time B', placar: '6 x 2' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Partidas</Text>
      <FlatList
        data={historicoExemplo}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.partida}>
            <Text style={styles.data}>{item.data}</Text>
            <Text style={styles.info}>Vencedor: {item.vencedor}</Text>
            <Text style={styles.info}>Placar: {item.placar}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  partida: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  data: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
});
