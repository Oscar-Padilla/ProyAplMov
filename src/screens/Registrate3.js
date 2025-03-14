<<<<<<< HEAD
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState} from 'react';


const Registrate3 = ({navigation}) => {
  const [text, setText] = useState("");
  const paginaActual = 4;
  const totalPaginas = 4;
  const progreso = paginaActual / totalPaginas;
  
  return (
    <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => navigation.goBack("Registrate2")} style={styles.closeButton}>
              <Image source={left} style={styles.closeText} />
          </TouchableOpacity>
          <Text style={styles.title}>Regístrate</Text>
          <View style={styles.forms}>
            <Text style={styles.correoText}>¿Cuál es tu apellido?</Text>
            <TextInput 
              style={styles.inputCorreo}
              placeholder="Apellido"
              placeholderTextColor={'#A5A5A5'}
              value={text}
              onChangeText={setText}
            />
          </View>
          <View style={styles.bottomThing}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground} />
              <View style={[styles.progressBarFill, {width: `${progreso * 100}%`}]}/>
              <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("HomeMaestroStaff")} style={styles.btnNext} >
                <Text style={styles.text}>Siguiente</Text>
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
    height: "88%", // Ajusta la altura del modal
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
  inputCorreo:{
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

=======
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState} from 'react';


const Registrate3 = ({navigation}) => {
  const [text, setText] = useState("");
  const paginaActual = 4;
  const totalPaginas = 4;
  const progreso = paginaActual / totalPaginas;
  
  return (
    <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => navigation.goBack("Registrate2")} style={styles.closeButton}>
              <Image source={left} style={styles.closeText} />
          </TouchableOpacity>
          <Text style={styles.title}>Regístrate</Text>
          <View style={styles.forms}>
            <Text style={styles.correoText}>¿Cuál es tu apellido?</Text>
            <TextInput 
              style={styles.inputCorreo}
              placeholder="Apellido"
              placeholderTextColor={'#A5A5A5'}
              value={text}
              onChangeText={setText}
            />
          </View>
          <View style={styles.bottomThing}>
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground} />
              <View style={[styles.progressBarFill, {width: `${progreso * 100}%`}]}/>
              <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("HomeMaestroStaff")} style={styles.btnNext} >
                <Text style={styles.text}>Siguiente</Text>
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
    height: "88%", // Ajusta la altura del modal
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
  inputCorreo:{
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

>>>>>>> 4ad861fa10dddbe96594ab755b81467c52db9bae
export default Registrate3;