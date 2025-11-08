'use client';
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'framer-motion';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';
import './Dock.css';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: (position?: { x: number; y: number }) => void;
  className?: string;
  isActive?: boolean;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  // Style customization
  backgroundColor?: string;      // Background color (e.g., 'rgba(6, 0, 16, 0.8)')
  borderColor?: string;          // Border color (e.g., '#222')
  position?: {                   // Position controls
    bottom?: string;             // Distance from bottom (e.g., '0.5rem', '20px')
    left?: string;               // Horizontal position (e.g., '50%', '100px')
  };
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (position?: { x: number; y: number }) => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  isActive?: boolean;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  isActive = false
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const handleClick = () => {
    if (onClick && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      onClick({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
  };

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      y: 0,
      height: baseItemSize
    };
    return val - rect.y - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );

  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        position: 'relative'
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={handleClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, {
              isHovered
            })
          : child
      )}
      {isActive && (
        <div 
          style={{
            position: 'absolute',
            right: '-8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'rgba(132, 0, 255, 0.8)',
            boxShadow: '0 0 8px rgba(132, 0, 255, 0.6)'
          }}
        />
      )}
    </motion.div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 10 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ y: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
  backgroundColor = 'rgba(6, 0, 16, 0.8)',  // Default transparent dark
  borderColor = '#222',
  position = { bottom: '0.5rem', left: '50%' }
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );

  const widthRow = useTransform(isHovered, [0, 1], [8, panelHeight]);
  const width = useSpring(widthRow, spring);
  
  const opacityRow = useTransform(isHovered, [0, 1], [0, 1]);
  const opacity = useSpring(opacityRow, spring);

  return (
    <motion.div 
      style={{ width: panelHeight, scrollbarWidth: 'none' }} 
      className="dock-outer-vertical"
      onMouseEnter={() => isHovered.set(1)}
      onMouseLeave={() => {
        isHovered.set(0);
        mouseX.set(Infinity);
      }}
    >
      {/* Expanded dock - always visible */}
      <motion.div
        onMouseMove={({ pageY }) => {
          mouseX.set(pageY);
        }}
        className={`dock-panel-vertical ${className}`}
        style={{ 
          width: panelHeight,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          opacity: 1
        }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            isActive={item.isActive}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
