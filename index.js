import { registerRootComponent } from 'expo';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

// Registra o componente principal para web e native
if (Platform.OS === 'web') {
  AppRegistry.registerComponent('main', () => App);
  AppRegistry.runApplication('main', {
    initialProps: {},
    rootTag: document.getElementById('root')
  });
} else {
  registerRootComponent(App);
}
