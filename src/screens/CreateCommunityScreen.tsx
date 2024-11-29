import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useNavigation } from '@react-navigation/native';

export default function CreateCommunityScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cidade: '',
    estado: '',
    bairro: '',
    jogosSemanais: '',
    mediaJogadores: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!formData.nome || !formData.cidade || !formData.estado) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('communities')
        .insert([
          {
            nome: formData.nome,
            descricao: formData.descricao,
            cidade: formData.cidade,
            estado: formData.estado,
            bairro: formData.bairro,
            jogos_semanais: parseInt(formData.jogosSemanais) || 0,
            media_jogadores: parseInt(formData.mediaJogadores) || 0,
            criador_id: userData.user.id,
          },
        ]);

      if (error) throw error;

      Alert.alert('Sucesso', 'Comunidade criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a comunidade. Tente novamente.');
      console.error('Erro ao criar comunidade:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Comunidade*</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(value) => handleInputChange('nome', value)}
              placeholder="Digite o nome da comunidade"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(value) => handleInputChange('descricao', value)}
              placeholder="Descreva sua comunidade"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 2 }]}>
              <Text style={styles.label}>Cidade*</Text>
              <TextInput
                style={styles.input}
                value={formData.cidade}
                onChangeText={(value) => handleInputChange('cidade', value)}
                placeholder="Cidade"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Estado*</Text>
              <TextInput
                style={styles.input}
                value={formData.estado}
                onChangeText={(value) => handleInputChange('estado', value)}
                placeholder="UF"
                placeholderTextColor="#999"
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={styles.input}
              value={formData.bairro}
              onChangeText={(value) => handleInputChange('bairro', value)}
              placeholder="Digite o bairro"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Jogos Semanais</Text>
              <TextInput
                style={styles.input}
                value={formData.jogosSemanais}
                onChangeText={(value) => handleInputChange('jogosSemanais', value)}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Média de Jogadores</Text>
              <TextInput
                style={styles.input}
                value={formData.mediaJogadores}
                onChangeText={(value) => handleInputChange('mediaJogadores', value)}
                placeholder="0"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Criando...' : 'Criar Comunidade'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#999',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
