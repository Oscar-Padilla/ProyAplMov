import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const CrearEvento5 = ({ navigation, route }) => {
    const [imagenPortada, setImagenPortada] = useState(null);
    const paginaActual = 6;
    const totalPaginas = 6;
    const progreso = paginaActual / totalPaginas;
    const { usuario } = useUser();

    const generarIdEvento= async () => {
        const snapshot = await getDocs(collection(db, 'eventos'));
        const total = snapshot.size + 1;
        return `ev${total.toString().padStart(3, '0')}`;
    };

    const elegirImagen = async () => {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            alert('Permiso requerido para acceder a la galería.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!resultado.canceled) {
            const uriOriginal = resultado.assets[0].uri;
            const nombreArchivo = `evento_${Date.now()}.jpg`;
            const destino = FileSystem.documentDirectory + 'portadas/' + nombreArchivo;

            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'portadas/', { intermediates: true });
            await FileSystem.copyAsync({ from: uriOriginal, to: destino });
            setImagenPortada(destino);
        }
    };

    const subirImagenYGuardarEvento = async () => {
        try {
            const nuevaId = await generarIdEvento();
            const eventoRef = doc(db, 'eventos', nuevaId);

            await setDoc(eventoRef, {
                nombre: route.params?.eventoNombre,
                descripcion: route.params?.descripcion,
                fecha: route.params?.fecha,
                lugar: route.params?.lugarId,
                programa: route.params?.programa,
                organizadorId: usuario.uid,
                portadaUri: imagenPortada || '',
                qr: JSON.stringify({
                    idEvento: nuevaId,
                    nombre: route.params?.eventoNombre
                }),
                Universidad: "TECNM • Aguascalientes"
            });

            alert(`Evento guardado como ${nuevaId} ✅`);
        } catch (error) {
            console.error('Error al guardar localmente:', error);
            alert('Error al guardar el evento ❌');
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("CrearMateria4")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Evento</Text>
                <View style={styles.forms}>
                    <Text style={styles.correoText}>Sube una foto de portada</Text>
                    <TouchableOpacity style={styles.horaButton} onPress={elegirImagen}>
                        <Text style={styles.horaTexto}>Seleccionar imagen</Text>
                    </TouchableOpacity>
                    {imagenPortada && (
                        <Image
                            source={{ uri: imagenPortada }}
                            style={{ width: '100%', height: 180, marginTop: 10, borderRadius: 10 }}
                            resizeMode="cover"
                        />
                    )}
                </View>
                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBarBackground} />
                        <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
                        <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity onPress={subirImagenYGuardarEvento} style={styles.btnNext}>
                        <Text style={styles.text}>Guardar Evento</Text>
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
});

export default CrearEvento5;
