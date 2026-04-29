import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [layout, setLayout] = useState(localStorage.getItem('layout') || 'vertical');
  const [layoutMode, setLayoutMode] = useState(localStorage.getItem('layoutMode') || 'light');
  const [layoutWidth, setLayoutWidth] = useState(localStorage.getItem('layoutWidth') || 'fluid');
  const [layoutPosition, setLayoutPosition] = useState(localStorage.getItem('layoutPosition') || 'fixed');
  const [topbarColor, setTopbarColor] = useState(localStorage.getItem('topbarColor') || 'light');
  const [sidebarSize, setSidebarSize] = useState(localStorage.getItem('sidebarSize') || 'lg');
  const [sidebarColor, setSidebarColor] = useState(localStorage.getItem('sidebarColor') || 'light');
  const [direction, setDirection] = useState(localStorage.getItem('direction') || 'ltr');
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('layout', layout);
    localStorage.setItem('layoutMode', layoutMode);
    localStorage.setItem('layoutWidth', layoutWidth);
    localStorage.setItem('layoutPosition', layoutPosition);
    localStorage.setItem('topbarColor', topbarColor);
    localStorage.setItem('sidebarSize', sidebarSize);
    localStorage.setItem('sidebarColor', sidebarColor);
    localStorage.setItem('direction', direction);
  }, [layout, layoutMode, layoutWidth, layoutPosition, topbarColor, sidebarSize, sidebarColor, direction]);

  const toggleTheme = () => {
    const newMode = layoutMode === 'light' ? 'dark' : 'light';
    setLayoutMode(newMode);
    // Also sync topbar and sidebar colors to match the theme by default
    setTopbarColor(newMode);
    setSidebarColor(newMode);
  };

  const toggleRightSidebar = () => setShowRightSidebar(!showRightSidebar);

  return (
    <ThemeContext.Provider value={{
      layout, setLayout,
      layoutMode, setLayoutMode,
      layoutWidth, setLayoutWidth,
      layoutPosition, setLayoutPosition,
      topbarColor, setTopbarColor,
      sidebarSize, setSidebarSize,
      sidebarColor, setSidebarColor,
      direction, setDirection,
      showRightSidebar, setShowRightSidebar,
      toggleTheme, toggleRightSidebar
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
