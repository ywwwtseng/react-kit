import { ComponentProps, useState, useMemo, CSSProperties } from 'react';
import { Spinner } from '../icons';

// 颜色定义
const colors = {
  primary: '#3b82f6', // blue-500
  secondary: 'rgba(66,66,66,0.8)', // gray-800 with 80% opacity
  active: '#10b981', // emerald-500
  destructive: '#ef4444', // red-500
};

// 尺寸定义
const sizes = {
  xs: { fontSize: '0.75rem', minHeight: '32px', padding: '0.25rem 0.5rem' },
  sm: { fontSize: '0.875rem', minHeight: '40px', padding: '0.5rem 0.75rem' },
  md: { fontSize: '1.125rem', minHeight: '48px', padding: '0.75rem 1rem' },
};

// 圆角定义
const borderRadius = {
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
};

// 将颜色转换为 rgba，用于 hover 效果（90% 透明度）
const withOpacity = (color: string, opacity: number = 0.9) => {
  // 如果已经是 rgba/rgb 格式，提取 RGB 值和原本的透明度
  if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (match) {
      const originalOpacity = match[4] ? parseFloat(match[4]) : 1;
      // 在原本透明度基础上乘以 opacity（更透明）
      const newOpacity = originalOpacity * opacity;
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${newOpacity})`;
    }
  }

  // hex 转 rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export type ButtonProps = ComponentProps<'button'> & {
  variant?: 'text' | 'contained' | 'icon';
  width?: 'full';
  size?: 'xs' | 'sm' | 'md';
  color?: 'primary' | 'secondary' | 'active' | 'destructive' | string;
  textColor?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isLoading?: boolean;
};

export function Button({
  variant = 'text',
  width,
  size = 'md',
  color = 'primary',
  textColor = '#ffffff',
  rounded,
  isLoading = false,
  children,
  onClick,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = useMemo<CSSProperties>(() => {
    const baseStyle: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      border: 'none',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.2s ease-in-out',
      whiteSpace: 'nowrap',
      ...style,
    };

    // 宽度
    if (width === 'full') {
      baseStyle.width = '100%';
    }

    // 尺寸
    if (size) {
      const sizeConfig = sizes[size];
      baseStyle.fontSize = sizeConfig.fontSize;
      baseStyle.minHeight = sizeConfig.minHeight;
      if (variant !== 'icon') {
        baseStyle.padding = sizeConfig.padding;
      }
    }

    // 圆角
    if (rounded) {
      baseStyle.borderRadius = borderRadius[rounded];
    } else if (variant === 'icon') {
      baseStyle.borderRadius = borderRadius.full;
    }

    // Icon 变体的尺寸
    if (variant === 'icon' && size) {
      const iconSize = sizes[size].minHeight;
      baseStyle.width = iconSize;
      baseStyle.height = iconSize;
      baseStyle.padding = '0';
    }

    // 颜色和变体
    const colorValue = colors[color] ?? color;
    const hoverColor = isHovered && !disabled ? withOpacity(colorValue, 0.9) : colorValue;

    if (variant === 'text') {
      baseStyle.backgroundColor = 'transparent';
      baseStyle.color = hoverColor;
    } else if (variant === 'contained') {
      baseStyle.backgroundColor = hoverColor;
      baseStyle.color = textColor;
    } else if (variant === 'icon') {
      baseStyle.backgroundColor = hoverColor;
      baseStyle.color = textColor;
    }

    return baseStyle;
  }, [variant, width, size, color, rounded, isHovered, disabled, style]);

  return (
    <button
      style={buttonStyle}
      onClick={(event) => {
        if (isLoading || disabled) return;
        onClick?.(event);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner width={24} height={24} /> : children}
    </button>
  );
}
