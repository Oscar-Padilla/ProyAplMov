import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Modal, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';

import materia1 from '../../assets/img/Materia1.png';
import materia2 from '../../assets/img/Materia2.png';
import evento1 from '../../assets/img/Evento1.png';
import evento2 from '../../assets/img/Evento2.png';

const CuentaAlumno = () => {
  const { theme } = useTheme();
  const { usuario } = useUser();
  const [selected, setSelected] = useState('materias');
  const navigation = useNavigation();

  const [materias, setMaterias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [asistenciaStats, setAsistenciaStats] = useState({ porcentaje: 0, total: 0, asistencias: 0 });
  const [cargandoAsistencia, setCargandoAsistencia] = useState(false);

  useEffect(() => {
    lockPortrait();
    if (usuario) {
      fetchMaterias();
      fetchEventos();
    }
  }, [usuario]);

  const fetchMaterias = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'materias'));
      const filtradas = snapshot.docs
        .filter(doc => usuario.materiasInscritas?.includes(doc.id))
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(filtradas);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    } finally {
      setLoadingMaterias(false);
    }
  };

  const fetchEventos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'eventos'));
      const filtrados = snapshot.docs
        .filter(doc => usuario.eventosInscritos?.includes(doc.id))
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(filtrados);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoadingEventos(false);
    }
  };

  const abrirModalAsistencia = async () => {
    setModalVisible(true);
    setCargandoAsistencia(true);
    try {
      const [materiaSnap, eventoSnap] = await Promise.all([
        getDocs(query(collection(db, 'asistencias_materia'), where('uid', '==', usuario.uid))),
        getDocs(query(collection(db, 'asistencias_evento'), where('uid', '==', usuario.uid)))
      ]);

      const totalMaterias = materiaSnap.size;
      const totalEventos = eventoSnap.size;

      const presentesMaterias = materiaSnap.docs.filter(doc => doc.data().presente).length;
      const presentesEventos = eventoSnap.docs.filter(doc => doc.data().presente).length;

      const total = totalMaterias + totalEventos;
      const asistencias = presentesMaterias + presentesEventos;

      const porcentaje = total > 0 ? (asistencias / total) : 0;

      setAsistenciaStats({ porcentaje, total, asistencias });
    } catch (error) {
      console.error('Error cargando asistencia:', error);
    } finally {
      setCargandoAsistencia(false);
    }
  };

  const getFraseMotivadora = (porcentaje) => {
    if (porcentaje >= 0.9) return "¡Excelente compromiso! 🔥";
    if (porcentaje >= 0.7) return "¡Muy bien! Sigue así 💪";
    if (porcentaje >= 0.5) return "Vas por buen camino 🌟";
    return "¡Tú puedes mejorar! No te rindas 💡";
  };

  const BarraProgreso = ({ progreso }) => {
    return (
      <View style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 10, height: 10 }}>
        <View style={{ width: `${(progreso || 0.0001) * 100}%`, backgroundColor: '#6A1B9A', height: 10, borderRadius: 5 }} />
      </View>
    );
  };

  const nombreCompleto = usuario?.nombre && usuario?.apellido
    ? `${usuario.nombre} ${usuario.apellido}`
    : usuario?.nombre || 'Usuario';

  const iniciales = usuario?.nombre && usuario?.apellido
    ? `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`
    : 'US';

  const totalMaterias = usuario?.materiasInscritas?.length || 0;
  const totalEventos = usuario?.eventosInscritos?.length || 0;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileBg, { backgroundColor: theme.primary }]}>
          <View style={[styles.profileIcn, { borderColor: theme.background }]}>
            <Text style={[styles.textProfile, { color: '#fff' }]}>{iniciales}</Text>
          </View>
        </View>

        <View style={styles.infoProfile}>
          <Text style={[styles.textName, { color: theme.text }]}>{nombreCompleto}</Text>
          <Text style={[styles.textStats, { color: theme.text }]}>{totalMaterias} materias • {totalEventos} eventos</Text>
          <Text style={[styles.textEmail, { color: theme.text }]}>{usuario?.correo || 'correo@institucional.com'}</Text>
          <Text style={[styles.textRole, { color: theme.text }]}>{usuario?.rol || 'Estudiante'} • {usuario?.carrera || 'Carrera no especificada'}</Text>
        </View>

        <View style={styles.RatingAsistencias}>
          <TouchableOpacity style={[styles.btnRating, { backgroundColor: theme.primary }]} onPress={abrirModalAsistencia}>
            <Text style={styles.textRating}>Rating de asistencias</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Selector}>
          <TouchableOpacity
            style={[styles.btnMaterias, selected === 'materias' && styles.activeBtn, selected === 'materias' && { backgroundColor: theme.primary }]}
            onPress={() => setSelected('materias')}
          >
            <Text style={[styles.textMaterias, selected === 'materias' && styles.activeTxt, selected === 'eventos' && { color: theme.text }]}>Materias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnEventos, selected === 'eventos' && styles.activeBtn, selected === 'eventos' && { backgroundColor: theme.primary }]}
            onPress={() => setSelected('eventos')}
          >
            <Text style={[styles.textEventos, selected === 'eventos' && styles.activeTxt, selected === 'materias' && { color: theme.text }]}>Eventos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {selected === 'materias' ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dataMaterias}>
                {loadingMaterias ? (
                  [1, 2].map((_, i) => (
                    <View key={i} style={[styles.materia, { backgroundColor: '#ccc', borderRadius: 30 }]} />
                  ))
                ) : materias.length === 0 ? (
                  <Text style={{ color: theme.text, padding: 20 }}>No estás inscrito en ninguna materia aún.</Text>
                ) : (
                  materias.map((materia, index) => (
                    <TouchableOpacity key={materia.id} onPress={() => navigation.navigate('MateriaAlumno', { idMateria: materia.id })}>
                      <View style={styles.materia}>
                        <ImageBackground
                          source={index % 2 === 0 ? materia1 : materia2}
                          style={styles.imgMateria}
                        >
                          <View style={styles.overlaymateria}>
                            <Text style={styles.textGrupo}>{materia.grupo}</Text>
                            <Text style={styles.textMateria}>{materia.nombre}</Text>
                          </View>
                        </ImageBackground>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dataMaterias}>
                {loadingEventos ? (
                  [1, 2].map((_, i) => (
                    <View key={i} style={[styles.materia, { backgroundColor: '#ddd', borderRadius: 30 }]} />
                  ))
                ) : eventos.length === 0 ? (
                  <Text style={{ color: theme.text, padding: 20 }}>No estás inscrito en ningún evento aún.</Text>
                  ) : (
                    eventos.map((evento, index) => (
                      <TouchableOpacity
                        key={evento.id}
                        onPress={() => navigation.navigate(
                          usuario.rol === 'Profesor' ? 'EventoMaestro' : 'EventoAlumno',
                          { idEvento: evento.id }
                        )}
                      >
                        <View key={evento.id} style={styles.materia}>
                          <ImageBackground source={index % 2 === 0 ? evento1 : evento2} style={styles.imgMateria}>
                            <View style={styles.overlaymateria}>
                              <Text style={styles.textMateria}>{evento.nombre}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
              </View>
            </ScrollView>
          )}

        </View>

      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[modalStyles.overlay, { backgroundColor: theme.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)' }]}>
          <View style={[modalStyles.container, { backgroundColor: theme.card || '#fff' }]}>
            {cargandoAsistencia ? (
              <Text style={[modalStyles.text, { color: theme.text }]}>Cargando estadísticas...</Text>
            ) : (
              <>
                <Text style={[modalStyles.porcentaje, { color: theme.primary }]}>
                  {Math.round(asistenciaStats.porcentaje * 100)}% de asistencia
                </Text>
                <BarraProgreso progreso={asistenciaStats.porcentaje} />
                <Text style={[modalStyles.text, { color: theme.text }]}>
                  Has asistido a {asistenciaStats.asistencias} de {asistenciaStats.total} sesiones
                </Text>
                <Text style={[modalStyles.mensaje, { color: theme.primary }]}>{getFraseMotivadora(asistenciaStats.porcentaje)}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[modalStyles.cerrarBtn, { backgroundColor: theme.primary }]}>
                  <Text style={modalStyles.cerrarText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  profileIcn: {
    display: 'flex',
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#52355E',
    top: 150,
    alignSelf: 'center',
    borderColor: '#fff',
    borderWidth: 2
  },
  textProfile: {
    position: 'flex',
    width: 'auto',
    height: 120,
    color: '#fff',
    fontSize: 36,
    fontFamily: 'Roboto',
    fontWeight: '600',
    textAlign: 'center',
    top: 30,
  },
  infoProfile: {
    display: 'flex',
    width: 'auto',
    height: 'auto',
    top: 30,
    alignSelf: 'center',
    gap: 7,
    paddingLeft: 24,
    paddingRight: 24,
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
    lineHeight: 20
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
    width: 220,
    height: 60,
    alignSelf: 'center',
    top: 35,
  },
  btnRating: {
    display: 'flex',
    width: 220,
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
    fontWeight: '600',
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
  }
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  porcentaje: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#6A1B9A',
    textAlign: 'center',
  },
  cerrarBtn: {
    marginTop: 20,
    backgroundColor: '#6A1B9A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
  },
  cerrarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CuentaAlumno;