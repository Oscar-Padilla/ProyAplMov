import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';

const EventoAlumno = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { usuario } = useUser();
    const { idEvento } = route.params;

    const [selected, setSelected] = useState('inscrito');

    const [evento, setEvento] = useState(null);
    const [modalOpcionesVisible, setModalOpcionesVisible] = useState(false);
    const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);

    const [asistencias, setAsistencias] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const irAlMesAnterior = () => {
        const nuevo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(nuevo);
    };

    const irAlMesSiguiente = () => {
        const nuevo = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(nuevo);
    };

    const obtenerAsistencias = async () => {
        try {
            if (!usuario || !usuario.uid) {
                console.warn('Usuario no disponible aún.');
                return;
            }

            const q = query(
                collection(db, 'asistencias_evento'),
                where('eventoId', '==', idEvento),
                where('uid', '==', usuario.uid)
            );

            const querySnapshot = await getDocs(q);
            const resultados = querySnapshot.docs.map(doc => doc.data());
            setAsistencias(resultados);
        } catch (error) {
            console.error('Error al obtener asistencias:', error);
        }
    };


    useEffect(() => {
        if (idEvento) {
            lockPortrait();
            obtenerAsistencias();
        }
    }, [currentMonth, idEvento]);

    useEffect(() => {
        const obtenerEvento = async () => {
            try {
                const eventoRef = doc(db, 'eventos', idEvento);
                const eventoSnap = await getDoc(eventoRef);
                if (eventoSnap.exists()) {
                    setEvento(eventoSnap.data());
                }
            } catch (error) {
                console.error('Error al obtener evento:', error);
            }
        };

        obtenerEvento();
    }, [idEvento]);

    const darDeBaja = async () => {
        try {
            const uid = usuario.uid;

            // 1. Eliminar idEvento del array eventosInscritos
            const usuarioRef = doc(db, 'usuarios', uid);
            await updateDoc(usuarioRef, {
                eventosInscritos: arrayRemove(idEvento)
            });

            // 2. Eliminar inscripcion
            const inscripcionRef = doc(db, 'inscripciones_evento', `${uid}__${idEvento}`);
            await deleteDoc(inscripcionRef);

            setModalConfirmacionVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error('Error al dar de baja el evento:', error);
        }
    };

    if (!evento) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Cargando evento...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.overlay, { backgroundColor: theme.background }]}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalOpcionesVisible}
                onRequestClose={() => setModalOpcionesVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{
                        backgroundColor: theme.card,
                        padding: 20,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        alignItems: 'flex-start'
                    }}>
                        <Text style={{ fontSize: 16, color: theme.text, alignSelf: 'flex-start', marginBottom: 20 }}>Opciones</Text>
                        <TouchableOpacity onPress={() => {
                            setModalOpcionesVisible(false);
                            setModalConfirmacionVisible(true);
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 30 }}>Anular registro</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalOpcionesVisible(false)}
                            style={{
                                backgroundColor: theme.primary,
                                borderRadius: 50,
                                paddingHorizontal: 24,
                                paddingVertical: 10,
                                alignSelf: 'center'
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmacionVisible}
                onRequestClose={() => setModalConfirmacionVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <View style={{
                        backgroundColor: theme.card,
                        padding: 25,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>¿Estás seguro?</Text>
                        <Text style={{ fontSize: 14, color: theme.text, textAlign: 'center', marginBottom: 30 }}>
                            Al anular tu registro <Text style={{ fontWeight: 'bold' }}>aceptas</Text> que no podrás acceder, ni registrar tu asistencia.
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity
                                onPress={() => setModalConfirmacionVisible(false)}
                                style={{
                                    flex: 1,
                                    backgroundColor: theme.primary,
                                    padding: 10,
                                    borderRadius: 50,
                                    marginRight: 10,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                OnPress={darDeBaja}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#E0E0E0',
                                    padding: 10,
                                    borderRadius: 50,
                                    marginLeft: 10,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>Estoy seguro</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView vertical={true} style={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}>
                <View style={[styles.profileBg, { backgroundColor: theme.primary, justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 40, flexDirection: 'row' }]}>
                    {evento.portadaUri ? (
                        <Image source={{ uri: evento.portadaUri }} style={{ width: '100%', height: 'auto', position: 'absolute' }} resizeMode="cover" />
                    ) : null}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 100,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <AntDesign name="left" size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setModalOpcionesVisible(true)}
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 100,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <Text style={{
                            fontSize: 24,
                            fontWeight: 'bold',
                            color: 'white',
                            top: -8
                        }}>...</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoProfile}>
                    <View style={styles.infoName}>
                        <Text style={[styles.textName, { color: theme.text }]}>{evento.nombre}</Text>
                    </View>
                    <View style={styles.infoStats}>
                        <Text style={[styles.textStats, { color: theme.text }]}>{evento.Universidad}</Text>
                        <Text style={[styles.textStats, { color: theme.text }]}>{evento.descripcion}</Text>
                    </View>
                    <View style={styles.infoRole}>
                        <Text style={[styles.textRole, { color: theme.text }]}>
                            {new Date(evento.fecha)
                                .toLocaleDateString('es-MX', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long'
                                })
                                .replace(/^\w/, (c) => c.toUpperCase())}
                        </Text>
                    </View>
                </View>
                <View style={styles.Selector}>
                    <TouchableOpacity
                        style={[styles.btnMaterias, selected === 'verasistencias' && styles.activeBtn, selected === 'verasistencias' && { backgroundColor: theme.primary }]}
                        onPress={() => setSelected('verasistencias')}
                    >
                        <Text style={[styles.textMaterias, selected === 'verasistencias' && styles.activeTxt, selected === 'inscrito' && { color: theme.text }]}>Ver asistencias</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnEventos, selected === 'inscrito' && styles.activeBtn, selected === 'inscrito' && { backgroundColor: theme.primary }]}
                        onPress={() => setSelected('inscrito')}
                    >
                        <Text style={[styles.textEventos, selected === 'inscrito' && styles.activeTxt, selected === 'verasistencias' && { color: theme.text }]}>Registrado</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {selected === 'inscrito' ? (
                        <View>
                            <View style={styles.horario}>
                                <Text style={[styles.textHorario, { color: theme.text }]}>Programa</Text>
                            </View>
                            <View style={styles.horarioContent}>
                                {(() => {
                                    const rows = [];
                                    for (let i = 0; i < evento.programa.length; i += 2) {
                                        rows.push(
                                            <View key={i} style={styles.contentRow}>
                                                <View style={styles.contentIndi}>
                                                    <Text style={[styles.textDay, { color: theme.text }]}>{evento.programa[i].titulo}</Text>
                                                    <Text style={[styles.textTime, { color: theme.text }]}>{evento.programa[i].horaInicio} - {evento.programa[i].horaFin}</Text>
                                                    <Text style={styles.textLocation}>{evento.programa[i].lugar}</Text>
                                                </View>
                                                {evento.programa[i + 1] && (
                                                    <View style={styles.contentIndi}>
                                                        <Text style={[styles.textDay, { color: theme.text }]}>{evento.programa[i + 1].titulo}</Text>
                                                        <Text style={[styles.textTime, { color: theme.text }]}>{evento.programa[i + 1].horaInicio} - {evento.programa[i].horaFin}</Text>
                                                        <Text style={styles.textLocation}>{evento.programa[i + 1].lugar}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }
                                    return rows;
                                })()}
                            </View>

                        </View>
                    ) : (
                        <View>
                            <View style={styles.horario}>
                                <Text style={[styles.textHorario, { color: theme.text }]}>Calendario</Text>
                            </View>
                            <View style={styles.calendarioContent}>
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 }}>
                                        <TouchableOpacity onPress={irAlMesAnterior}>
                                            <AntDesign name="left" size={20} color={theme.text} />
                                        </TouchableOpacity>
                                        <Text style={[styles.textHorario, { color: theme.text }]}>
                                            {new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(currentMonth)}
                                        </Text>
                                        <TouchableOpacity onPress={irAlMesSiguiente}>
                                            <AntDesign name="right" size={20} color={theme.text} />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Encabezado de días */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 6, gap: 4 }}>
                                        {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((dia, idx) => (
                                            <Text key={idx} style={{ width: 40, textAlign: 'center', color: theme.text, fontSize: 13, fontWeight: 600 }}>{dia}</Text>
                                        ))}
                                    </View>

                                    {/* Cuerpo del calendario */}
                                    <View>
                                        {(() => {
                                            const semanas = [];
                                            const primerDia = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
                                            const totalDias = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                                            const dias = [];

                                            // Rellenar espacios vacíos antes del primer día
                                            for (let i = 0; i < primerDia; i++) {
                                                dias.push(null);
                                            }

                                            // Agregar todos los días del mes
                                            for (let d = 1; d <= totalDias; d++) {
                                                dias.push(d);
                                            }

                                            // Dividir en semanas
                                            for (let i = 0; i < dias.length; i += 7) {
                                                semanas.push(dias.slice(i, i + 7));
                                            }

                                            return semanas.map((semana, i) => (
                                                <View key={i} style={{ flexDirection: 'row', justifyContent: 'flex-start', left: 0, gap: 14 }}>
                                                    {semana.map((dia, j) => {
                                                        if (!dia) {
                                                            return <Text key={j} style={{ width: 40, height: 30 }} />;
                                                        }

                                                        const fecha = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
                                                        const registro = asistencias.find(a => a.fecha === fecha);

                                                        let color = '#A5A5A5';
                                                        if (registro?.presente === true) color = 'green';
                                                        else if (registro?.presente === false) color = 'red';

                                                        return (
                                                            <Text
                                                                key={j}
                                                                style={{
                                                                    width: 40,
                                                                    height: 30,
                                                                    textAlign: 'center',
                                                                    textAlignVertical: 'center',
                                                                    color,
                                                                    fontWeight: registro ? 'bold' : 'normal',
                                                                }}
                                                            >
                                                                {dia}
                                                            </Text>
                                                        );
                                                    })}
                                                </View>
                                            ));
                                        })()}
                                    </View>
                                </View>

                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    // [SIN CAMBIOS DE DISEÑO]
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
        paddingHorizontal: 5
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
        fontWeight: 'bold',
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
        width: 120,
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

export default EventoAlumno;