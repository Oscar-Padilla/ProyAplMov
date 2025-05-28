import { View, Text, Image, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TextInput, FlatList } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useEffect, useState } from 'react';
import Octicons from '@expo/vector-icons/Octicons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CrearMateria4 = ({ navigation, route }) => {
    const paginaActual = 5;
    const totalPaginas = 6;
    const progreso = paginaActual / totalPaginas;
    const creditos = route.params?.creditos;
    const horariosInicial = route.params?.horarios || {};

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const diasAMostrar = creditos === '4' ? diasSemana.slice(0, 4) : diasSemana;

    const [openDia, setOpenDia] = useState(null);
    const [horarios, setHorarios] = useState(horariosInicial);
    const [lugares, setLugares] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetchLugares = async () => {
            const snapshot = await getDocs(collection(db, 'lugares'));
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLugares(lista);
        };
        fetchLugares();
    }, []);

    const seleccionarLugar = (dia, lugarId) => {
        setHorarios(prev => ({
            ...prev,
            [dia.toLowerCase()]: {
                ...prev[dia.toLowerCase()],
                lugar: lugarId
            }
        }));
        setBusqueda('');
        setOpenDia(null);
    };

    const lugaresFiltrados = lugares.filter(lugar => lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    const getNombreLugarPorId = (id) => {
        const lugar = lugares.find(l => l.id === id);
        return lugar?.nombre || '[Lugar no disponible]';
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("CrearMateria3")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Materia</Text>
                <Text style={styles.correoText}>¿Dónde será la clase?</Text>
                <FlatList
                    style={{ flex: 1, width: '100%', marginBottom: -120 }}
                    data={diasAMostrar}
                    keyExtractor={(item) => item}
                    renderItem={({ item: dia }) => (
                        <View style={styles.diaContainer}>
                            <TouchableOpacity
                                onPress={() => setOpenDia(openDia === dia ? null : dia)}
                                style={styles.diaHeader}
                            >
                                <Text style={styles.diaTexto}>{dia}</Text>
                                <Text style={styles.icon}>
                                    {openDia === dia
                                        ? <Octicons name="chevron-down" size={24} color="black" />
                                        : <Octicons name="chevron-right" size={24} color="black" />}
                                </Text>
                            </TouchableOpacity>

                            {openDia === dia && (
                                <View style={styles.pickerContainer}>
                                    {horarios[dia.toLowerCase()]?.lugar ? (
                                        <View style={styles.lugarSeleccionadoContainer}>
                                            <Text style={styles.horaTexto}>
                                                {getNombreLugarPorId(horarios[dia.toLowerCase()].lugar)}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setHorarios(prev => ({
                                                        ...prev,
                                                        [dia.toLowerCase()]: {
                                                            ...prev[dia.toLowerCase()],
                                                            lugar: null
                                                        }
                                                    }));
                                                }}
                                            >
                                                <Text style={styles.eliminarIcono}>✖</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <>
                                            <TextInput
                                                style={styles.searchInput}
                                                placeholder="Buscar lugar"
                                                value={busqueda}
                                                onChangeText={setBusqueda}
                                            />
                                            {busqueda.trim() !== '' && lugaresFiltrados.map((lugar) => (
                                                <TouchableOpacity
                                                    key={lugar.id}
                                                    style={styles.horaButton}
                                                    onPress={() => seleccionarLugar(dia, lugar.id)}
                                                >
                                                    <Text style={styles.horaTexto}>{lugar.nombre}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </>
                                    )}
                                </View>

                            )}
                        </View>
                    )}
                />


                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground} />
                        <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
                        <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("CrearMateria5", {
                            materiaNombre: route.params?.materiaNombre,
                            grupo: route.params?.grupo,
                            creditos: creditos,
                            horarios: horarios,
                        })}
                        style={styles.btnNext}
                    >
                        <Text style={styles.text}>Siguiente</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    todo: {
        display: 'flex',
        width: 'auto',
        paddingTop: 400,
        paddingBottom: 58,
        paddingLeft: 9,
        paddingRight: 9,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "white",
    },
    modalContainer: {
        backgroundColor: "white",
        width: "100%",
        padding: 20,
        alignItems: "center",
        height: "88%", // Ajusta la altura del modal
    },
    closeButton: {
        position: "absolute",
        top: 18,
        left: 18,
    },
    closeText: {
        fontSize: 22,
        color: "black",
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 20,
    },
    forms: {
        width: '100%',
        marginBottom: 20,
    },
    inputCorreo: {
        fontSize: 28,
        paddingVertical: 8,
    },
    correoText: {
        fontFamily: 'Roboto',
        fontSize: 36,
        fontWeight: "bold",
    },
    passwText: {
        fontFamily: 'Roboto',
        fontSize: 36,
        fontWeight: "600",
    },
    btnNext: {
        backgroundColor: '#49225B',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignSelf: 'center',
    },
    text: {
        color: '#fff',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 20,
    },
    bottomThing: {
        flex: 1,
        justifyContent: 'flex-end',
        width: '100%',
    },
    progressContainer: {
        width: '100%',
        height: 20,
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 10,
        backgroundColor: '#E9E9E9',
        borderRadius: 5,
        position: 'absolute',
    },
    progressBarFill: {
        height: 10,
        backgroundColor: '#191919',
        borderRadius: 5,
        position: 'absolute',
        left: 0,
    },
    progressText: {
        position: 'absolute',
        right: 0,
        top: -45,
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#191919',
    },
    checkboxPassw: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#767676',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#191919',
    },
    checkboxText: {
        fontSize: 16,
        color: '#767676',
        fontWeight: '600',
        letterSpacing: -0.32,
    },
    clearButton: {
        position: 'absolute',
        right: 20,
        top: 55,
    },
    option: {
        backgroundColor: '#E9DAF5',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 100,
        marginVertical: 8,
        width: 'auto',
        alignItems: 'center',
    },
    selected: {
        borderWidth: 2,
        borderColor: '#7D4CAA',
    },
    textSelector: {
        color: '#000',
        fontWeight: 'bold',
    },
    diaContainer: {
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    diaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    diaTexto: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    icon: {
        fontSize: 18,
    },
    pickerContainer: {
        paddingLeft: 10,
    },
    horaButton: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    horaTexto: {
        fontSize: 14,
    },
    searchInput: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontSize: 16
    },
    lugarSeleccionadoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10
    },
    eliminarIcono: {
        marginLeft: 10,
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold'
    },

});

export default CrearMateria4;
