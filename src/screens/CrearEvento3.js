import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const CrearEvento3 = ({ navigation, route }) => {
    const [text, setText] = useState("");
    const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
    const [lugares, setLugares] = useState([]);

    const paginaActual = 4;
    const totalPaginas = 6;
    const progreso = paginaActual / totalPaginas;



    useEffect(() => {
        const cargarLugares = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'lugares'));
                const listaLugares = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLugares(listaLugares);
            } catch (error) {
                console.error("Error cargando lugares:", error);
            }
        };

        cargarLugares();
    }, []);

    const lugaresFiltrados = lugares.filter(lugar =>
        lugar.nombre.toLowerCase().includes(text.toLowerCase()) &&
        lugar.id !== lugarSeleccionado?.id
    );

    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("CrearEvento2")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Evento</Text>
                <View style={styles.forms}>
                    <Text style={styles.correoText}>¿Dónde será el evento?</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Buscar lugar..."
                            value={lugarSeleccionado ? lugarSeleccionado.nombre : text}
                            onChangeText={(val) => {
                                setText(val);
                                if (lugarSeleccionado) setLugarSeleccionado(null);
                            }}
                            style={styles.inputCorreo}
                            placeholderTextColor={'#A5A5A5'}
                        />

                        {lugarSeleccionado && (
                            <TouchableOpacity
                                onPress={() => {
                                    setLugarSeleccionado(null);
                                    setText('');
                                }}
                                style={styles.clearButton}
                            >
                                <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>X</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {text.length > 0 && lugaresFiltrados.length > 0 && !lugarSeleccionado && (
                        <View style={styles.listaLugaresContainer}>
                            <FlatList
                                data={lugaresFiltrados}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item, index }) => {
                                    const esUltimo = index === lugaresFiltrados.length - 1;
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setLugarSeleccionado(item);
                                                setText(item.nombre);
                                            }}
                                            style={[
                                                styles.listaLugarItem,
                                                esUltimo && { borderBottomWidth: 0 }, // Quita el borderBottom si es último
                                            ]}
                                        >
                                            <Text style={styles.listaLugarTexto}>{item.nombre}</Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground} />
                        <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
                        <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("CrearEvento4", {
                        eventoNombre: route.params?.eventoNombre,
                        descripcion: route.params?.descripcion,
                        fecha: route.params?.fecha,
                        lugarId: lugarSeleccionado?.id
                    })} style={styles.btnNext} >
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
        flex: 1,
        fontSize: 28,
        paddingVertical: 8,
        paddingRight: 40
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
    listaLugaresContainer: {
        maxHeight: 150,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        marginTop: 5,
        paddingVertical: 5,
    },
    listaLugarItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    listaLugarTexto: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: '32%',
        transform: [{ translateY: -10 }],
        padding: 5,
        zIndex: 10,
    },
});

export default CrearEvento3;
