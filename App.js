import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IniciodeSesion from './src/screens/IniciodeSesion';
import Registrate from './src/screens/Registrate';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="IniciodeSesion" component={IniciodeSesion} />
        <Stack.Screen name="Registrate" component={Registrate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
