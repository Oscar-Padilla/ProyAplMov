import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ajusta esta ruta si es diferente

// 1. Crear el contexto
const UserContext = createContext();

// 2. Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [usuario, setUsuarioState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Guardar o borrar sesión en AsyncStorage
    const setUsuario = async (user) => {
        setUsuarioState(user);
        if (user) {
            try {
                await AsyncStorage.setItem('@usuario', JSON.stringify(user));
            } catch (error) {
                console.error('Error guardando usuario en AsyncStorage:', error);
            }
        } else {
            try {
                await AsyncStorage.removeItem('@usuario');
            } catch (error) {
                console.error('Error eliminando usuario de AsyncStorage:', error);
            }
        }
    };

    // Leer la sesión y activar suscripción en tiempo real
    useEffect(() => {
        let unsubscribe = null;

        const cargarUsuario = async () => {
            try {
                const data = await AsyncStorage.getItem('@usuario');
                if (data) {
                    const usuarioGuardado = JSON.parse(data);
                    const uid = usuarioGuardado.uid;

                    // Suscribirse a cambios en Firestore
                    unsubscribe = onSnapshot(doc(db, 'usuarios', uid), (docSnap) => {
                        if (docSnap.exists()) {
                            const datos = docSnap.data();
                            const userActualizado = { ...datos, uid };
                            setUsuarioState(userActualizado);
                            AsyncStorage.setItem('@usuario', JSON.stringify(userActualizado));
                        }
                    });
                }
            } catch (error) {
                console.error('Error cargando usuario desde Firestore:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarUsuario();

        return () => {
            if (unsubscribe) unsubscribe(); // Detener la suscripción cuando se desmonte
        };
    }, []);

    return (
        <UserContext.Provider value={{ usuario, setUsuario, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// 3. Hook para usar el contexto fácilmente
export const useUser = () => useContext(UserContext);
