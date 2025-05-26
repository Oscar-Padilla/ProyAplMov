import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';

// 📦 Imagen local
import portadaLocal from '../../assets/img/Materia1.png';

const SubirImagenLocal = () => {
  const [subiendo, setSubiendo] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { idMateria } = route.params;

  const subirImagen = async () => {
    setSubiendo(true);
    try {
      const asset = Asset.fromModule(portadaLocal);
      await asset.downloadAsync();
      const response = await fetch(asset.localUri || asset.uri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `portadas/${idMateria}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, 'materias', idMateria), {
        portadaUri: downloadURL,
      });

      alert('✅ Imagen subida y portadaUri actualizado');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Error al subir imagen:', error);
      alert('Ocurrió un error al subir la imagen.');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Imagen desde Proyecto</Text>
      <Image source={portadaLocal} style={styles.preview} />

      <TouchableOpacity
        style={[styles.button, subiendo && { backgroundColor: '#999' }]}
        onPress={subirImagen}
        disabled={subiendo}
      >
        {subiendo ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Subir Imagen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#49225B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SubirImagenLocal;
