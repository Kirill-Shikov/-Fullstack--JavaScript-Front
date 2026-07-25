import React from 'react';
import { Icon } from '../Icon';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  filled?: boolean;
  errorText?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  error = false,
  filled = false,
  errorText = '',
  className = '',
  disabled,
  value,
  ...props
}) => {
  const isFilled = filled || (value !== undefined && value !== '');

  return (
    <div className={styles.wrapper}>
      <div className={`
        ${styles.inputContainer}
        ${error ? styles.error : ''}
        ${isFilled ? styles.filled : ''}
        ${disabled ? styles.disabled : ''}
      `}>
        <input
          className={`${styles.input} ${className}`}
          disabled={disabled}
          value={value}
          {...props}
        />
        {error && (
          <span className={styles.icon}>
            <Icon name="circle-alert" size={18} />
          </span>
        )}
      </div>
      {error && errorText && (
        <span className={styles.errorText}>{errorText}</span>
      )}
    </div>
  );
};