import React from 'react';

type TypographySize =
  | '12'
  | '11'
  | '10'
  | '9'
  | '8'
  | '7'
  | '6'
  | '5'
  | '4'
  | '3'
  | '2'
  | '1';

const config: {
  size: Record<TypographySize, { fontSize: string; lineHeight: string }>;
} = {
  size: {
    '12': { fontSize: '8rem', lineHeight: '1' },
    '11': { fontSize: '6rem', lineHeight: '1' },
    '10': { fontSize: '4.5rem', lineHeight: '1' },
    '9': { fontSize: '3.75rem', lineHeight: '1' },
    '8': { fontSize: '2.25rem', lineHeight: '2.5rem' },
    '7': { fontSize: '1.875rem', lineHeight: '2.25rem' },
    '6': { fontSize: '1.5rem', lineHeight: '2rem' },
    '5': { fontSize: '1.25rem', lineHeight: '1.75rem' },
    '4': { fontSize: '1.125rem', lineHeight: '1.75rem' },
    '3': { fontSize: '1rem', lineHeight: '1.5rem' },
    '2': { fontSize: '0.875rem', lineHeight: '1.25rem' },
    '1': { fontSize: '0.75rem', lineHeight: '1rem' },
  },
};

export interface TypographyProps
  extends React.PropsWithChildren,
    React.CSSProperties {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'span' | 'p' | 'b';
  color?: 'currentColor' | string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: number;
  size?: TypographySize;
  className?: string;
  ellipsis?: boolean;
  lineClamp?: number;
  capitalize?: boolean;
  whitespacePreWrap?: boolean;
  noWrap?: boolean;
  dangerouslySetInnerHTML?: boolean;
  fontFamily?: string;
}

export const Typography = React.memo(
  ({
    as = 'p',
    align = 'left',
    weight = 400,
    size = '3',
    className,
    ellipsis = false,
    lineClamp,
    capitalize = false,
    whitespacePreWrap = false,
    noWrap = false,
    dangerouslySetInnerHTML = false,
    children,
    ...props
  }: TypographyProps) => {
    return React.createElement(as, {
      className,
      style: {
        textAlign: align,
        fontWeight: weight,
        ...config.size[size],
        ...(ellipsis
          ? {
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }
          : {}),
        ...(lineClamp
          ? {
              WebkitLineClamp: lineClamp,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }
          : {}),
        ...(capitalize ? { textTransform: 'capitalize' } : {}),
        ...(whitespacePreWrap ? { whiteSpace: 'pre-wrap' } : {}),
        ...(noWrap ? { whiteSpace: 'nowrap' } : {}),
        ...props,
      },
      ...(dangerouslySetInnerHTML
        ? {
            dangerouslySetInnerHTML: {
              __html: children,
            },
          }
        : { children }),
    });
  }
);
