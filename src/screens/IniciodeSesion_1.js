import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from "react-native";
import microsoft from '../../assets/img/ms_logo.png';
import close from '../../assets/img/x.png';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const IniciodeSesion_1 = ({modalVisible, setModalVisible}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Image source={close} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <TouchableOpacity style={styles.microsoftButton}>
                    <Image source={microsoft} 
                        style={styles.microsoftLogo} />
                    <Text style={styles.microsoftText}>Continuar con Microsoft</Text>
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
    justifyContent: "flex-end", // Hace que el modal salga desde abajo
    backgroundColor: "rgba(0,0,0,0.5)", // Oscurece el fondo
  },
  modalContainer: {
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 30, // Bordes redondeados arriba
    borderTopRightRadius: 30,
    padding: 20,
    alignItems: "center",
    height: "25%", // Ajusta la altura del modal
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  microsoftButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 50,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "80%",
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
