import React from 'react';
import { AllIcons } from '../../../assets';

interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = '',
  onClick,
}) => {
  const iconPath = AllIcons[name as keyof typeof AllIcons];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const iconSize = typeof size === 'number' ? size : parseInt(size) || 24;

  return (
    <img
      src={iconPath}
      alt={name}
      width={iconSize}
      height={iconSize}
      className={className}
      onClick={onClick}
    />
  );
};

export default Icon;