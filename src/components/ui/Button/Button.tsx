// src/components/ui/Button/Button.tsx

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Стили для вариантов
  const variantStyles = {
    primary: {
      background: '#1976D2',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: '#1976D2',
      border: '2px solid #1976D2',
    },
    outline: {
      background: 'transparent',
      color: '#1976D2',
      border: '2px solid #1976D2',
    },
    danger: {
      background: '#F44336',
      color: 'white',
      border: 'none',
    },
    success: {
      background: '#4CAF50',
      color: 'white',
      border: 'none',
    },
  };

  // Размеры
  const sizeStyles = {
    sm: { padding: '6px 16px', fontSize: '14px' },
    md: { padding: '10px 24px', fontSize: '16px' },
    lg: { padding: '14px 32px', fontSize: '18px' },
    xl: { padding: '18px 40px', fontSize: '20px' },
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;