export type IconName = string; // ← упрощаем, теперь можно передавать любое имя

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const sizeMap: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};