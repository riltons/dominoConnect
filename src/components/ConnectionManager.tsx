import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { networkService } from '../services/network';

export const ConnectionManager: React.FC = () => {
  const [isHost, setIsHost] = useState(false);
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    initializeNetwork();
  }, []);

  const initializeNetwork = async () => {
    await networkService.initialize();
  };

  const startHosting = async () => {
    setStatus('connecting');
    await networkService.startServer();
    setIsHost(true);
    setStatus('connected');
  };

  const connectToPeer = async (peerAddress: string) => {
    setStatus('connecting');
    const success = await networkService.connectToPeer(peerAddress);
    if (success) {
      setConnectedPeers(networkService.getConnectedPeers());
      setStatus('connected');
    } else {
      setStatus('disconnected');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conexão Local</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {status}
        </Text>
      </View>

      {!isHost && status !== 'connected' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={startHosting}
          >
            <Text style={styles.buttonText}>Criar Sala</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => connectToPeer('192.168.1.1')} // Exemplo
          >
            <Text style={styles.buttonText}>Conectar a uma Sala</Text>
          </TouchableOpacity>
        </View>
      )}

      {connectedPeers.length > 0 && (
        <View style={styles.peersContainer}>
          <Text style={styles.subtitle}>Jogadores Conectados:</Text>
          {connectedPeers.map((peer, index) => (
            <Text key={index} style={styles.peerText}>{peer}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  peersContainer: {
    marginTop: 20,
  },
  peerText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
