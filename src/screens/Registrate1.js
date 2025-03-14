<<<<<<< HEAD
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState} from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';


const Registrate = ({navigation}) => {
  const [passw, setPassw] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const paginaActual = 2;
  const totalPaginas = 4;
  const progreso = paginaActual / totalPaginas;
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Registrate")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Regístrate</Text>
                <View style={styles.forms}>
                    <Text style={styles.passwText}>Crea una contraseña</Text>
                    <TextInput 
                    style={styles.inputPassw}
                    placeholder="Contraseña"
                    placeholderTextColor={'#A5A5A5'}
                    value={passw}
                    onChangeText={setPassw}
                    secureTextEntry={!isPasswordVisible}
                    />
                    {passw.length > 0 && (
                        <TouchableOpacity onPress={() => setPassw("")} style={styles.clearButton}>
                            <AntDesign name="closecircle" size={28} color="#CDCDCD" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.checkboxPassw} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <View style={[styles.checkbox, isPasswordVisible && styles.checkboxChecked]} />
                        <Text style={styles.checkboxText}>Mostrar contraseña</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground} />
                    <View style={[styles.progressBarFill, {width: `${progreso * 100}%`}]}/>
                    <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("Registrate2")} style={styles.btnNext} >
                                    <Text style={styles.text}>Siguiente</Text>
                                </TouchableOpacity>
                </View>
                </View>
            </View>
    </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
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
  inputPassw:{
    color: '#191919',
    fontFamily: 'Roboto',
    fontSize: 28,
    paddingVertical: 8,
    letterSpacing: 8,
  },
  passwText: {
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
  checkboxPassw: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#767676',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#191919',
  },
  checkboxText: {
    fontSize: 16,
    color: '#767676',
    fontWeight: '600',
    letterSpacing: -0.32,
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    top: 55,
  },
});

export default Registrate;
=======
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import left from '../../assets/img/CaretLeft.png';
import { useState} from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';


const Registrate = ({navigation}) => {
  const [passw, setPassw] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const paginaActual = 2;
  const totalPaginas = 4;
  const progreso = paginaActual / totalPaginas;
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Registrate")} style={styles.closeButton}>
                    <Image source={left} style={styles.closeText} />
                </TouchableOpacity>
                <Text style={styles.title}>Regístrate</Text>
                <View style={styles.forms}>
                    <Text style={styles.passwText}>Crea una contraseña</Text>
                    <TextInput 
                    style={styles.inputPassw}
                    placeholder="Contraseña"
                    placeholderTextColor={'#A5A5A5'}
                    value={passw}
                    onChangeText={setPassw}
                    secureTextEntry={!isPasswordVisible}
                    />
                    {passw.length > 0 && (
                        <TouchableOpacity onPress={() => setPassw("")} style={styles.clearButton}>
                            <AntDesign name="closecircle" size={28} color="#CDCDCD" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.checkboxPassw} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <View style={[styles.checkbox, isPasswordVisible && styles.checkboxChecked]} />
                        <Text style={styles.checkboxText}>Mostrar contraseña</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomThing}>
                    <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground} />
                    <View style={[styles.progressBarFill, {width: `${progreso * 100}%`}]}/>
                    <Text style={styles.progressText}>{paginaActual} de {totalPaginas}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("Registrate2")} style={styles.btnNext} >
                                    <Text style={styles.text}>Siguiente</Text>
                                </TouchableOpacity>
                </View>
                </View>
            </View>
    </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
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
  inputPassw:{
    color: '#191919',
    fontFamily: 'Roboto',
    fontSize: 28,
    paddingVertical: 8,
    letterSpacing: 8,
  },
  passwText: {
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
  checkboxPassw: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#767676',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#191919',
  },
  checkboxText: {
    fontSize: 16,
    color: '#767676',
    fontWeight: '600',
    letterSpacing: -0.32,
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    top: 55,
  },
});

export default Registrate;
>>>>>>> 4ad861fa10dddbe96594ab755b81467c52db9bae
