import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { unlockOrientation, lockPortrait } from '../../assets/utils/orientationUtils';
import { useTheme } from '../context/ThemeContext';
import Llegaste from '../../assets/img/Llegaste.png';


const RegistraAsistenciaAlumno1 = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { theme, isDarkMode } = useTheme(); // ✅ Detectar modo

  const backgroundColor = isDarkMode ? '#121212' : '#66BB6A';
  const textColor = isDarkMode ? '#E0E0E0' : '#FDFDFD';

  useFocusEffect(
    useCallback(() => {
      unlockOrientation();
      return () => {
        lockPortrait();
      };
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
          source={Llegaste}
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
          <Text style={[styles.text1, { color: textColor }]}>¡Llegaste!</Text>
          <Text style={[styles.text2, { color: textColor }]}>Se registró tu asistencia</Text>
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

export default RegistraAsistenciaAlumno1;
