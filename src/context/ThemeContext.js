import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = isDarkMode
    ? {
        mode: 'dark',
        background: '#121212',
        text: '#ffffff',
        primary: '#BB86FC',
        card: '#1E1E1E',
      }
    : {
        mode: 'light',
        background: '#ffffff',
        text: '#000000',
        primary: '#49225B',
        card: '#f5f5f5',
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
