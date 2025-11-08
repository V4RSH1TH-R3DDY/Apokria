import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Window.css';

export interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus: () => void;
  zIndex: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  dockIconPosition?: { x: number; y: number };
}

export default function Window({
  id,
  title,
  children,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 900, height: 600 },
  dockIconPosition
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      onFocus();
    }
  };

  // Resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
      if (isResizing) {
        const newWidth = e.clientX - position.x;
        const newHeight = e.clientY - position.y;
        setSize({
          width: Math.max(300, newWidth),
          height: Math.max(200, newHeight)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position]);

  return (
    <motion.div
      ref={windowRef}
      className="window"
      initial={
        dockIconPosition
          ? {
              left: dockIconPosition.x,
              top: dockIconPosition.y,
              width: 50,
              height: 50,
              opacity: 0,
              scale: 0.1
            }
          : {
              opacity: 0,
              scale: 0.95
            }
      }
      animate={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        opacity: 1,
        scale: 1
      }}
      exit={
        dockIconPosition
          ? {
              left: dockIconPosition.x,
              top: dockIconPosition.y,
              width: 50,
              height: 50,
              opacity: 0,
              scale: 0.1
            }
          : {
              opacity: 0,
              scale: 0.95
            }
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
      style={{
        zIndex
      }}
      onMouseDown={onFocus}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-controls">
          <button className="window-btn close" onClick={onClose} />
          <button className="window-btn minimize" onClick={onMinimize} />
          <button className="window-btn maximize" />
        </div>
        <div className="window-title">{title}</div>
      </div>
      <div className="window-content">{children}</div>
      <div className="window-resize-handle" onMouseDown={handleResizeMouseDown} />
    </motion.div>
  );
}
