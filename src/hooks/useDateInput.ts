import { useState } from 'react';

interface UseDateInputReturn {
  isCalendarOpen: boolean;
  selectedDate: Date;
  currentDate: Date;
  today: Date;
  setIsCalendarOpen: (value: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCalendarToggle: () => void;
  handleDateSelect: (day: number) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  formatMonthYear: (date: Date) => string;
  getWeekDay: (date: Date) => string;
  getDaysInMonth: (year: number, month: number) => number;
  getFirstDayOfMonth: (year: number, month: number) => number;
}

export const useDateInput = (
  value: string = '',
  onChange?: (value: string) => void
): UseDateInputReturn => {
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
    setIsCalendarOpen(!isCalendarOpen);
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

  return {
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
  };
};