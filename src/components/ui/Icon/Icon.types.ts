export type IconName = string;

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
}