import React from 'react';
import { AllIcons } from '../../../assets';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  onClick,
}) => {
  // Берем иконку из объекта по имени
  const iconPath = AllIcons[name as keyof typeof AllIcons];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <img
      src={iconPath}
      alt={name}
      width={typeof size === 'number' ? size : parseInt(size) || 24}
      height={typeof size === 'number' ? size : parseInt(size) || 24}
      className={className}
      onClick={onClick}
      style={{ color }}
    />
  );
};

export default Icon;