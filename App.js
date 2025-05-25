import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import * as SystemUI from 'expo-system-ui';

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

// Pantallas después del login
import HomeAlumno from './src/screens/HomeAlumno';
import Inscripcion from './src/screens/Inscripcion';
import RegistrarAsistenciaAlumno from './src/screens/RegistrarAsistenciaAlumno';
import Settings from './src/screens/Settings';
import CuentaAlumno from './src/screens/CuentaAlumno';
import MateriaAlumno from './src/screens/MateriaAlumno';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function RegistroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IniciodeSesion" component={IniciodeSesion} />
      <Stack.Screen name="Registrate" component={Registrate} />
      <Stack.Screen name="Registrate1" component={Registrate1} />
      <Stack.Screen name="Registrate2" component={Registrate2} />
      <Stack.Screen name="Registrate3" component={Registrate3} />
    </Stack.Navigator>
  );
}

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
          tabBarIcon: ({ focused }) => (
            <Foundation name="home" size={30} color={focused ? theme.primary : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="Inscripcion"
        component={Inscripcion}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="plus" size={28} color={focused ? theme.primary : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="RegistrarAsistencia"
        component={RegistrarAsistenciaAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Octicons name="check-circle-fill" size={28} color={focused ? theme.primary : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name="nut" size={30} color={focused ? theme.primary : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="CuentaAlumno"
        component={CuentaAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="user-large" size={24} color={focused ? theme.primary : 'gray'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { theme, isDarkMode } = useTheme();

  // Cambia barra de navegación inferior (Android)
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDarkMode ? '#1E1E1E' : '#ffffff');
  }, [isDarkMode]);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#1E1E1E' : '#ffffff'}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="Registro" component={RegistroStack} />
        <Stack.Screen name="HomeAlumno" component={HomeTabs} options={{ gestureEnabled: false }} />
        <Stack.Screen name="MateriaAlumno" component={MateriaAlumno} />
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </ThemeProvider>
  );
}
