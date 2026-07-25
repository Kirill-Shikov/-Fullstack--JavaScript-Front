import React, { useState } from 'react';
import { Icon } from '../Icon';
import styles from './DateInput.module.css';

interface DateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({
  value = '',
  onChange,
  placeholder = 'ДД.ММ.ГГГГ',
  disabled = false,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [currentDate, setCurrentDate] = useState<Date>(today);

  const parseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    if (numericValue.length > 8) return;
    
    let formatted = numericValue;
    if (formatted.length >= 3) {
      formatted = formatted.slice(0, 2) + '.' + formatted.slice(2);
    }
    if (formatted.length >= 6) {
      formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
    }
    
    onChange?.(formatted);

    const parsed = parseDate(formatted);
    if (parsed) {
      setSelectedDate(parsed);
      setCurrentDate(parsed);
    }
  };

  const handleCalendarToggle = () => {
    if (!disabled) {
      setIsCalendarOpen(!isCalendarOpen);
    }
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setCurrentDate(date);
    const formattedDate = `${String(day).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
    onChange?.(formattedDate);
    setIsCalendarOpen(false);
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleString('ru', { month: 'long', year: 'numeric' });
  };

  const getWeekDay = (date: Date) => {
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days: JSX.Element[] = [];

    // Пустые ячейки
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        day === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();
      
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();
      
      days.push(
        <button
          key={day}
          className={`${styles.calendarDay} ${isSelected ? styles.selectedDay : ''} ${isToday ? styles.todayDay : ''}`}
          onClick={() => handleDateSelect(day)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={styles.wrapper}>
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