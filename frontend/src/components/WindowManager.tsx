import { useState } from 'react';
import Window from './Window';

export interface WindowData {
  id: string;
  title: string;
  content: React.ReactNode;
  dockIconPosition?: { x: number; y: number };
  isMinimized?: boolean;
}

export default function WindowManager() {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);

  const openWindow = (windowData: WindowData) => {
    const existingWindow = windows.find(w => w.id === windowData.id);
    
    if (existingWindow) {
      // If window exists and is minimized, restore it
      if (existingWindow.isMinimized) {
        setWindows(windows.map(w => 
          w.id === windowData.id ? { ...w, isMinimized: false } : w
        ));
        setFocusedWindow(windowData.id);
      } else {
        // If window is already open, minimize it
        setWindows(windows.map(w => 
          w.id === windowData.id ? { ...w, isMinimized: true } : w
        ));
      }
      return;
    }
    
    setWindows([...windows, { ...windowData, isMinimized: false }]);
    setFocusedWindow(windowData.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (focusedWindow === id) {
      setFocusedWindow(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const focusWindow = (id: string) => {
    setFocusedWindow(id);
  };

  const getZIndex = (id: string) => {
    if (id === focusedWindow) return 1000;
    return 100 + windows.findIndex(w => w.id === id);
  };

  return (
    <>
      {windows.map((window, index) => (
        !window.isMinimized && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            zIndex={getZIndex(window.id)}
            initialPosition={{ 
              x: 100 + index * 30, 
              y: 100 + index * 30 
            }}
            dockIconPosition={window.dockIconPosition}
          >
            {window.content}
          </Window>
        )
      ))}
    </>
  );
}

// Export hook to use window manager
export function useWindowManager() {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);

  const openWindow = (windowData: WindowData) => {
    const existingWindow = windows.find(w => w.id === windowData.id);
    
    if (existingWindow) {
      // If window exists and is minimized, restore it
      if (existingWindow.isMinimized) {
        setWindows(windows.map(w => 
          w.id === windowData.id ? { ...w, isMinimized: false } : w
        ));
        setFocusedWindow(windowData.id);
      } else {
        // If window is already open, minimize it
        setWindows(windows.map(w => 
          w.id === windowData.id ? { ...w, isMinimized: true } : w
        ));
      }
      return;
    }
    
    setWindows([...windows, { ...windowData, isMinimized: false }]);
    setFocusedWindow(windowData.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (focusedWindow === id) {
      setFocusedWindow(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
  };

  const focusWindow = (id: string) => {
    setFocusedWindow(id);
  };

  const getZIndex = (id: string) => {
    if (id === focusedWindow) return 1000;
    return 100 + windows.findIndex(w => w.id === id);
  };

  return {
    windows,
    focusedWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    focusWindow,
    getZIndex
  };
}
