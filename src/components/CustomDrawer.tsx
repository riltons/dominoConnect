import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header do Drawer */}
      <View style={styles.header}>
        <View style={styles.userImageContainer}>
          <View style={styles.userImage}>
            <Text style={styles.userInitials}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
        <Text style={styles.userRole}>{user?.role || 'Jogador'}</Text>
      </View>

      {/* Items do Menu */}
      <DrawerContentScrollView 
        {...props}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.drawerContent}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  userImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitials: {
    fontSize: 32,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  userRole: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  scrollViewContent: {
    paddingTop: 10,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
