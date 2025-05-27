import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';

export default function QRScannerScreen() {
    useEffect(() => {
        lockPortrait();
    }, []);

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [qrData, setQrData] = useState('');
    const [cameraKey, setCameraKey] = useState(0);

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const { usuario, setUsuario } = useUser(); // ✅ Aquí debe estar

    const handleBarCodeScanned = async ({ data }) => {
        try {
            const parsed = JSON.parse(data);
            const id = parsed.idMateria || parsed.idEvento;
            const nombre = parsed.nombre;

            if (!id || !nombre) {
                alert("El QR escaneado no tiene el formato correcto.");
                return;
            }

            const tipo = id.startsWith("mat") ? "materia" : id.startsWith("ev") ? "evento" : null;
            if (!tipo) {
                alert("No se pudo identificar si es una materia o evento.");
                return;
            }

            // Verifica existencia
            const recursoRef = doc(db, tipo === 'materia' ? 'materias' : 'eventos', id);
            const recursoSnap = await getDoc(recursoRef);
            if (!recursoSnap.exists()) {
                alert(`${tipo === 'materia' ? 'Materia' : 'Evento'} no encontrado.`);
                return;
            }

            // Actualiza usuario (usuarios → materiasInscritas o eventosInscritos)
            const usuarioRef = doc(db, 'usuarios', usuario.uid);
            const campo = tipo === 'materia' ? 'materiasInscritas' : 'eventosInscritos';
            await updateDoc(usuarioRef, {
                [campo]: arrayUnion(id)
            });

            // Refrescar usuario en contexto
            const userSnap = await getDoc(usuarioRef);
            const userData = userSnap.data();
            setUsuario({ ...userData, uid: usuario.uid });


            // Inserta en colección de inscripciones
            if (tipo === 'materia') {
                const inscripcionId = `${usuario.uid}__${id}`;
                const inscripcionRef = doc(db, 'inscripciones_materia', inscripcionId);
                const inscripcionSnap = await getDoc(inscripcionRef);

                if (!inscripcionSnap.exists()) {
                    await setDoc(inscripcionRef, {
                        uid: usuario.uid,
                        matId: id,
                        estado: "inscrito"
                    });
                }
            }

            setScanned(true);
            alert(`¡Inscrito correctamente en la ${tipo}: ${nombre}!`);

            // Redirección correcta
            if (tipo === 'materia') {
                navigation.navigate('CuentaAlumnoTabs', {
                    screen: 'MateriaAlumno',
                    params: { idMateria: id },
                });
            } else {
                navigation.navigate('CuentaAlumnoTabs', {
                    screen: 'EventoAlumno',
                    params: { idEvento: id },
                });
            }

        } catch (error) {
            console.error("Error al procesar QR:", error);
            alert("QR inválido o error al procesarlo.");
        }
    };

    const reiniciarEscaneo = () => {
        setScanned(false);
        setCameraKey(prev => prev + 1);
        setQrData('');
    };

    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text>No tienes acceso a la cámara</Text>
                <Button title="Solicitar permiso" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!scanned && isFocused && (
                <CameraView
                    key={cameraKey}
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={handleBarCodeScanned}
                />
            )}

            {!scanned && (
                <View style={styles.overlay}>
                    <View style={styles.bgText}>
                        <Text style={styles.text}>Buscar un código para leerlo</Text>
                    </View>

                    <View style={styles.scannerArea}>
                        <View style={[styles.corner, styles.topLeft]} />
                        <View style={[styles.corner, styles.topRight]} />
                        <View style={[styles.corner, styles.bottomLeft]} />
                        <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                </View>
            )}

            {scanned && (
                <Button title="Escanear otro QR" onPress={reiniciarEscaneo} />
            )}
        </View>
    );
}

const { width } = Dimensions.get('window');
const boxSize = width * 0.7;

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        paddingTop: 80,
    },
    bgText: {
        backgroundColor: 'rgba(0, 0, 0, 0.50)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 120,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Roboto',
        fontWeight: '600',
        textAlign: 'center',
    },
    scannerArea: {
        width: boxSize,
        height: boxSize,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderColor: 'white',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderLeftWidth: 6,
        borderTopWidth: 6,
        borderTopLeftRadius: 80,
    },
    topRight: {
        top: 0,
        right: 0,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderTopRightRadius: 80,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderLeftWidth: 6,
        borderBottomWidth: 6,
        borderBottomLeftRadius: 80,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderBottomRightRadius: 80,
    },
});
