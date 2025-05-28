import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, Image } from 'react-native';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';
import QRCode from 'react-native-qrcode-svg';

const { width: screenWidth } = Dimensions.get('window');

const EventoMaestro = () => {
    const route = useRoute();
    const { idEvento } = route.params;
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { usuario } = useUser();

    const [selected, setSelected] = useState('inscrito');
    const [evento, setEvento] = useState(null);
    const [organizador, setOrganizador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpcionesVisible, setModalOpcionesVisible] = useState(false);
    const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);
    const [modalQRVisible, setModalQRVisible] = useState(false);
    const [qrContent, setQrContent] = useState('');
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        lockPortrait();
        obtenerDatosEvento();
    }, []);

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    }, [navigation]);


    const obtenerDatosEvento = async (idEvento, setEvento, setOrganizador, setQrContent, setLoading) => {
        try {
            const docRef = doc(db, 'eventos', idEvento);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();

                // Obtener lugares y mapear id => nombre
                const lugaresCollection = collection(db, 'lugares');
                const lugaresSnap = await getDocs(lugaresCollection);
                const mapaLugares = {};
                lugaresSnap.forEach(doc => {
                    mapaLugares[doc.id] = doc.data().nombre;
                });

                // Construir arreglo de programa con lugar legible
                const programa = (data.programa || []).map(item => {
                    const lugarNombre = item.lugar ? (mapaLugares[item.lugar] || item.lugar) : 'Sin lugar';
                    return {
                        ...item,
                        lugar: lugarNombre,
                    };
                });

                setEvento({ ...data, programa });

                // Obtener organizador (profesor)
                if (data.organizadorId) {
                    const orgSnap = await getDoc(doc(db, 'usuarios', data.organizadorId));
                    if (orgSnap.exists()) setOrganizador(orgSnap.data());
                }

                // Obtener o crear QR
                if (data.qr) {
                    setQrContent(data.qr);
                } else {
                    const nuevoQR = JSON.stringify({ idEvento, nombre: data.nombre });
                    await updateDoc(docRef, { qr: nuevoQR });
                    setQrContent(nuevoQR);
                }

                // Opcional: carga inscritos/asistentes aquí si tienes

            } else {
                console.warn("Evento no encontrado:", idEvento);
            }
        } catch (error) {
            console.error('Error al cargar evento:', error);
        } finally {
            setLoading(false);
        }
    };


    const eliminarEvento = async (idEvento, navigation) => {
        try {
            // Eliminar documento del evento
            await deleteDoc(doc(db, 'eventos', idEvento));

            // Obtener usuarios inscritos en el evento
            const usuariosSnap = await getDocs(query(collection(db, 'usuarios'), where('eventosInscritas', 'array-contains', idEvento)));

            // Actualizar lista de eventos inscritos para cada usuario (remover evento eliminado)
            for (const u of usuariosSnap.docs) {
                const datos = u.data();
                const nuevas = datos.eventosInscritas.filter(id => id !== idEvento);
                await updateDoc(doc(db, 'usuarios', u.id), { eventosInscritas: nuevas });
            }

            // Obtener asistencias al evento para eliminar
            const asistenciasSnap = await getDocs(query(collection(db, 'asistencias_evento'), where('eventId', '==', idEvento)));
            for (const a of asistenciasSnap.docs) {
                await deleteDoc(doc(db, 'asistencias_evento', a.id));
            }

            // Regresar a la pantalla anterior
            navigation.goBack();

        } catch (error) {
            console.error('Error eliminando evento:', error);
        }
    };

    if (loading || !evento || !organizador) {
        return (
            <View style={[styles.overlay, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.overlay, { backgroundColor: theme.background }]}>
            <ScrollView vertical showsVerticalScrollIndicator={false}>
                <View style={[styles.profileBg, { backgroundColor: theme.primary }]}>
                    {evento.portadaUri ? (
                        <Image source={{ uri: evento.portadaUri }} style={{ width: '100%', height: 210, position: 'absolute', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }} resizeMode="cover" />
                    ) : null}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 40 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 44, height: 44, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                            <AntDesign name="left" size={24} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalOpcionesVisible(true)} style={{ width: 44, height: 44, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', top: -8 }}>...</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoProfile}>
                    <Text style={[styles.textName, { color: theme.text }]}>{evento.nombre}</Text>
                    <Text style={[styles.textStats, { color: theme.text }]}>{evento.grupo}</Text>
                    <Text style={[styles.textStats, { color: theme.text }]}>{organizador.nombre} {organizador.apellido}</Text>
                    <Text style={[styles.textEmail, { color: theme.text }]}>{organizador.correo}</Text>
                    <Text style={[styles.textRole, { color: theme.text }]}>{organizador.rol} • {organizador.departamento || 'Departamento no especificado'}</Text>
                </View>

                <View style={styles.Selector}>
                    <TouchableOpacity style={[styles.btnMaterias, selected === 'verasistencias' && styles.activeBtn, selected === 'verasistencias' && { backgroundColor: theme.primary }]} onPress={() => setSelected(prev => (prev === 'verasistencias' ? null : 'verasistencias'))}>
                        <Text style={[styles.textMaterias, selected === 'verasistencias' ? styles.activeTxt : { color: theme.text }]}>Ver asistencias</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnEventos, { backgroundColor: theme.primary }]} onPress={() => setModalQRVisible(true)}>
                        <Text style={[styles.textEventos, styles.activeTxt]}>Ver QR</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {selected === 'verasistencias' ? (
                        <View>
                            <View style={styles.horario}>
                                <Text style={[styles.textHorario, { color: theme.text }]}>Alumnos inscritos</Text>
                            </View>
                            <View style={styles.asistenciaContent}>
                                {alumnos.map(alumno => (
                                    <View key={alumno.id} style={[styles.card, { backgroundColor: theme.card, width: screenWidth - 80, alignSelf: 'center' }]}>
                                        <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 20, paddingBottom: 4 }}>{alumno.nombre} {alumno.apellido}</Text>
                                        {alumno.asistencias.map((a, i) => (
                                            <Text key={i} style={{ color: a.presente ? 'green' : 'red', paddingBottom: 2, fontSize: 16 }}>
                                                {a.fecha} - {a.presente ? 'Presente' : 'Ausente'}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.horario}>
                                <Text style={[styles.textHorario, { color: theme.text }]}>Horario</Text>
                            </View>
                            <View style={styles.horarioContent}>
                                {(() => {
                                    const rows = [];
                                    for (let i = 0; i < evento.horario.length; i += 2) {
                                        rows.push(
                                            <View key={i} style={styles.contentRow}>
                                                <View style={styles.contentIndi}>
                                                    <Text style={[styles.textDay, { color: theme.text }]}>{evento.horario[i].dia.charAt(0).toUpperCase() + evento.horario[i].dia.slice(1)}</Text>
                                                    <Text style={[styles.textTime, { color: theme.text }]}>{evento.horario[i].inicio} - {evento.horario[i].fin}</Text>
                                                    <Text style={styles.textLocation}>{evento.horario[i].lugar}</Text>
                                                </View>
                                                {evento.horario[i + 1] && (
                                                    <View style={styles.contentIndi}>
                                                        <Text style={[styles.textDay, { color: theme.text }]}>{evento.horario[i + 1].dia.charAt(0).toUpperCase() + evento.horario[i + 1].dia.slice(1)}</Text>
                                                        <Text style={[styles.textTime, { color: theme.text }]}>{evento.horario[i + 1].inicio} - {evento.horario[i + 1].fin}</Text>
                                                        <Text style={styles.textLocation}>{evento.horario[i + 1].lugar}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }
                                    return rows;
                                })()}
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modal QR */}
            <Modal visible={modalQRVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <View style={{ backgroundColor: theme.card, padding: 24, borderRadius: 30, alignItems: 'center' }}>
                        <QRCode value={qrContent} size={200} />
                        <TouchableOpacity onPress={() => setModalQRVisible(false)} style={{ marginTop: 20, padding: 10, paddingHorizontal: 30, backgroundColor: theme.primary, borderRadius: 100 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal eliminar */}
            <Modal visible={modalOpcionesVisible} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{ backgroundColor: theme.card, padding: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>¿Estás seguro?</Text>
                        <Text style={{ fontSize: 14, color: theme.text, textAlign: 'center', marginBottom: 30 }}>
                            Al eliminar <Text style={{ fontWeight: 'bold' }}>aceptas</Text> que toda la información de la evento se perderá.
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity onPress={() => setModalOpcionesVisible(false)} style={{ flex: 1, backgroundColor: theme.primary, padding: 10, borderRadius: 50, marginRight: 10, alignItems: 'center' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={eliminarMateria} style={{ flex: 1, backgroundColor: '#E0E0E0', padding: 10, borderRadius: 50, marginLeft: 10, alignItems: 'center' }}>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>Estoy seguro</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: 25
    },
    profileBg: {
        display: 'flex',
        width: 'auto',
        height: 210,
        top: -30,
        backgroundColor: '#A56ABD',
    },
    infoProfile: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        top: -30,
        alignSelf: 'center',
        gap: 7,
        marginBottom: 8,
    },
    infoName: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
    },
    textName: {
        color: '#191919',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 36,
        fontStyle: 'normal',
        fontWeight: 'bold',
    },
    infoStats: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
    },
    textStats: {
        color: '#191919',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
        paddingBottom: 8
    },
    infoEmail: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
    },
    textEmail: {
        color: '#191919',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20
    },
    infoRole: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        paddingTop: 8
    },
    textRole: {
        color: '#191919',
        textAlign: 'center',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20
    },
    RatingAsistencias: {
        display: 'flex',
        width: 'auto',
        height: 60,
        alignSelf: 'center',
        top: -20,
    },
    btnRating: {
        display: 'flex',
        width: 'auto',
        height: 60,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#49225B',
        borderRadius: 100,
    },
    textRating: {
        color: '#fff',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    dataMaterias: {
        display: 'flex',
        paddingLeft: 8,
        alignItems: 'flex-start',
        gap: 10,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    evento: {
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
        fontWeight: 'bold',
        letterSpacing: -0.32,
        color: '#FFF',
        lineHeight: 28
    },
    Selector: {
        display: 'flex',
        width: 'auto',
        height: 44,
        top: -15,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    content: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        top: 0,
        alignSelf: 'center',
        marginBottom: 100,
    },
    btnMaterias: {
        display: 'flex',
        width: 150,
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    textMaterias: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    btnEventos: {
        display: 'flex',
        width: 100,
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
    textEventos: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    activeBtn: {
        backgroundColor: '#49225B',
    },
    activeTxt: {
        color: '#fff',
    },
    horario: {
        display: 'flex',
        alignSelf: 'center'
    },
    textHorario: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    horarioContent: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        paddingLeft: 14,
        paddingRight: 14,
        alignSelf: 'stretch',
        marginBottom: 0,
        flexDirection: 'column',
        gap: 20,
        marginTop: 12
    },
    asistenciaContent: {
        flex: 1,
        display: 'flex',
        width: 'auto',
        height: 'auto',
        paddingLeft: 14,
        paddingRight: 14,
        marginBottom: 0,
        flexDirection: 'column',
        marginTop: 12,
    },
    calendarioContent: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        paddingLeft: 14,
        paddingRight: 14,
        alignSelf: 'stretch',
        marginBottom: 20,
        flexDirection: 'column',
        gap: 20,
        marginTop: 12
    },
    contentIndi: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: 4,
    },
    contentRow: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        gap: 14,
    },
    textDay: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
    },
    textTime: {
        color: '#191919',
        fontFamily: 'Roboto',
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 20,
    },
    textLocation: {
        color: '#A5A5A5',
        fontFamily: 'Roboto',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 20,
    },
    idiomaTitle: {
        alignSelf: 'stretch',
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: -0.32
    },
    aspectoText: {
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: -0.5,
    },
    switch: {
        width: 'auto',
        height: 'auto',
        alignSelf: 'flex-end',
        marginBottom: -10
    },
    notificaciones: {
        display: 'flex',
        width: 'auto',
        height: 'auto',
        alignSelf: 'flex-start',
        marginTop: 30,
        marginBottom: -10,
        paddingLeft: 14,
        top: -100
    },
    noti: {
        display: 'flex',
        width: 'auto',
        height: 30,
        flexDirection: 'row',
        gap: 10
    }
});

export default EventoMaestro;