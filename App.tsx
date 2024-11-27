import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { NovaPartidaScreen } from './src/screens/NovaPartidaScreen';
import { HistoricoScreen } from './src/screens/HistoricoScreen';
import { JogadoresScreen } from './src/screens/JogadoresScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        // Rotas autenticadas
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'DominoConnect' }}
          />
          <Stack.Screen 
            name="NovaPartida" 
            component={NovaPartidaScreen} 
            options={{ title: 'Nova Partida' }}
          />
          <Stack.Screen 
            name="Historico" 
            component={HistoricoScreen} 
            options={{ title: 'Histórico' }}
          />
          <Stack.Screen 
            name="Jogadores" 
            component={JogadoresScreen} 
            options={{ title: 'Jogadores' }}
          />
        </>
      ) : (
        // Rotas não autenticadas
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigation />
        <StatusBar style="light" />
      </AuthProvider>
    </NavigationContainer>
  );
}
