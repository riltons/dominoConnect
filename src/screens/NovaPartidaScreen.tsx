import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NovaPartidaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Partida</Text>
      {/* Aqui vamos adicionar o formulário para nova partida */}
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
});
