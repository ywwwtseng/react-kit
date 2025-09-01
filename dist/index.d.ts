import * as react from 'react';
import { PropsWithChildren } from 'react';

type TypographySize = '12' | '11' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '1';
interface TypographyProps extends PropsWithChildren, React.CSSProperties {
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
declare const Typography: react.MemoExoticComponent<({ as, color, align, weight, size, className, ellipsis, lineClamp, capitalize, whitespacePreWrap, noWrap, dangerouslySetInnerHTML, children, ...props }: TypographyProps) => react.DetailedReactHTMLElement<react.HTMLAttributes<HTMLElement>, HTMLElement>>;

export { Typography, type TypographyProps };
