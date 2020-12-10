import { registerRootComponent } from 'expo';

import App from './App';
import {LogBox} from "react-native";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
console.disableYellowBox = true;
LogBox.ignoreAllLogs()
