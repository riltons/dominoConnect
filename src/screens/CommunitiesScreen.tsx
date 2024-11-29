import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

type Community = {
  id: string;
  name: string;
  description: string | null;
  whatsapp_group_id: string | null;
  created_at: string;
  created_by: string;
  member_count: number;
  creator_email: string;
};

export default function CommunitiesScreen() {
  const navigation = useNavigation();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunities = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('Usuário não autenticado');
        return;
      }

      let { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          member_count:player_communities(count)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to get the count value and add creator email
      const transformedData = data?.map(community => ({
        ...community,
        member_count: community.member_count[0]?.count || 0,
        creator_email: user.email || 'Email não disponível'
      })) || [];

      setCommunities(transformedData);
    } catch (error) {
      console.error('Erro ao buscar comunidades:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunities();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchCommunities();
    });

    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommunities();
  };

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={styles.communityCard}
      onPress={() => navigation.navigate('CommunityDetails', { communityId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.communityName}>{item.name}</Text>
      </View>
      {item.description && (
        <Text style={styles.communityDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.creatorInfo}>
          <Ionicons name="person" size={16} color="#666" />
          <Text style={styles.creatorText}>
            Criado por: {item.creator_email}
          </Text>
        </View>
        <View style={styles.memberInfo}>
          <Ionicons name="people" size={16} color="#007AFF" />
          <Text style={styles.memberCount}>
            {item.member_count} {item.member_count === 1 ? 'membro' : 'membros'}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.communityDate}>
          Criada em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
        </Text>
        {item.whatsapp_group_id && (
          <TouchableOpacity style={styles.whatsappButton}>
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={communities}
        renderItem={renderCommunityItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 12,
  },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 8,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoContainer: {
    marginBottom: 12,
    gap: 8,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creatorText: {
    fontSize: 14,
    color: '#666',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberCount: {
    fontSize: 14,
    color: '#007AFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  communityDate: {
    fontSize: 12,
    color: '#999',
  },
  whatsappButton: {
    padding: 4,
  },
});
