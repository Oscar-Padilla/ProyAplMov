import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

// Import both images
import Cerca from '../../assets/img/Cerca.png';
import Llegaste from '../../assets/img/Llegaste.png';

// Import orientation utilities (ensure these paths are correct)
import { unlockOrientation, lockPortrait } from '../../assets/utils/orientationUtils';


const RegistrarAsistenciaAlumno = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to know if this screen is focused
  const { width, height } = useWindowDimensions(); // Hook for responsive design
  const isLandscape = width > height;
  const { theme, isDarkMode } = useTheme();

  // State to control which UI is shown
  const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);
  const timeoutRef = useRef(null); // Ref to hold the timeout ID for cleanup

  // Dynamic colors based on state and theme
  const cercaBackgroundColor = '#EF5350'; // Red for "Cerca" state
  const llegadaBackgroundColor = isDarkMode ? '#121212' : '#66BB6A'; // Green for "Llegaste" state
  const textColor = isDarkMode ? '#E0E0E0' : '#FDFDFD';

  // Effect for the 2-second timer and state management
  useEffect(() => {
    // Clear any existing timeout when focus changes or component unmounts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isFocused) {
      // When the screen comes into focus, reset the state to "Cerca"
      // This ensures the process restarts every time the tab is selected
      setAsistenciaRegistrada(false);

      // Start the 2-second timer to transition to "Llegaste" state
      timeoutRef.current = setTimeout(() => {
        setAsistenciaRegistrada(true);
        // No navigation.navigate('RegistrarAsistenciaAlumno1') needed anymore,
        // as the UI changes within this component.
      }, 5000); // 2 seconds
    }

    // Cleanup function: Clear timeout if the screen loses focus or component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isFocused]); // Depend on isFocused to re-run effect when focus changes

  // Effect for orientation locking/unlocking (from RegistrarAsistenciaAlumno1)
  useFocusEffect(
    useCallback(() => {
      // When this screen is focused, unlock orientation
      unlockOrientation();
      return () => {
        // When this screen loses focus, lock orientation back to portrait
        lockPortrait();
      };
    }, [])
  );

  // Conditional rendering based on `asistenciaRegistrada` state
  if (asistenciaRegistrada) {
    // Render "¡Llegaste!" UI
    return (
      <View
        style={[
          styles.container,
          isLandscape && styles.containerLandscape,
          { backgroundColor: llegadaBackgroundColor }, // Use green background
        ]}
      >
        <View
          style={[
            styles.contentWrapper,
            isLandscape && styles.contentWrapperLandscape,
          ]}
        >
          <Image
            source={Llegaste} // "Llegaste" image
            style={[
              styles.imageCommon, // Common image styles
              isLandscape && styles.imageLandscape, // Landscape adjustments
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
  }

  // Default render: "¡Estás cerca!" UI
  return (
    <View style={[styles.container, { backgroundColor: cercaBackgroundColor }]}>
      <Image
        source={Cerca} // "Cerca" image
        style={[
          styles.imageCommon, // Common image styles
          isLandscape && styles.imageLandscape, // Landscape adjustments
        ]}
      />
      <Text style={[styles.text1, { color: textColor }]}>¡Estás cerca!</Text>
      <Text style={[styles.text2, { color: textColor }]}>Acércate a la ubicación para registrar tu asistencia</Text>
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
  // Common styles for both Cerca and Llegaste images
  imageCommon: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  imageLandscape: {
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
