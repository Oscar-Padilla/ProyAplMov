import { Text, View, StyleSheet, TextInput, ScrollView, ImageBackground, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

import materia1 from '../../assets/img/Materia1.png';
import materia2 from '../../assets/img/Materia2.png';
import evento1 from '../../assets/img/Evento1.png';
import evento2 from '../../assets/img/Evento2.png';

const HomeAlumno = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    lockPortrait();
  }, []);

  const [text, setText] = useState("");

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <View style={[styles.search, { backgroundColor: theme.background }]}>
        <View style={[styles.searchInput, { backgroundColor: theme.mode === 'dark' ? '#2a2a2a' : '#f1f1f1' }]}>
          <TextInput
            style={[styles.inputBusqueda, { color: theme.text }]}
            placeholder="Busca lo que necesites"
            placeholderTextColor={theme.mode === 'dark' ? '#ccc' : '#A5A5A5'}
            value={text}
            onChangeText={setText}
          />
          <FontAwesome name="search" size={24} color={theme.mode === 'dark' ? '#ccc' : 'gray'} style={styles.lupa} />
        </View>
      </View>

      <View style={styles.Title}>
        <View style={styles.textTitle}>
          <Text style={[styles.textFecha, { color: theme.text }]}>Abr 16, 2025</Text>
          <Text style={[styles.textTitulo, { color: theme.text }]}>La inspiración de hoy</Text>
        </View>
      </View>

      {/* Container Materias */}
      <View style={styles.containerMaterias}>
        <View style={styles.materias}>
          <Text style={[styles.textMaterias, { color: theme.text }]}>Materias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dataMaterias}>
              <TouchableOpacity onPress={() => navigation.navigate('MateriaAlumno')}>
                <View style={styles.materia}>
                  <ImageBackground source={materia1} style={styles.imgMateria}>
                    <View style={styles.overlaymateria}>
                      <Text style={styles.textGrupo}>TC1 2025A</Text>
                      <Text style={styles.textMateria}>Aplicaciones Móviles Multiplataforma</Text>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
              <View style={styles.materia}>
                <ImageBackground source={materia2} style={styles.imgMateria}>
                  <View style={styles.overlaymateria}>
                    <Text style={styles.textGrupo}>TC1 2025A</Text>
                    <Text style={styles.textMateria}>Seguridad en las Aplicaciones de Software</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Container Eventos */}
      <View style={styles.containerMaterias}>
        <View style={styles.materias}>
          <Text style={[styles.textMaterias, { color: theme.text }]}>Eventos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dataMaterias}>
              <View style={styles.materia}>
                <ImageBackground source={evento1} style={styles.imgMateria}>
                  <View style={styles.overlaymateria}>
                    <Text style={styles.textMateria}>Expo vinculación 2025</Text>
                  </View>
                </ImageBackground>
              </View>
              <View style={styles.materia}>
                <ImageBackground source={evento2} style={styles.imgMateria}>
                  <View style={styles.overlaymateria}>
                    <Text style={styles.textMateria}>Jornada Ambiental para crédito complementario</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingTop: 25,
  },
  search: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  inputBusqueda: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  lupa: {
    width: 28,
    height: 28,
  },
  Title: {
    height: 81,
    marginTop: 5,
  },
  textTitle: {
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },
  textFecha: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'center',
  },
  textTitulo: {
    fontFamily: 'Roboto',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
  },
  containerMaterias: {
    height: 266,
    marginTop: 8,
  },
  materias: {
    alignItems: 'center',
    gap: 12,
  },
  textMaterias: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
  },
  dataMaterias: {
    flexDirection: 'row',
    paddingLeft: 8,
    gap: 10,
  },
  materia: {
    width: 324,
    height: 234,
    justifyContent: 'flex-end',
  },
  imgMateria: {
    width: 324,
    height: 234,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  overlaymateria: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textGrupo: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  textMateria: {
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    lineHeight: 28,
    paddingBottom: 12,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});

export default HomeAlumno;
