import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const Home = () => {
    const materias = [
        { id: '1', title: 'Aplicaciones Móviles Multiplataforma', image: require('./assets/img/materia.png') },
    ];
    
    const eventos = [
        { id: '2', title: 'Expo vinculación 2025', image: require('./assets/img/expovinculacion.png') },
    ];

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#A5A5A5" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Busca lo que necesites" />
            </View>
            <Text style={styles.dateText}>Feb 17, 2025</Text>
            <Text style={styles.title}>La inspiración de hoy</Text>
            <Text style={styles.sectionTitle}>Materias</Text>
            <FlatList data={materias} renderItem={renderCard} horizontal showsHorizontalScrollIndicator={false} />
            <Text style={styles.sectionTitle}>Eventos</Text>
            <FlatList data={eventos} renderItem={renderCard} horizontal showsHorizontalScrollIndicator={false} />
            <View style={styles.bottomNav}>
                <TouchableOpacity>
                    <Feather name="home" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="plus-circle" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="user" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
    },
    dateText: {
        textAlign: 'center',
        color: 'gray',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        width: 180,
        height: 120,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    cardText: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: 'white',
        fontWeight: 'bold',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
    },
});

export default Home;