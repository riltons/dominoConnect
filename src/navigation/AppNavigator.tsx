import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';
import CustomDrawer from '../components/CustomDrawer';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  DrawerNavigation: undefined;
  CreateCommunity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  const { signOut } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveBackgroundColor: '#007AFF',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: 5,
          fontSize: 16,
          fontWeight: '500',
        },
        drawerItemStyle: {
          paddingVertical: 2.5,
          marginVertical: 2.5,
        },
        drawerIcon: {
          size: 24,
        },
        headerRight: () => (
          <TouchableOpacity 
            onPress={signOut}
            style={{ marginRight: 15 }}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="Início"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Comunidades"
        component={CommunitiesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Histórico"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="time-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Jogadores"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen 
              name="CreateCommunity" 
              component={CreateCommunityScreen}
              options={{
                headerShown: true,
                title: 'Nova Comunidade',
                headerStyle: {
                  backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
