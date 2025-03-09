import React from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import left from '../../assets/img/CaretLeft.png';

const Registrate = () => {
  return (
    <View style={styles.container}>
      {/* Botón de regreso */}
      <TouchableOpacity style={styles.backButton} onPress={() => alert("Regresar")}>
        <Image source={left} style={styles.closeText} />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.registerText}>Regístrate</Text>

      {/* Pregunta */}
      <Text style={styles.questionText}>¿Cuál es tu correo?</Text>

      {/* Input de correo */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#B0B0B0"
        keyboardType="email-address"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  registerText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  input: {
    marginTop: 10,
    fontSize: 18,
    borderBottomWidth: 2, // Línea inferior
    borderBottomColor: "red", // Color rojo como en la imagen
    paddingVertical: 8,
    color: "#000",
  },
});

export default Registrate;
