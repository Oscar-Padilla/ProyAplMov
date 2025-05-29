import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Modal, Image } from 'react-native';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';

const MateriaAlumno = () => {

  const route = useRoute();
  const { idMateria } = route.params;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { usuario } = useUser();

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
        collection(db, 'asistencias_materia'),
        where('matId', '==', idMateria),
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
    if (idMateria) {
      obtenerAsistencias();
    }
  }, [currentMonth, idMateria]);

  const [selected, setSelected] = useState('inscrito');

  const [materia, setMateria] = useState(null);
  const [profesor, setProfesor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificacionesActivas, setNotificacionesActivas] = useState(false);
  const notificationIds = useRef([]);
  const [modalOpcionesVisible, setModalOpcionesVisible] = useState(false);
  const [modalConfirmacionVisible, setModalConfirmacionVisible] = useState(false);


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

        const dias = data.creditos === '4' ? ['lunes', 'martes', 'miércoles', 'jueves'] : ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
        const lugaresCollection = collection(db, 'lugares');
        const lugaresSnap = await getDocs(lugaresCollection);
        const mapaLugares = {};
        lugaresSnap.forEach(doc => {
          mapaLugares[doc.id] = doc.data().nombre;
        });

        const horario = dias.map(dia => {
          const minuscula = data.horario[dia] || {};
          const mayuscula = data.horario[dia.charAt(0).toUpperCase() + dia.slice(1)] || {};

          const inicio = minuscula.inicio || mayuscula.inicio || null;
          const fin = minuscula.fin || mayuscula.fin || null;
          const lugarId = minuscula.lugar || mayuscula.lugar || null;
          const lugarNombre = lugarId ? (mapaLugares[lugarId] || lugarId) : 'Sin lugar';

          return {
            dia,
            inicio,
            fin,
            lugar: lugarNombre
          };
        });

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
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 30 }}>Dar de baja la materia</Text>
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
              Al dar de baja <Text style={{ fontWeight: 'bold' }}>aceptas</Text> que tu maestro deje de recibir tu asistencia, con posibilidades de bajar tu calificación de la materia.
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
                onPress={async () => {
                  try {
                    const idMateria = route.params?.idMateria;
                    const uid = usuario.uid;

                    // 1. Remover idMateria de materiasInscritas del usuario
                    const usuarioRef = doc(db, 'usuarios', uid);
                    await updateDoc(usuarioRef, {
                      materiasInscritas: arrayRemove(idMateria),
                    });

                    // 2. Eliminar documento en inscripciones_materia
                    const inscripcionId = `${uid}__${idMateria}`;
                    const inscripcionRef = doc(db, 'inscripciones_materia', inscripcionId);
                    await deleteDoc(inscripcionRef);

                    // 3. Cerrar modal y volver a la pantalla anterior
                    setModalConfirmacionVisible(false);
                    navigation.goBack(); // o navigate('CuentaAlumnoTabs')

                  } catch (error) {
                    console.error('Error al dar de baja la materia:', error);
                    alert('Hubo un error al dar de baja la materia');
                  }
                }}
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
          {materia.portadaUri ? (
            <Image source={{ uri: materia.portadaUri }} style={{ width: '100%', height: 'auto'}} resizeMode="cover" />
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
            <Text style={[styles.textEventos, selected === 'inscrito' && styles.activeTxt, selected === 'verasistencias' && { color: theme.text }]}>Inscrito</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {selected === 'inscrito' ? (
            <View>
              <View style={styles.horario}>
                <Text style={[styles.textHorario, { color: theme.text }]}>Horario</Text>
              </View>
              <View style={styles.horarioContent}>
                {(() => {
                  const rows = [];
                  for (let i = 0; i < materia.horario.length; i += 2) {
                    rows.push(
                      <View key={i} style={styles.contentRow}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                        </ScrollView>
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

export default MateriaAlumno;