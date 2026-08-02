import React from 'react';
import { Icon } from '../Icon';
import { useDateInput } from '../../../hooks/useDateInput';
import styles from './DateInput.module.css';

interface DateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const DateInput: React.FC<DateInputProps> = ({
  value = '',
  onChange,
  placeholder = 'ДД.ММ.ГГГГ',
  disabled = false,
  className = '',
  style,
}) => {
  const {
    isCalendarOpen,
    selectedDate,
    currentDate,
    today,
    setIsCalendarOpen,
    handleChange,
    handleCalendarToggle,
    handleDateSelect,
    handlePrevMonth,
    handleNextMonth,
    formatMonthYear,
    getWeekDay,
    getDaysInMonth,
    getFirstDayOfMonth,
  } = useDateInput(value, onChange);

  // Рендер календаря внутри компонента
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        day === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();
      
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();
      
      let dayClassName = styles.calendarDay;
      if (isSelected) dayClassName += ` ${styles.selectedDay}`;
      if (isToday) dayClassName += ` ${styles.todayDay}`;
      
      days.push(
        <button
          key={day}
          className={dayClassName}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`${styles.wrapper} ${className}`} style={style}>
      <input
        type="text"
        className={styles.dateInput}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        inputMode="numeric"
        maxLength={10}
      />
      <button
        type="button"
        className={styles.calendarButton}
        onClick={handleCalendarToggle}
        disabled={disabled}
        aria-label="Открыть календарь"
      >
        <Icon name="calendar-days" size={24} className={styles.calendarIcon} />
      </button>
      
      {isCalendarOpen && (
        <div className={styles.calendarPopup}>
          <div className={styles.selectedDateDisplay}>
            {getWeekDay(currentDate)}, {currentDate.getDate()} {formatMonthYear(currentDate).split(' ')[0]}
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsCalendarOpen(false)}
              aria-label="Закрыть календарь"
            >
              <Icon name="x" size={18} className={styles.xIcon} />
            </button>
          </div>

          <div className={styles.calendarHeader}>
            <span className={styles.monthYear}>{formatMonthYear(currentDate)}</span>
            <div className={styles.navigation}>
              <button onClick={handlePrevMonth} className={styles.navButton}>
                <Icon name="chevrons-left" size={24} className={styles.chevronsLeftIcon} />
              </button>
              <button onClick={handleNextMonth} className={styles.navButton}>
                <Icon name="chevrons-right" size={24} className={styles.chevronsRightIcon} />
              </button>
            </div>
          </div>

          <div className={styles.calendarGrid}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <div key={day} className={styles.calendarDayName}>{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
};