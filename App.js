import React from 'react';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// Pantallas del registro
import IniciodeSesion from './src/screens/IniciodeSesion';
import Registrate from './src/screens/Registrate';
import Registrate1 from './src/screens/Registrate1';
import Registrate2 from './src/screens/Registrate2';
import Registrate3 from './src/screens/Registrate3';

// Pantallas del TabNavigator (después de login)
import HomeAlumno from './src/screens/HomeAlumno';
import InscripcionAlumnoMateria from './src/screens/InscripcionAlumnoMateria';
import RegistrarAsistenciaAlumno from './src/screens/RegistrarAsistenciaAlumno';
import Settings from './src/screens/Settings';
import CuentaAlumno from './src/screens/CuentaAlumno';

// Creación de los navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack para las pantallas de registro
function RegistroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'white' } }}>
      <Stack.Screen name="IniciodeSesion" component={IniciodeSesion} options={{ animation: 'slide_from_left' }} />
      <Stack.Screen name="Registrate" component={Registrate} options={{ animation: 'fade' }} />
      <Stack.Screen name="Registrate1" component={Registrate1} options={{ animation: 'fade', animationTypeForReplace: 'pop' }} />
      <Stack.Screen name="Registrate2" component={Registrate2} options={{ animation: 'fade', animationTypeForReplace: 'pop' }} />
      <Stack.Screen name="Registrate3" component={Registrate3} options={{ animation: 'fade', animationTypeForReplace: 'pop' }} />
    </Stack.Navigator>
  );
}

// TabNavigator para las pantallas del HomeAlumno
function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'white' } }}>
      <Tab.Screen
        name="HomeAlumno"
        component={HomeAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused}) => {
            const iconColor = focused ? 'black' : 'gray';
            return <Foundation name="home" size={30} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen 
        name="InscripcionAlumnoMateria" 
        component={InscripcionAlumnoMateria}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? 'black' : 'gray';
            return <FontAwesome5 name="plus" size={28} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="RegistrarAsistenciaAlumno" 
        component={RegistrarAsistenciaAlumno}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? '#49225B' : 'gray';
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
            const iconColor = focused ? 'black' : 'gray';
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
            const iconColor = focused ? 'black' : 'gray';
            return <FontAwesome6 name="user-large" size={24} color={iconColor} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: 'white' } }}>
        {/* Stack de Registro */}
        <Stack.Screen name="Registro" component={RegistroStack} />

        {/* Home con TabNavigator */}
        <Stack.Screen name="HomeAlumno" component={HomeTabs} options={{ animation: 'slide_from_right', gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
