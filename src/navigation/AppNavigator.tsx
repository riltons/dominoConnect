import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CommunitiesScreen from '../screens/CommunitiesScreen';
import CreateCommunityScreen from '../screens/CreateCommunityScreen';
import DiscoverCommunitiesScreen from '../screens/DiscoverCommunitiesScreen';
import PlayersScreen from '../screens/PlayersScreen';
import CommunityDetailsScreen from '../screens/CommunityDetailsScreen';
import CustomDrawer from '../components/CustomDrawer';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  DrawerNavigation: undefined;
  CreateCommunity: undefined;
};

export type DrawerParamList = {
  Home: undefined;
  Communities: undefined;
  DiscoverCommunities: undefined;
  Players: undefined;
  CommunityDetails: { communityId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
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
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Communities"
        component={CommunitiesScreen}
        options={{
          title: 'Minhas Comunidades',
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'people' : 'people-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Drawer.Screen
        name="DiscoverCommunities"
        component={DiscoverCommunitiesScreen}
        options={{
          title: 'Descobrir Comunidades',
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Players"
        component={PlayersScreen}
        options={{
          title: 'Jogadores',
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Drawer.Screen
        name="CommunityDetails"
        component={CommunityDetailsScreen}
        options={({ navigation }) => ({
          title: 'Detalhes da Comunidade',
          drawerItemStyle: { display: 'none' },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 16 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' },
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigator} />
            <Stack.Screen
              name="CreateCommunity"
              component={CreateCommunityScreen}
              options={{
                headerShown: true,
                title: 'Nova Comunidade',
                headerTitleAlign: 'center',
                headerBackTitle: 'Voltar',
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
