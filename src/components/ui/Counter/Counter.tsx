// src/components/ui/Counter/Counter.tsx
import React from 'react';
import { Icon } from '../../../components/ui/Icon';
import styles from './Counter.module.css';

interface CounterProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
    disabled?: boolean;
}

export const Counter: React.FC<CounterProps> = ({
    value,
    onChange,
    min = 0,
    max = 999,
    className = '',
    disabled = false,
}) => {
    const handleDecrease = () => {
        if (!disabled && value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (!disabled && value < max) {
            onChange(value + 1);
        }
    };

    const isMin = value <= min;
    const isMax = value >= max;

    return (
        <div className={`${styles.counterContainer} ${className}`}>
            <button
                className={`${styles.btn} ${styles.minus} ${isMin || disabled ? styles.disabled : styles.active}`}
                onClick={handleDecrease}
                disabled={isMin || disabled}
                type="button"
            >
               <Icon name="minus" size={24} className={styles.iconX} />
            </button>
            <span className={styles.value}>{value}</span>
            <button
                className={`${styles.btn} ${styles.plus} ${isMax || disabled ? styles.disabled : styles.active}`}
                onClick={handleIncrease}
                disabled={isMax || disabled}
                type="button"
            >
              <Icon name="plus" size={24} className={styles.iconX} />
            </button>
        </div>
    );
};