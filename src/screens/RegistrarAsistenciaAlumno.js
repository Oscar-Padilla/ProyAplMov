import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { unlockOrientation, lockPortrait } from '../../assets/utils/orientationUtils';
import Cerca from '../../assets/img/Cerca.png'; // Ajusta según tu estructura

const RegistrarAsistenciaAlumno = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Controlar orientación solo mientras esta pantalla está visible
  useFocusEffect(
    useCallback(() => {
      unlockOrientation();
      return () => {
        lockPortrait();
      };
    }, [])
  );

  return (
    <View
      style={[
        styles.container,
        isLandscape && styles.containerLandscape,
      ]}
    >
      <View
        style={[
          styles.contentWrapper,
          isLandscape && styles.contentWrapperLandscape,
        ]}
      >
        <Image
          source={Cerca}
          style={[
            styles.cerca,
            isLandscape && styles.cercaLandscape,
          ]}
        />

        <View
          style={[
            styles.rightContent,
            isLandscape && styles.rightContentLandscape,
          ]}
        >
          <Text style={styles.text1}>¡Estás cerca!</Text>
          <Text style={styles.text2}>
            Acércate a la ubicación para registrar tu asistencia
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EF5350',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  containerLandscape: {
    paddingHorizontal: 40,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapperLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  cerca: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  cercaLandscape: {
    marginBottom: 0,
    marginRight: 20,
  },
  rightContent: {
    alignItems: 'center',
  },
  rightContentLandscape: {
    alignItems: 'flex-start',
    flex: 1,
  },
  text1: {
    color: '#D7FACB',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  text2: {
    color: '#D7FACB',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default RegistrarAsistenciaAlumno;
