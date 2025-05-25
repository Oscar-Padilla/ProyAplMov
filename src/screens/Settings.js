import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useState, useEffect } from 'react';
import { lockPortrait } from '../../assets/utils/orientationUtils';


const Settings = () => {
  useEffect(() => {
    lockPortrait();
  }, []);


  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleSwitch = () => setIsDarkMode(previousState => !previousState);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Configuración</Text>
        <View style={styles.forms}>
          <Text style={styles.idiomaTitle}>Idioma</Text>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('es-MX')}
          >
            <Text style={styles.idiomaText}>Español (México)</Text>
            <Text style={styles.idiomaSubText}>Latinoamericano</Text>
            {selectedLanguage === 'es-MX' && <FontAwesome5 name="check" size={24} color="black" style={styles.selectedText} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedLanguage('en-US')}
          >
            <Text style={styles.idiomaText}>Inglés (Estados Unidos)</Text>
            <Text style={styles.idiomaSubText}>Estados Unidos</Text>
            {selectedLanguage === 'en-US' && <FontAwesome5 name="check" size={24} color="black" style={styles.selectedText} />}
          </TouchableOpacity>
          <Text style={styles.idiomaTitle}>Aspecto</Text>
          <Text style={styles.aspectoText}>{isDarkMode ? 'Oscuro' : 'Claro'}</Text>
          <Switch style={styles.switch}
            trackColor={{ false: '#767577', true: '#49225B' }}
            onValueChange={toggleSwitch}
            value={isDarkMode}
          />
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
  title: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 20,

  },
  forms: {
    width: '100%',
    marginBottom: 20,
  },
  idiomaTitle: {
    alignSelf: 'stretch',
    color: '#191919',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 20,
    letterSpacing: -0.32
  },
  btnHecho: {
    backgroundColor: '#49225B',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 78,
    height: 44,
    alignSelf: 'center',
    position: "absolute",
    top: 18,
    right: 18,
  },
  text: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 20,
  },
  idiomaText: {
    asignSelf: 'stretch',
    color: '#191919',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  idiomaSubText: {
    asignSelf: 'stretch',
    color: '#a5a5a5',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 20,
    letterSpacing: -0.32,
    marginBottom: 12
  },
  aspectoText: {
    asignSelf: 'stretch',
    color: '#191919',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 600,
    letterSpacing: -0.5,
  },
  switch: {
    alignSelf: 'flex-end',
    marginTop: -26,
  },
  selectedText: {
    position: "absolute",
    right: 10,
  }
});

export default Settings;
