import { View, Text, TouchableOpacity, StyleSheet, Switch, Modal } from "react-native";
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

  const [modalContactoVisible, setModalContactoVisible] = useState(false);

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Configuración</Text>
        <View style={styles.forms}>
          <Text style={styles.idiomaTitle}>Idioma</Text>
          <TouchableOpacity onPress={() => setSelectedLanguage('es-MX')}>
            <Text style={styles.idiomaText}>Español (México)</Text>
            <Text style={styles.idiomaSubText}>Latinoamericano</Text>
            {selectedLanguage === 'es-MX' && <FontAwesome5 name="check" size={24} color="black" style={styles.selectedText} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLanguage('en-US')}>
            <Text style={styles.idiomaText}>Inglés (Estados Unidos)</Text>
            <Text style={styles.idiomaSubText}>Estados Unidos</Text>
            {selectedLanguage === 'en-US' && <FontAwesome5 name="check" size={24} color="black" style={styles.selectedText} />}
          </TouchableOpacity>

          <Text style={styles.idiomaTitle}>Aspecto</Text>
          <Text style={styles.aspectoText}>{isDarkMode ? 'Oscuro' : 'Claro'}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: '#767577', true: '#49225B' }}
            onValueChange={toggleSwitch}
            value={isDarkMode}
          />
        </View>

        <TouchableOpacity style={styles.contactBtn} onPress={() => setModalContactoVisible(true)}>
          <Text style={styles.contactBtnText}>Contacto</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Contacto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalContactoVisible}
        onRequestClose={() => setModalContactoVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.contactModal}>
            <Text style={styles.contactTitle}>Contacto</Text>
            <Text style={styles.contactContent}>
              Si tienes dudas o comentarios, contáctanos a:
            </Text>
            <Text style={styles.contactEmail}>soporte@proxiclass.com</Text>
            <TouchableOpacity onPress={() => setModalContactoVisible(false)} style={styles.closeModalBtn}>
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    height: "88%",
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
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.32
  },
  idiomaText: {
    color: '#191919',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  idiomaSubText: {
    color: '#a5a5a5',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.32,
    marginBottom: 12
  },
  aspectoText: {
    color: '#191919',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  switch: {
    alignSelf: 'flex-end',
    marginTop: -26,
  },
  selectedText: {
    position: "absolute",
    right: 10,
  },
  contactBtn: {
    display: 'flex',
    alignSelf: 'center',
    backgroundColor: '#49225B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginTop: 10,
  },
  contactBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  contactModal: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  contactContent: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  contactEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#49225B',
    marginBottom: 20,
  },
  closeModalBtn: {
    backgroundColor: '#49225B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeModalText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default Settings;
