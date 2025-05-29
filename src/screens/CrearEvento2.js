import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const CrearEvento2 = ({ navigation, route }) => {
    const [fecha, setFecha] = useState(new Date());
    const [fechaSeleccionada, setFechaSeleccionada] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const paginaActual = 3;
    const totalPaginas = 6;
    const progreso = paginaActual / totalPaginas;

    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("CrearEvento1")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Evento</Text>
                <View style={styles.forms}>
                    <Text style={styles.correoText}>¿Qué día es el evento?</Text>
                    {fecha && (
                        <Text style={[styles.horaTexto, { marginTop: 20, marginBottom: 20, }]}>
                            {(() => {
                                const fechaFormateada = fecha.toLocaleDateString('es-MX', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
                            })()}
                        </Text>
                    )}
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.horaButton}>
                        <Text style={styles.horaboton}>Seleccionar fecha</Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            value={fecha}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowPicker(false);
                                if (selectedDate) {
                                    setFecha(selectedDate);
                                    setFechaSeleccionada(true);
                                }
                            }}

                        />
                    )}
                </View>
                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground} />
                        <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
                        <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("CrearEvento3", {
                        eventoNombre: route.params?.eventoNombre,
                        descripcion: route.params?.descripcion,
                        fecha: fecha ? fecha.toISOString() : null
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
    horaButton: {
        backgroundColor: '#E9DAF5',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 100,
        marginVertical: 8,
        width: 'auto',
        alignItems: 'center',
    },
    horaTexto: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    horaboton: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default CrearEvento2;
