import React, { useState } from 'react';
import { Icon } from '../Icon';
import styles from './PasswordInput.module.css';

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder = 'Введите пароль',
  value,
  onChange,
  error = false,
  errorText = 'вы указали не верный пароль',
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => {
    setShowPassword(!showPassword);
  };

  const isFilled = value !== undefined && value !== '';

  return (
    <div className={styles.wrapper}>
      <div className={`
        ${styles.inputContainer}
        ${error ? styles.error : ''}
        ${isFilled ? styles.filled : ''}
        ${disabled ? styles.disabled : ''}
      `}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
        />

        {error ? (
          <span className={styles.icon}>
            <Icon name="circle-alert" size={18} />
          </span>
        ) : (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={toggleShow}
            tabIndex={-1}
            disabled={disabled}
          >
            <Icon
              name={showPassword ? 'eye' : 'eye-closed'}
              size={22}
               className={styles.eyeIcon}
            />
          </button>
        )}
      </div>

      {error && errorText && (
        <span className={styles.errorText}>{errorText}</span>
      )}
    </div>
  );
};