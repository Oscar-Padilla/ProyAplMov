import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Pantallas del registro
import IniciodeSesion from './src/screens/IniciodeSesion';
import Registrate from './src/screens/Registrate';
import Registrate1 from './src/screens/Registrate1';
import Registrate2 from './src/screens/Registrate2';
import Registrate3 from './src/screens/Registrate3';

// Pantallas del TabNavigator (después de login)
import HomeAlumno from './src/screens/HomeAlumno';
import Inscripcion from './src/screens/Inscripcion';
import RegistrarAsistenciaAlumno from './src/screens/RegistrarAsistenciaAlumno';
import Settings from './src/screens/Settings';
import CuentaAlumno from './src/screens/CuentaAlumno';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de registro
function RegistroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IniciodeSesion" component={IniciodeSesion} options={{ animation: 'slide_from_left' }} />
      <Stack.Screen name="Registrate" component={Registrate} options={{ animation: 'fade' }} />
      <Stack.Screen name="Registrate1" component={Registrate1} options={{ animation: 'fade', animationTypeForReplace: 'pop' }} />
      <Stack.Screen name="Registrate2" component={Registrate2} options={{ animation: 'fade', animationTypeForReplace: 'pop' }} />
      <Stack.Screen name="Registrate3" component={Registrate3} options={{ animation: 'fade', animationTypeForReplace: 'pop' }} />
    </Stack.Navigator>
  );
}

// Tab de Home
function HomeTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.card },
      }}
    >
      <Tab.Screen
        name="HomeAlumnoTabs"
        component={HomeAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? theme.primary : 'gray';
            return <Foundation name="home" size={30} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="Inscripcion"
        component={Inscripcion}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? theme.primary : 'gray';
            return <FontAwesome5 name="plus" size={28} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="RegistrarAsistencia"
        component={RegistrarAsistenciaAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? theme.primary : 'gray';
            return <Octicons name="check-circle-fill" size={28} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? theme.primary : 'gray';
            return <MaterialCommunityIcons name="nut" size={30} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="CuentaAlumno"
        component={CuentaAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? theme.primary : 'gray';
            return <FontAwesome6 name="user-large" size={24} color={iconColor} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

// App principal
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="Registro" component={RegistroStack} />
      <Stack.Screen name="HomeAlumno" component={HomeTabs} options={{ animation: 'slide_from_right', gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
