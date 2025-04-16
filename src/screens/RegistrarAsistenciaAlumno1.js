import { Text, Modal, View, TouchableOpacity, Image, StyleSheet, Animated } from "react-native";
import Llegaste from '../../assets/img/Llegaste.png';
import React, { useEffect, useRef } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const RegistraAsistenciaAlumno1 = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [abrir, setAbrir] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
          setAbrir(true);
        }, [])
      );

        useEffect(() => {
            if (abrir) {
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
        }, [abrir]);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={abrir}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setAbrir(false)} style={styles.closeButton}>
                            <Feather name="x" size={30} color="white" />
                        </TouchableOpacity>
                        <Image source={Llegaste} style={styles.cerca} />
                        <View style={styles.text}>
                            <Text style={styles.text1}>¡Llegaste!</Text>
                            <Text style={styles.text2}>Se registró tu asistencia</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end", // Hace que el modal salga desde abajo
    // backgroundColor: "rgba(0,0,0,0.5)", // Oscurece el fondo
  },
  modalContainer: {
    backgroundColor: "#66BB6A",
    width: "100%",
    borderTopLeftRadius: 30, // Bordes redondeados arriba
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
    height: "80%", // Ajusta la altura del modal
  },
  closeButton: {
    position: "absolute",
    top: 18,
    left: 18,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cerca: {
    marginTop: 50,
  },
  text:{
    display: 'flex',
    marginTop: 100,
    width: 393,
    paddingVertical: 24,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 14,
  },
  text1:{
    width: 393,
    color: '#D7FACB',
    fontFamily: 'Roboto',
    fontSize: 36,
    fontStyle: 'normal',
    fontWeight: 600,
    // lineHeight: 40,
    textAlign: 'center'
  },
  text2:{
    width: 393,
    color: '#D7FACB',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 400,
    // lineHeight: 40,
    textAlign: 'center',
    letterSpacing: -0.5
  },
});

export default RegistraAsistenciaAlumno1;