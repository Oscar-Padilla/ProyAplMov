import { Button, Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import logo from '../../assets/img/Logo.png';

const IniciodeSesion = ({setModalVisible}) => {
  return (
    <View style={styles.todo}>
        <View style={styles.container}>
            <View style={styles.logo}>
                <Image source={logo}/>
                <Text style={styles.text}>Bienvenido a ProxiClass</Text>
            </View>
            <View style={styles.forms}>
                <View style={styles.boton}>
                    <TouchableOpacity style={styles.btnsesion} onPress={() => setModalVisible(true)}>
                        <Text style={styles.textbtnsesion}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.boton}>
                    <TouchableOpacity style={styles.btnregis}>
                        <Text style={styles.textbtnregis}>Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.terms}>
                <View style={styles.termframe}>
                    <Text style={styles.textterms}>
                        Continuando, aceptas los<Text style={{fontWeight: '600'}}> Términos de Servicio</Text> de ProxiClass y
                    </Text>
                </View>
                <View style={styles.termframe}>
                    <Text style={styles.textterms}>
                        reconoces que has leído nuestra<Text style={{fontWeight: '600'}}> Política de Privacidad</Text>
                    </Text>
                </View>
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
    },
    container: {
      display: 'flex',
      width: 375,
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    },
    logo: {
      display: 'flex',
      paddingVertical: 9,
      paddingHorizontal: 8,
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      alignSelf: 'stretch'
    },
    forms: {
      display: 'flex',
      paddingVertical: 0,
      paddingHorizontal: 16,
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 10,
      alignSelf: 'stretch'
    },
    terms: {
      display: 'flex',
      paddingVertical: 0,
      paddingHorizontal: 0,
      // paddingLeft: 10,
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      alignSelf: 'stretch'
    },
    text: {
      color: '#191919',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontSize: 28,
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 32,
      alignSelf: 'stretch'
    },
    boton: {
      display: 'flex',
      alignItems: 'flex-start',
      alignSelf: 'stretch'
    },
    btnsesion: {
      backgroundColor: '#49225B',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      alignSelf: 'center',
    },
    btnregis: {
      backgroundColor: '#F1F1F1',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
      width: '90%',
      alignSelf: 'center',
    },
    textbtnsesion: {
      color: '#F1F1F1',
      fontFamily: 'Roboto',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 24,
    },
    textbtnregis: {
      color: '#191919',
      fontFamily: 'Roboto',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 24,
    },
    textterms: {
      color: '#191919',
      fontFamily: 'Roboto',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 15,
    },
    termframe: {
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }
  });


export default IniciodeSesion;