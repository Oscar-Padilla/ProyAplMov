import React from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const HomeMaestroStaff = () => {
  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#A5A5A5" style={styles.searchIcon} />
        <TextInput placeholder="Busca lo que necesites" placeholderTextColor="#A5A5A5" style={styles.searchInput} />
      </View>
      
      <ScrollView>
        {/* Fecha */}
        <Text style={styles.dateText}>Feb 17, 2025</Text>
        
        {/* Título principal */}
        <Text style={styles.title}>La inspiración de hoy</Text>
        
        {/* Sección de Materias */}
        <Text style={styles.sectionTitle}>Materias</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.card}>
            <Image source={require('../../assets/img/materia.png')} style={styles.cardImage} />
            <Text style={styles.cardSubtitle}>TC1 2025A</Text>
            <Text style={styles.cardTitle}>Seguridad en las Aplicaciones de Software</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sección de Eventos */}
        <Text style={styles.sectionTitle}>Eventos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.card}>
            <Image source={require('../../assets/img/expovinculacion.png')} style={styles.cardImage} />
            <Text style={styles.cardTitle}>Expo vinculación 2025</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScrollView>

      {/* Barra de navegación */}
      <View style={styles.navbar}>
        <FontAwesome name="home" size={24} color="#000" />
        <FontAwesome name="plus-circle" size={24} color="#A5A5A5" />
        <FontAwesome name='nut-fill 1-circle' size={24} color= "A5A5A5" />
        <FontAwesome name="user-circle" size={24} color="#A5A5A5" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  dateText: {
    textAlign: 'center',
    color: '#A5A5A5',
    marginTop: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Centra el título de la sección
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    width: 200,
    padding: 10,
    alignItems: 'center',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#A5A5A5',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    elevation: 5,
  },
});

export default HomeMaestroStaff;
