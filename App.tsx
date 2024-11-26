import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { TestConnection } from './src/components/screens/TestConnection';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TestConnection />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
