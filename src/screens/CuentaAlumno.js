import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import materia1 from '../../assets/img/Materia1.png';
import materia2 from '../../assets/img/Materia2.png';
import evento1 from '../../assets/img/Evento1.png';
import evento2 from '../../assets/img/Evento2.png';

const CuentaAlumno = () => {
  const studentData = {
    name: "Fulanito Mengano",
    email: "20151714@aguascalientes.tecnm.mx",
    career: "Ingeniería En Tecnologías De La Información Y Comunicaciones",
    role: "Estudiante",
    stats: {
      materias: 2,
      eventos: 2
    },
    materias: [
      { id: '1', name: 'Aplicaciones Móviles Multiplataforma', group: 'TC1 2025A' },
      { id: '2', name: 'Seguridad en las Aplicaciones de Software', group: 'TC1 2025A' }
    ],
    eventos: [
      { id: '1', name: 'Expo Vinculación 2025' },
      { id: '2', name: 'Jornada Ambiental para crédito complementario' }
    ]
  };
  const [selected, setSelected] = useState('materias');

  return (
    <View style={styles.overlay}>
      <ScrollView vertical={true} style={{ flexDirection: 'cloumn' }} showsVerticalScrollIndicator={false}>
        <View style={styles.profileBg}>
          <View style={styles.profileIcn}>
            <Text style={styles.textProfile}>FM</Text>
          </View>
        </View>
        <View style={styles.infoProfile}>
          <View style={styles.infoName}>
            <Text style={styles.textName}>
              {studentData.name}
            </Text>
          </View>
          <View style={styles.infoStats}>
            <Text style={styles.textStats}>
              {studentData.stats.materias} materias • {studentData.stats.eventos} eventos
            </Text>
          </View>
          <View style={styles.infoEmail}>
            <Text style={styles.textEmail}>
              {studentData.email}
            </Text>
          </View>
          <View style={styles.infoRole}>
            <Text style={styles.textRole}>
              {studentData.role} • {studentData.career}
            </Text>
          </View>
        </View>
        <View style={styles.RatingAsistencias}>
          <TouchableOpacity style={styles.btnRating}>
            <Text style={styles.textRating}>Rating de asistencias</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Selector}>
          <TouchableOpacity style={[styles.btnMaterias, selected === 'materias' && styles.activeBtn]} onPress={() => setSelected('materias')}>
            <Text style={[styles.textMaterias, selected === 'materias' && styles.activeTxt]}>Materias</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnEventos, selected === 'eventos' && styles.activeBtn]} onPress={() => setSelected('eventos')}>
            <Text style={[styles.textEventos, selected === 'eventos' && styles.activeTxt]}>Eventos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {selected === 'materias' ? (
            <ScrollView
              horizontal={true}
              style={{ flexDirection: 'row' }}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.dataMaterias}>
                {studentData.materias.map((materia, index) => (
                  <View key={materia.id} style={styles.materia}>
                    <ImageBackground
                      source={index === 0 ? materia1 : materia2} // puedes mejorar esto con un arreglo de imágenes
                      style={styles.imgMateria}
                    >
                      <View style={styles.overlaymateria}>
                        <Text style={styles.textGrupo}>{materia.group}</Text>
                        <Text style={styles.textMateria}>{materia.name}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            <ScrollView
              horizontal={true}
              style={{ flexDirection: 'row' }}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.dataMaterias}>
                {studentData.eventos.map((evento, index) => (
                  <View key={evento.id} style={styles.materia}>
                    <ImageBackground
                      source={index === 0 ? evento1 : evento2} // igual que arriba, puedes usar un arreglo si hay más
                      style={styles.imgMateria}
                    >
                      <View style={styles.overlaymateria}>
                        <Text style={styles.textMateria}>{evento.name}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
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

export default CuentaAlumno;