import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const Registrate3 = () => {
  const [apellido, setApellido] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { correo, contraseña, nombre } = route.params || {};

  const paginaActual = 4;
  const totalPaginas = 4;
  const progreso = paginaActual / totalPaginas;

  // 👇 Función para detectar el rol según el correo
  const detectarRolPorCorreo = (correo) => {
    const dominio = "@aguascalientes.tecnm.mx";

    if (correo.endsWith(dominio)) {
      const parteUsuario = correo.split("@")[0];
      return /^[0-9]+$/.test(parteUsuario) ? "Estudiante" : "Profesor";
    }
    return "Externo";
  };

  const registrarNuevoUsuario = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'usuarios'));

      const uids = snapshot.docs
        .map(d => d.id)
        .filter(id => id.startsWith('uid_alumno_'))
        .map(id => parseInt(id.replace('uid_alumno_', '')))
        .filter(n => !isNaN(n));

      const siguienteNumero = uids.length > 0 ? Math.max(...uids) + 1 : 1;
      const nuevoUID = `uid_alumno_${siguienteNumero}`;

      const rol = detectarRolPorCorreo(correo); // 👈 Determina el rol aquí

      const nuevoUsuario = {
        correo,
        contraseña,
        nombre,
        apellido,
        rol,
      };

      await setDoc(doc(db, 'usuarios', nuevoUID), nuevoUsuario);

      navigation.reset({
        index: 0,
        routes: [{ name: 'IniciodeSesion' }],
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Image source={left} style={styles.closeText} />
        </TouchableOpacity>
        <Text style={styles.title}>Regístrate</Text>
        <View style={styles.forms}>
          <Text style={styles.correoText}>¿Cuál es tu apellido?</Text>
          <TextInput
            style={styles.inputCorreo}
            placeholder="Apellido"
            placeholderTextColor={'#A5A5A5'}
            value={apellido}
            onChangeText={setApellido}
          />
        </View>
        <View style={styles.bottomThing}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground} />
            <View style={[styles.progressBarFill, { width: `${progreso * 100}%` }]} />
            <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
          </View>
          <TouchableOpacity onPress={registrarNuevoUsuario} style={styles.btnNext}>
            <Text style={styles.text}>Finalizar</Text>
          </TouchableOpacity>
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
    height: "88%",
  },
  closeButton: {
    position: "absolute",
    top: 18,
    left: 18,
  },
  closeText: {
    fontSize: 22,
    color: "black",
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  forms: {
    width: '100%',
    marginBottom: 20,
  },
  inputCorreo: {
    fontSize: 28,
    paddingVertical: 8,
  },
  correoText: {
    fontFamily: 'Roboto',
    fontSize: 36,
    fontWeight: "600",
  },
  btnNext: {
    backgroundColor: '#49225B',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 20,
  },
  bottomThing: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  progressContainer: {
    width: '100%',
    height: 20,
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#E9E9E9',
    borderRadius: 5,
    position: 'absolute',
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#191919',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: -45,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191919',
  },
});

export default Registrate3;
