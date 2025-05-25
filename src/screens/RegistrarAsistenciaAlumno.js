import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { unlockOrientation, lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';
import Cerca from '../../assets/img/Cerca.png';

const RegistrarAsistenciaAlumno = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { theme, isDarkMode } = useTheme(); // ✅ Detectar modo

  const backgroundColor = isDarkMode ? '#1E1E1E' : '#EF5350';
  const textColor = isDarkMode ? '#E0FFE3' : '#D7FACB';

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
        { backgroundColor },
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
          <Text style={[styles.text1, { color: textColor }]}>¡Estás cerca!</Text>
          <Text style={[styles.text2, { color: textColor }]}>
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  text2: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default RegistrarAsistenciaAlumno;
