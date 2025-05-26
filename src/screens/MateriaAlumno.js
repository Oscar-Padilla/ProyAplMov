import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MateriaAlumno = () => {
  const { theme } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { idMateria } = route.params;

  const [materia, setMateria] = useState(null);
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificacionesActivas, setNotificacionesActivas] = useState(false);
  const notificationIds = useRef([]);

  useEffect(() => {
    lockPortrait();
    obtenerDatosMateria();
    cargarEstadoNotificacion();
  }, []);

  useEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
  }, [navigation]);

  const cargarEstadoNotificacion = async () => {
    try {
      const estadoGuardado = await AsyncStorage.getItem(`notificacion_${idMateria}`);
      if (estadoGuardado !== null) {
        setNotificacionesActivas(estadoGuardado === 'true');
      }
    } catch (e) {
      console.error('Error cargando estado de notificación:', e);
    }
  };

  const guardarEstadoNotificacion = async (estado) => {
    try {
      await AsyncStorage.setItem(`notificacion_${idMateria}`, String(estado));
    } catch (e) {
      console.error('Error guardando estado de notificación:', e);
    }
  };

  const obtenerDatosMateria = async () => {
    try {
      const docRef = doc(db, 'materias', idMateria);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const horario = Object.entries(data.horario || {})
          .filter(([key]) => ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].includes(key))
          .map(([dia, detalles]) => ({
            dia,
            inicio: detalles.inicio,
            fin: detalles.fin,
            lugar: detalles.lugar,
          }));

        setMateria({ ...data, horario });

        const profSnap = await getDoc(doc(db, 'usuarios', data.profesorId));
        if (profSnap.exists()) {
          setProfesor(profSnap.data());
        }
      }
    } catch (error) {
      console.error('Error al cargar materia:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularTrigger = (horaClase) => {
    const [hora, minuto] = horaClase.split(':').map(Number);
    const claseDate = new Date();
    claseDate.setHours(hora);
    claseDate.setMinutes(minuto - 10);
    claseDate.setSeconds(0);

    const ahora = new Date();
    const diferencia = (claseDate.getTime() - ahora.getTime()) / 1000;

    return diferencia > 0 ? { seconds: Math.floor(diferencia) } : { seconds: 2 };
  };

  const probarNotificacion = async () => {
    if (!materia || !materia.horario) return;

    const item = materia.horario[0];
    const trigger = calcularTrigger(item.inicio);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `📚 ¡Clase de ${materia.nombre} en breve!`,
        body: `🕒 Tu clase en ${item.lugar} comienza pronto a las ${item.inicio}`,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger
    });
  };

  const toggleNotificacion = async () => {
    const nuevoEstado = !notificacionesActivas;
    setNotificacionesActivas(nuevoEstado);
    await guardarEstadoNotificacion(nuevoEstado);

    if (nuevoEstado) {
      await probarNotificacion();
    } else {
      for (const id of notificationIds.current) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
      notificationIds.current = [];
    }
  };

  if (loading || !materia || !profesor) {
    return (
      <View style={[styles.overlay, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <ScrollView vertical={true} style={{ flexDirection: 'column' }} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileBg, { backgroundColor: theme.primary }]}></View>
        <View style={styles.infoProfile}>
          <View style={styles.infoName}>
            <Text style={[styles.textName, { color: theme.text }]}>{materia.nombre}</Text>
          </View>
          <View style={styles.infoStats}>
            <Text style={[styles.textStats, { color: theme.text }]}>{materia.grupo}</Text>
            <Text style={[styles.textStats, { color: theme.text }]}>{profesor.nombre} {profesor.apellido}</Text>
          </View>
          <View style={styles.infoEmail}>
            <Text style={[styles.textEmail, { color: theme.text }]}>{profesor.correo}</Text>
          </View>
          <View style={styles.infoRole}>
            <Text style={[styles.textRole, { color: theme.text }]}>{profesor.rol} • {profesor.departamento || 'Departamento no especificado'}</Text>
          </View>
        </View>
        <View style={styles.RatingAsistencias}>
          <TouchableOpacity style={[styles.btnRating, { backgroundColor: theme.primary }]}>
            <Text style={styles.textRating}>¡Inscríbeme!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horario}>
          <Text style={[styles.textHorario, { color: theme.text }]}>Horario</Text>
        </View>
        <View style={styles.horarioContent}>
          {(() => {
            const rows = [];
            for (let i = 0; i < materia.horario.length; i += 2) {
              rows.push(
                <View key={i} style={styles.contentRow}>
                  <View style={styles.contentIndi}>
                    <Text style={[styles.textDay, { color: theme.text }]}>{materia.horario[i].dia.charAt(0).toUpperCase() + materia.horario[i].dia.slice(1)}</Text>
                    <Text style={[styles.textTime, { color: theme.text }]}>{materia.horario[i].inicio} - {materia.horario[i].fin}</Text>
                    <Text style={styles.textLocation}>{materia.horario[i].lugar}</Text>
                  </View>
                  {materia.horario[i + 1] && (
                    <View style={styles.contentIndi}>
                      <Text style={[styles.textDay, { color: theme.text }]}>{materia.horario[i + 1].dia.charAt(0).toUpperCase() + materia.horario[i + 1].dia.slice(1)}</Text>
                      <Text style={[styles.textTime, { color: theme.text }]}>{materia.horario[i + 1].inicio} - {materia.horario[i + 1].fin}</Text>
                      <Text style={styles.textLocation}>{materia.horario[i + 1].lugar}</Text>
                    </View>
                  )}
                </View>
              );
            }
            return rows;
          })()}

        </View>
        <View style={styles.notificaciones}>
          <Text style={[styles.idiomaTitle, { color: theme.text }]}>Notificaciones</Text>
          <View style={styles.noti}>
            <Text style={[styles.aspectoText, { color: theme.text }]}>Avísame cuando esté por empezar</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: '#767577', true: '#49225B' }}
              thumbColor={notificacionesActivas ? '#fff' : '#f4f3f4'}
              onValueChange={toggleNotificacion}
              value={notificacionesActivas}
            />
          </View>
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
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  content: {
    display: 'flex',
    width: 'auto',
    height: 'auto',
    top: 60,
    alignSelf: 'center',
    marginBottom: 100,
  },
  btnMaterias: {
    display: 'flex',
    width: 100,
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
    marginBottom: 100,
    paddingLeft: 14
  },
  noti: {
    display: 'flex',
    width: 'auto',
    height: 30,
    flexDirection: 'row',
    gap: 10
  }
});

export default MateriaAlumno;

