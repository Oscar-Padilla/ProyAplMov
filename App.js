import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IniciodeSesion from './src/screens/IniciodeSesion';
import IniciodeSesion_1 from './src/screens/IniciodeSesion_1';
import { useState } from 'react';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <IniciodeSesion setModalVisible={setModalVisible}/>
      <IniciodeSesion_1 modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </View>
  );
}