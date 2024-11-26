import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSupabaseTest } from '../../hooks/useSupabaseTest';

export const TestConnection = () => {
  const { testConnection, isLoading, error, result } = useSupabaseTest();

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste de Conexão Supabase</Text>
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>Testando conexão...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erro na conexão:</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {result && (
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>Conexão estabelecida!</Text>
          <Text style={styles.successText}>
            Versão do PostgreSQL: {result}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0f172a',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: '#dcfce7',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  successTitle: {
    color: '#16a34a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  successText: {
    color: '#22c55e',
    fontSize: 14,
  },
});
