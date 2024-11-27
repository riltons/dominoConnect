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
        <View style={[
          styles.resultContainer,
          result.success ? styles.successContainer : styles.errorContainer
        ]}>
          <Text style={[
            styles.resultText,
            result.success ? styles.successText : styles.errorText
          ]}>
            {result.message}
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
    backgroundColor: '#fff',
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
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  resultContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  successContainer: {
    backgroundColor: '#dcfce7',
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#16a34a',
  },
});
