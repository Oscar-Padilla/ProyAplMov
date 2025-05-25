import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

const PerfilAlumno = () => {
  // Datos del estudiante (puedes reemplazar con datos reales)
  const studentData = {
    name: "Fulanito Mengano",
    email: "20151714@aguascalientes.tecnm.mx",
    career: "Ingeniería En Tecnologías De La Información Y Comunicaciones",
    role: "Estudiante",
    stats: {
      materias: 2,
      eventos: 2
    },
    materias: [
      { id: '1', name: 'Aplicaciones Móviles Multiplataforma', group: 'TC1 2025A' },
      { id: '2', name: 'Base de Datos', group: 'TC2 2025A' }
    ],
    eventos: [
      { id: '1', name: 'Expo Vinculación 2025' },
      { id: '2', name: 'Taller de React Native' }
    ]
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.profileBg}>
        <View style={styles.profileIcn}>
          <Text style={styles.textProfile}>FM</Text>
        </View>
      </View>
      <View style={styles.infoProfile}>
        
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 25
  },
  profileBg: {
    display: 'flex',
    width: 'auto',
    height: 210,
    top: -30,
    backgroundColor: '#A56ABD',
  },
  profileIcn: {
    display: 'flex',
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#52355E',
    top: 150,
    alignSelf: 'center',
    borderColor: '#fff',
    borderWidth: 2
  },
  textProfile: {
    position: 'flex',
    width: 'auto',
    height: 120,
    color: '#fff',
    fontSize: 36,
    fontFamily: 'Roboto',
    fontWeight: '600',
    textAlign: 'center',
    top: 30,
  },
});

export default PerfilAlumno;