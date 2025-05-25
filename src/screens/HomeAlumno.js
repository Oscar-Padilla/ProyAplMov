import { Text, View, StyleSheet, TextInput, ScrollView, ImageBackground } from "react-native";
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import materia1 from '../../assets/img/Materia1.png';
import materia2 from '../../assets/img/Materia2.png';
import evento1 from '../../assets/img/Evento1.png';
import evento2 from '../../assets/img/Evento2.png';

const HomeAlumno = () => {
    const [text, setText] = useState("");

    return (
        <View style={styles.overlay}>
            <View style={styles.search}>
                <View style={styles.searchInput}>
                    <TextInput
                        style={styles.inputBusqueda}
                        placeholder="Busca lo que necesites"
                        placeholderTextColor={'#A5A5A5'}
                        value={text}
                        onChange={setText}
                    />
                    <FontAwesome name="search" size={24} color="gray" style={styles.lupa}/>
                </View>
            </View>
            <View style={styles.Title}>
                <View style={styles.textTitle}>
                    <Text style={styles.textFecha}>Abr 16, 2025</Text>
                    <Text style={styles.textTitulo}>La inspiración de hoy</Text>
                </View>
            </View>
            {/* Container Materias */}
            <View style={styles.containerMaterias}>
                <View style={styles.materias}>
                    <Text style={styles.textMaterias}>Materias</Text>
                    <ScrollView horizontal={true} style={{flexDirection:'row'}} showsHorizontalScrollIndicator={false}>
                        <View style={styles.dataMaterias}>
                            <View style={styles.materia}>
                                <ImageBackground source={materia1} style={styles.imgMateria}>
                                    <View style={styles.overlaymateria}>
                                        <Text style={styles.textGrupo}>TC1 2025A</Text>
                                        <Text style={styles.textMateria}>Aplicaciones Móviles Multiplataforma</Text>
                                    </View>
                                </ImageBackground>
                            </View>
                            <View style={styles.materia}>
                                <ImageBackground source={materia2} style={styles.imgMateria}>
                                    <View style={styles.overlaymateria}>
                                        <Text style={styles.textGrupo}>TC1 2025A</Text>
                                        <Text style={styles.textMateria}>Seguridad en las Aplicaciones de Software</Text>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            {/* Container Eventos */}
            <View style={styles.containerMaterias}>
                <View style={styles.materias}>
                    <Text style={styles.textMaterias}>Eventos</Text>
                    <ScrollView horizontal={true} style={{flexDirection:'row'}} showsHorizontalScrollIndicator={false}>
                        <View style={styles.dataMaterias}>
                            <View style={styles.materia}>
                                <ImageBackground source={evento1} style={styles.imgMateria}>
                                    <View style={styles.overlaymateria}>
                                        <Text style={styles.textMateria}>Expo vinculación 2025</Text>
                                    </View>
                                </ImageBackground>
                            </View>
                            <View style={styles.materia}>
                                <ImageBackground source={evento2} style={styles.imgMateria}>
                                    <View style={styles.overlaymateria}>
                                        <Text style={styles.textMateria}>Jornada Ambiental para crédito complementario</Text>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                    </ScrollView>
                </View>
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
    search: {
        backgroundColor: "white",
        width: 'auto',
        height: 'auto',
        display: 'flex',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 10
    },
    searchInput: {
        display: 'flex',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        gap: 8,
        borderRadius: 30,
        backgroundColor: '#f1f1f1',
    },
    inputBusqueda: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
        color: '#000',
        gap: 8,
        alignSelf: 'stretch',
        flex: 1
    },
    lupa: {
        width: 28,
        height: 28,
    },
    Title: {
        width: 'auto',
        height: 81,
        flexShrink: 0,
        marginTop: 5
    },
    textTitle: {
        display: 'flex',
        width: 'auto',
        marginTop: 8,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 7
    },
    textFecha: {
        alignSelf: 'center',
        color: '#191919',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 16,
    },
    textTitulo: {
        alignSelf: 'center',
        color: '#191919',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 36,
        fontStyle: 'normal',
        fontWeight: '600',

    },
    containerMaterias: {
        width: 'auto',
        height: 266,
        flexShrink: 0,
        marginTop: 8,
    },
    materias: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12
    },
    textMaterias: {
        alignSelf: 'stretch',
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 20,
        textAlign: 'center'
    },
    dataMaterias: {
        display: 'flex',
        paddingLeft: 8,
        alignItems: 'flex-start',
        gap: 10,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    materia: {
        display: 'flex',
        width: 324,
        height: 234,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 2,
    },
    imgMateria: {
        width: 324,
        height: 234,
        borderRadius: 30,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 2
    },
    overlaymateria: {
        display: 'flex',
        width: 324,
        height: 234,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 2
    },
    textGrupo: {
        position: 'flex',
        width: 'auto',
        height: 'auto',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 20,
        letterSpacing: -0.32,
        color: '#FFF'
    },
    textMateria: {
        position: 'flex',
        width: 'auto',
        height: 'auto',
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12,
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 28,
        fontStyle: 'normal',
        fontWeight: '600',
        letterSpacing: -0.32,
        color: '#FFF',
        lineHeight: 28
    }
});

export default HomeAlumno;