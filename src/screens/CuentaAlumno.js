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
    <View style={styles.container}>
      {/* Encabezado con foto (puedes agregar Image) */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>FM</Text>
        </View>
        <Text style={styles.name}>{studentData.name}</Text>
        <Text style={styles.stats}>{studentData.stats.materias} materias - {studentData.stats.eventos} eventos</Text>
        <Text style={styles.email}>{studentData.email}</Text>
      </View>

      {/* Información académica */}
      <View style={styles.infoSection}>
        <Text style={styles.role}>{studentData.role} - {studentData.career}</Text>
      </View>

      {/* Rating de asistencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rating de asistencias</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Materias</Text>
          <Text style={styles.columnHeader}>Eventos</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>{studentData.materias[0].group}</Text>
          <Text style={styles.cell}>-</Text>
        </View>
      </View>

      {/* Listado de materias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Materias</Text>
        <FlatList
          data={studentData.materias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      {/* Listado de eventos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eventos</Text>
        <FlatList
          data={studentData.eventos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a89dc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stats: {
    fontSize: 16,
    color: '#666',
    marginBottom: 3,
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  role: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  columnHeader: {
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    width: '50%',
    textAlign: 'center',
    paddingVertical: 5,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
    marginBottom: 20,
  }
});

export default PerfilAlumno;