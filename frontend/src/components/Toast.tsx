import { motion } from "framer-motion";

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.9)',
          border: 'rgba(74, 222, 128, 0.5)',
          icon: '✓'
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.9)',
          border: 'rgba(248, 113, 113, 0.5)',
          icon: '✕'
        };
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.9)',
          border: 'rgba(96, 165, 250, 0.5)',
          icon: 'ℹ'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: styles.bg,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${styles.border}`,
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        minWidth: '300px',
        maxWidth: '500px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '20px' }}>{styles.icon}</div>
        <div style={{ flex: 1, color: 'white', fontSize: '14px', fontWeight: 500 }}>
          {message}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '6px',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: '16px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}
