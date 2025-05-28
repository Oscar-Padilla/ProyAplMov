import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { db } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';

import materia1 from '../../assets/img/Materia1.png';
import materia2 from '../../assets/img/Materia2.png';
import evento1 from '../../assets/img/Evento1.png';
import evento2 from '../../assets/img/Evento2.png';

const CuentaMaestro = () => {
  const { theme } = useTheme();
  const { usuario } = useUser();
  const [selected, setSelected] = useState('materias');
  const navigation = useNavigation();

  const [materias, setMaterias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);

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
      const creadas = snapshot.docs
        .filter(doc => doc.data().profesorId === usuario.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setMaterias(creadas);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    } finally {
      setLoadingMaterias(false);
    }
  };

  const fetchEventos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'eventos'));
      const creados = snapshot.docs
        .filter(doc => doc.data().organizadorId === usuario.uid)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setEventos(creados);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoadingEventos(false);
    }
  };

  const nombreCompleto = usuario?.nombre || 'Usuario';
  const iniciales = usuario?.nombre ? usuario.nombre.charAt(0) : 'U';

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <ScrollView vertical showsVerticalScrollIndicator={false}>
        <View style={[styles.profileBg, { backgroundColor: theme.primary }]}>
          <View style={[styles.profileIcn, { borderColor: theme.background }]}>
            <Text style={[styles.textProfile, { color: '#fff' }]}>{iniciales}</Text>
          </View>
        </View>

        <View style={styles.infoProfile}>
          <Text style={[styles.textName, { color: theme.text }]}>{nombreCompleto}</Text>
          <Text style={[styles.textStats, { color: theme.text }]}>
            {materias.length} materias • {eventos.length} eventos
          </Text>
          <Text style={[styles.textEmail, { color: theme.text }]}>{usuario?.correo || 'correo@institucional.com'}</Text>
          <Text style={[styles.textRole, { color: theme.text }]}>{usuario?.rol || 'Profesor'} • {usuario?.departamento || 'Departamento no especificado'}</Text>
        </View>

        <View style={styles.Selector}>
          <TouchableOpacity
            style={[styles.btnMaterias, selected === 'materias' && styles.activeBtn, selected === 'materias' && { backgroundColor: theme.primary }]}
            onPress={() => setSelected('materias')}
          >
            <Text style={[styles.textMaterias, selected === 'materias' && styles.activeTxt]}>Materias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnEventos, selected === 'eventos' && styles.activeBtn, selected === 'eventos' && { backgroundColor: theme.primary }]}
            onPress={() => setSelected('eventos')}
          >
            <Text style={[styles.textEventos, selected === 'eventos' && styles.activeTxt]}>Eventos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {selected === 'materias' ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dataMaterias}>
                {loadingMaterias ? (
                  [1, 2].map((_, i) => <View key={i} style={[styles.materia, { backgroundColor: '#ccc', borderRadius: 30 }]} />)
                ) : materias.length === 0 ? (
                  <Text style={{ color: theme.text, padding: 20 }}>No has creado materias aún.</Text>
                ) : (
                  materias.map((materia, index) => (
                    <TouchableOpacity key={materia.id} onPress={() => navigation.navigate('MateriaMaestro', { idMateria: materia.id })}>
                      {materia.portadaUri ? (
                        <View style={styles.materia}>
                          <ImageBackground
                            source={{ uri: materia.portadaUri }}
                            style={styles.imgMateria}
                            imageStyle={{ borderRadius: 30 }}
                          >
                            <View style={styles.overlaymateria}>
                              <Text style={styles.textGrupo}>{materia.grupo}</Text>
                              <Text style={styles.textMateria}>{materia.nombre}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      ) : (
                        <View style={styles.materia}>
                          <ImageBackground
                            style={[styles.imgMateria, { backgroundColor: '#49225B' }]}
                            imageStyle={{ borderRadius: 30 }}
                          >
                            <View style={styles.overlaymateria}>
                              <Text style={styles.textGrupo}>{materia.grupo}</Text>
                              <Text style={styles.textMateria}>{materia.nombre}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dataMaterias}>
                {loadingEventos ? (
                  [1, 2].map((_, i) => <View key={i} style={[styles.materia, { backgroundColor: '#ddd', borderRadius: 30 }]} />)
                ) : eventos.length === 0 ? (
                  <Text style={{ color: theme.text, padding: 20 }}>No has creado eventos aún.</Text>
                ) : (
                  eventos.map((evento, index) => (
                    <TouchableOpacity key={evento.id} onPress={() => navigation.navigate('EventoMaestro', { idEvento: evento.id })}>
                      {evento.portadaUri ? (
                        <View style={styles.materia}>
                          <ImageBackground
                            source={{ uri: evento.portadaUri }}
                            style={styles.imgMateria}
                            imageStyle={{ borderRadius: 30 }}
                          >
                            <View style={styles.overlaymateria}>
                              <Text style={styles.textMateria}>{evento.nombre}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      ) : (
                        <View style={styles.materia}>
                          <ImageBackground
                            style={[styles.imgMateria, { backgroundColor: '#49225B' }]}
                            imageStyle={{ borderRadius: 30 }}
                          >
                            <View style={styles.overlaymateria}>
                              <Text style={styles.textMateria}>{evento.nombre}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
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

export default CuentaMaestro;