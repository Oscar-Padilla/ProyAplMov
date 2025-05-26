import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    // Leer la sesión al iniciar la app
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const data = await AsyncStorage.getItem('@usuario');
                if (data) {
                    setUsuarioState(JSON.parse(data));
                }
            } catch (error) {
                console.error('Error cargando usuario desde AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarUsuario();
    }, []);

    return (
        <UserContext.Provider value={{ usuario, setUsuario, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// 3. Hook para usar el contexto fácilmente
export const useUser = () => useContext(UserContext);
