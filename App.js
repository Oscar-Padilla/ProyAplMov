import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import IniciodeSesion from './src/screens/IniciodeSesion';
import Registrate from './src/screens/Registrate';
import Registrate1 from './src/screens/Registrate1';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer >
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: "white" } }}>
        <Stack.Screen name="IniciodeSesion" component={IniciodeSesion} options={{animation: 'slide_from_left'}}/>
        <Stack.Screen name="Registrate" component={Registrate} options={{animation: 'fade'}}/>
        <Stack.Screen name="Registrate1" component={Registrate1} options={{animation: 'fade', animationTypeForReplace:'pop'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
