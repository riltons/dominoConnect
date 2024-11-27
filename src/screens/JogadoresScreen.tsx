import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export function JogadoresScreen() {
  // Exemplo de dados - depois vamos integrar com o banco de dados
  const jogadoresExemplo = [
    { id: '1', nome: 'Jogador 1', vitorias: 10, derrotas: 5 },
    { id: '2', nome: 'Jogador 2', vitorias: 8, derrotas: 7 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogadores</Text>
      <FlatList
        data={jogadoresExemplo}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jogador}>
            <Text style={styles.nome}>{item.nome}</Text>
            <View style={styles.stats}>
              <Text style={styles.stat}>Vitórias: {item.vitorias}</Text>
              <Text style={styles.stat}>Derrotas: {item.derrotas}</Text>
            </View>
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
  jogador: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    fontSize: 14,
    color: '#666',
  },
});
