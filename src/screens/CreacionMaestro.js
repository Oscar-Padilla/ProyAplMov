import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const CreacionMaestro = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    const irACrearMateria = () => {
        navigation.navigate('CrearMateria');
    };

    const irACrearEvento = () => {
        navigation.navigate('CrearEvento');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={{ fontSize: 16, color: theme.text, alignSelf: 'center', marginBottom: 20 }}>Crear nuevo...</Text>

            <TouchableOpacity onPress={irACrearMateria} style={styles.item}>
                <Text style={[styles.option, { color: theme.text }]}>Materia</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={irACrearEvento} style={styles.item}>
                <Text style={[styles.option, { color: theme.text }]}>Evento</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    item: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    option: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default CreacionMaestro;
