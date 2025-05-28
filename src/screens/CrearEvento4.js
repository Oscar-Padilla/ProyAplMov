import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Platform, FlatList } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const CrearEvento4 = ({ navigation, route }) => {
    const [programa, setPrograma] = useState([]);
    const [titulo, setTitulo] = useState('');
    const [horaInicio, setHoraInicio] = useState(null);
    const [horaFin, setHoraFin] = useState(null);
    const [showPicker, setShowPicker] = useState({ show: false, campo: null });

    const paginaActual = 5;
    const totalPaginas = 6;
    const progreso = paginaActual / totalPaginas;

    const agregarSegmento = () => {
        if (!titulo.trim() || !horaInicio || !horaFin) {
            alert('Completa todos los campos');
            return;
        }
        if (programa.length >= 8) {
            alert('Máximo 8 segmentos permitidos');
            return;
        }
        const nuevoId = programa.length + 1;
        setPrograma([...programa, {
            id: nuevoId.toString(),
            titulo,
            horaInicio: horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            horaFin: horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lugar: route.params?.lugarId
        }]);
        setTitulo('');
        setHoraInicio(null);
        setHoraFin(null);
    };

    const eliminarSegmento = (id) => {
        setPrograma(programa.filter(seg => seg.id !== id));
    };

    const onChangeTime = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setShowPicker({ show: false, campo: null });
            return;
        }
        if (showPicker.campo === 'inicio') {
            setHoraInicio(selectedDate);
        } else if (showPicker.campo === 'fin') {
            setHoraFin(selectedDate);
        }
        setShowPicker({ show: false, campo: null });
    };
    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("CrearEvento3")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Evento</Text>
                <View style={styles.forms}>
                    <Text style={styles.correoText}>Haz el programa</Text>
                    {/* aqui haz eso del programa y usa datetimepicker para las horas */}
                    <TextInput
                        style={styles.input}
                        placeholder="Título del segmento"
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => setShowPicker({ show: true, campo: 'inicio' })}
                    >
                        <Text>{horaInicio ? horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Seleccionar hora inicio'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.timeButton}
                        onPress={() => setShowPicker({ show: true, campo: 'fin' })}
                    >
                        <Text>{horaFin ? horaFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Seleccionar hora fin'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnAgregar} onPress={agregarSegmento}>
                        <Text style={styles.btnText}>Agregar segmento</Text>
                    </TouchableOpacity>

                    <Text style={styles.subTitle}>Segmentos agregados ({programa.length})</Text>

                    <FlatList
                        data={programa}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.segmentoContainer}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.segmentoTitulo}>{item.titulo}</Text>
                                    <Text style={styles.segmentoHoras}>{item.horaInicio} - {item.horaFin}</Text>
                                </View>
                                <TouchableOpacity onPress={() => eliminarSegmento(item.id)}>
                                    <Text style={styles.eliminar}>X</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={{ fontStyle: 'italic', color: '#999' }}>No hay segmentos agregados</Text>}
                    />

                    {showPicker.show && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            is24Hour={false}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onChangeTime}
                        />
                    )}
                </View>
                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground} />
                        <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
                        <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("CrearEvento5", {
                        eventoNombre: route.params?.eventoNombre,
                        descripcion: route.params?.descripcion,
                        fecha: route.params?.fecha,
                        lugarId: route.params?.lugarId,
                        programa: programa
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
    timeButton: {
        backgroundColor: '#E9E9E9',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        position: 'relative',
        width: '100%',
        marginBottom: 10,
    },
    btnAgregar: {
        backgroundColor: '#49225B',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
        position: 'relative',
        width: '100%',
        marginBottom: 10,
    },
    btnText: {
        color: '#fff',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        lineHeight: 20,
        textAlign: 'center',
    },
    subTitle: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    segmentoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    segmentoTitulo: {
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
    },
    segmentoHoras: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#999',
    },
    eliminar: {
        fontFamily: 'Roboto',
        fontSize: 16,
        color: '#999',
        marginLeft: 10,
    },
    input: {
        padding: 12,
        marginBottom: 12,
        fontSize: 20,
    },
});

export default CrearEvento4;
