import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const lightTheme = {
    background: '#E0F7FA',
    card: '#FFFFFF',
    text: '#006064',
    subText: '#00796B',
    primary: '#00BCD4',
    switchTrack: '#B2EBF2',
    skillTagBackground: '#B2EBF2',
    skillTextColor: '#006064',
  };

  const darkTheme = {
    background: '#18191A',
    card: '#242526',
    text: '#E4E6EB',
    subText: '#B0B3B8',
    primary: '#2D88FF',
    switchTrack: '#E4E6EB',
    skillTagBackground: '#CC00FF',
    skillTextColor: '#FFFFFF',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
