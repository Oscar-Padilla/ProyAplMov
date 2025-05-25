import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Modal } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ navigation }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();

  useEffect(() => {
    lockPortrait();
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Configuración</Text>
        <View style={styles.forms}>
          <Text style={[styles.idiomaTitle, { color: theme.text }]}>Idioma</Text>
          <TouchableOpacity onPress={() => setSelectedLanguage('es-MX')}>
            <Text style={[styles.idiomaText, { color: theme.text }]}>Español (México)</Text>
            <Text style={styles.idiomaSubText}>Latinoamericano</Text>
            {selectedLanguage === 'es-MX' && <FontAwesome5 name="check" size={24} color={theme.text} style={styles.selectedText} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedLanguage('en-US')}>
            <Text style={[styles.idiomaText, { color: theme.text }]}>Inglés (Estados Unidos)</Text>
            <Text style={styles.idiomaSubText}>Estados Unidos</Text>
            {selectedLanguage === 'en-US' && <FontAwesome5 name="check" size={24} color={theme.text} style={styles.selectedText} />}
          </TouchableOpacity>

          <Text style={[styles.idiomaTitle, { color: theme.text }]}>Aspecto</Text>
          <Text style={[styles.aspectoText, { color: theme.text }]}>{isDarkMode ? 'Oscuro' : 'Claro'}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: '#767577', true: '#49225B' }}
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>

        <TouchableOpacity style={styles.contactBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.contactBtnText}>Contacto</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Modal embebido de contacto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.contactModal, { backgroundColor: theme.card }]}>
            <Text style={[styles.contactTitle, { color: theme.text }]}>Contacto</Text>
            <Text style={[styles.contactContent, { color: theme.text }]}>
              Si tienes dudas o comentarios, contáctanos a:
            </Text>
            <Text style={[styles.contactEmail, { color: theme.primary }]}>soporte@proxiclass.com</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
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
  },
  modalContainer: {
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
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.32
  },
  idiomaText: {
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
    marginBottom: 20,
  },
  closeModalBtn: {
    backgroundColor: '#49225B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  closeModalText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default Settings;
