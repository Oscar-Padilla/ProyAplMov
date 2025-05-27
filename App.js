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
import { UserProvider, useUser } from './src/context/UserContext'; // ✅ Contexto de usuario

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
import EventoAlumno from './src/screens/EventoAlumno';

// Pantallas maestro
import HomeMaestro from './src/screens/HomeMaestro';
import CuentaMaestro from './src/screens/CuentaMaestro';
import CreacionMaestro from './src/screens/CreacionMaestro';
import MateriaMaestro from './src/screens/MateriaMaestro';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack que contiene la pantalla de inicio de sesión
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

function HomeAlumnoStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAlumno" component={HomeAlumno} />
      <Stack.Screen name="MateriaAlumno" component={MateriaAlumno} />
      <Stack.Screen name="EventoAlumno" component={EventoAlumno} />
    </Stack.Navigator>
  );
}

function HomeMaestroStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMaestro" component={HomeMaestro} />
      <Stack.Screen name="MateriaMaestro" component={MateriaMaestro} />
    </Stack.Navigator>
  );
}

function CuentaAlumnoStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CuentaAlumno" component={CuentaAlumno} />
      <Stack.Screen name="MateriaAlumno" component={MateriaAlumno} />
      <Stack.Screen name="EventoAlumno" component={EventoAlumno} />
    </Stack.Navigator>
  );
}

function CuentaMaestroStack() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CuentaMaestro" component={CuentaMaestro} />
      <Stack.Screen name="MateriaMaestro" component={MateriaMaestro} />
    </Stack.Navigator>
  );
}

// Pantallas Alumno
function HomeAlumnoTabs() {
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
        component={HomeAlumnoStack}
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
        name="CuentaAlumnoTabs"
        component={CuentaAlumnoStack}
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

// Pantallas Maestro
function HomeMaestroTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.card },
      }}
    >
      <Tab.Screen
        name="HomeMaestroTabs"
        component={HomeMaestroStack}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <Foundation name="home" size={30} color={focused ? theme.primary : 'gray'} />
          ),
        }}
      />
      <Tab.Screen
        name="CreacionMaestro"
        component={CreacionMaestro}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="plus" size={28} color={focused ? theme.primary : 'gray'} />
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
        name="CuentaMaestroTabs"
        component={CuentaMaestroStack}
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

// Contenido principal de la app, según si hay sesión o no
function AppContent() {
  const { theme, isDarkMode } = useTheme();
  const { usuario, loading } = useUser();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(isDarkMode ? '#1E1E1E' : '#ffffff');
  }, [isDarkMode]);

  if (loading) {
    return null; // o un splash screen
  }

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
        {usuario ? (
          usuario.rol === 'Profesor' ? (
            <Stack.Screen name="HomeMaestro" component={HomeMaestroTabs} options={{ gestureEnabled: false }} />
          ) : (
            <Stack.Screen name="HomeAlumno" component={HomeAlumnoTabs} options={{ gestureEnabled: false }} />
          )
        ) : (
          <Stack.Screen name="Registro" component={RegistroStack} />
        )}

      </Stack.Navigator>
    </>
  );
}

// App principal con todos los proveedores
export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </UserProvider>
    </ThemeProvider>
  );
}
