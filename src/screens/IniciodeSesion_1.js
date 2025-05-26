import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, TextInput, Alert, Animated } from "react-native";
import { useEffect, useRef, useState } from 'react';
// import microsoft from '../../assets/img/ms_logo.png';
import close from '../../assets/img/x.png';
import usuariosData from '../../json/bd.json';

const IniciodeSesion_1 = ({ modalVisible, setModalVisible, onLogin }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const handleLogin = () => {
    const usuarios = usuariosData.usuarios;

    const encontrado = Object.entries(usuarios).find(([uid, user]) => {
      return user.correo === correo && user.contraseña === password;
    });

    if (encontrado) {
      const [uid, user] = encontrado;
      onLogin({ uid, ...user });
      setModalVisible(false);
      setCorreo('');
      setPassword('');
    } else {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Image source={close} style={styles.closeText} />
            </TouchableOpacity>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
              style={styles.input}
              placeholder="Correo institucional"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.microsoftButton} onPress={handleLogin}>
              {/* <Image source={microsoft} style={styles.microsoftLogo} /> */}
              <Text style={styles.microsoftText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
    height: "45%",
  },
  closeButton: {
    position: "absolute",
    top: 18,
    left: 18,
  },
  closeText: {
    width: 20,
    height: 20,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 15,
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  microsoftButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "center",
  },
  microsoftLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  microsoftText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IniciodeSesion_1;
