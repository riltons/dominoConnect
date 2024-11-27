import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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
    padding: 20,
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingBottom: 10, 
  },
  userImageContainer: {
    marginBottom: 5, 
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitials: {
    fontSize: 28,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2, 
  },
  userRole: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
  },
  scrollViewContent: {
    paddingTop: 0, 
  },
  drawerContent: {
    flex: 1,
  },
});
