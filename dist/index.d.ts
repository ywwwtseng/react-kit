import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { PropsWithChildren, CSSProperties, ElementType, ReactElement, ReactNode, HTMLAttributes } from 'react';
import { DropdownProps as DropdownProps$1 } from '@heroui/dropdown';
import { DialogProps } from 'vaul';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';

interface DrawerScreenProps extends PropsWithChildren {
    title: string;
    description: string;
    style?: CSSProperties;
}

type Stack = {
    screen: string;
    params: Record<string, string | number>;
};
declare enum ScreenType {
    PAGE = "page",
    DRAWER = "drawer"
}
type Screen = {
    screen: ElementType;
    title: string;
    type: ScreenType;
};
type Route = {
    name: Stack['screen'];
    title: Screen['title'];
    params: Stack['params'];
    type: Screen['type'];
    screen: Screen['screen'];
};
interface StackNavigatorContextState {
    route: Route;
    navigate: (screen: string | number, options?: {
        params: Stack['params'];
    }) => void;
}
declare const DEFAULT_STACK: Stack;
declare const StackNavigatorContext: React$1.Context<StackNavigatorContextState>;
interface StackNavigatorProviderProps {
    screens: Record<string, Screen> & {
        Home: Screen;
    };
    drawer: {
        style: DrawerScreenProps['style'];
    };
    layout: ElementType;
}
declare function StackNavigatorProvider({ screens, drawer, layout: Layout }: StackNavigatorProviderProps): react_jsx_runtime.JSX.Element;
declare const useNavigate: () => (screen: string | number, options?: {
    params: Stack["params"];
}) => void;
declare const useRoute: () => Route;

type TypographySize = '12' | '11' | '10' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '1';
interface TypographyProps extends React__default.PropsWithChildren, React__default.CSSProperties {
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
declare const Typography: React__default.MemoExoticComponent<({ as, color, align, weight, size, className, ellipsis, lineClamp, capitalize, whitespacePreWrap, noWrap, dangerouslySetInnerHTML, children, ...props }: TypographyProps) => React__default.DetailedReactHTMLElement<React__default.HTMLAttributes<HTMLElement>, HTMLElement>>;

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    decimal?: number;
    maxDigits?: number;
}
declare function formatAmount(input: string): string;
declare function AmountInput({ decimal, value, onChange, maxDigits, ...props }: AmountInputProps): react_jsx_runtime.JSX.Element;

interface DropdownItem {
    key: string;
    name: string;
    icon?: ReactElement;
}
interface DropdownProps extends Omit<DropdownProps$1, 'onChange' | 'children'> {
    items: DropdownItem[];
    children: ReactElement;
    onChange: (key: string) => void;
}
declare function Dropdown({ items, children, onChange, ...props }: DropdownProps): react_jsx_runtime.JSX.Element;

declare function Root({ className, style, children }: PropsWithChildren<{
    className?: string;
    style?: CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function Header({ style, children }: PropsWithChildren<{
    style?: CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function HeaderLeft({ style, children }: PropsWithChildren<{
    style?: CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function HeaderRight({ style, children }: PropsWithChildren<{
    style?: CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function Main({ style, children }: PropsWithChildren<{
    style?: CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare const Layout: {
    Root: typeof Root;
    Header: typeof Header;
    HeaderLeft: typeof HeaderLeft;
    HeaderRight: typeof HeaderRight;
    Main: typeof Main;
};

interface Tab {
    name: string;
    title: string;
    icon: ReactNode;
}
interface TabBarProps {
    style?: CSSProperties;
    items: Tab[];
    renderItem: (item: Tab) => ReactNode;
}
declare function TabBar({ style, items, renderItem }: TabBarProps): react_jsx_runtime.JSX.Element;

interface ListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    items: T[];
    children: (item: T) => ReactNode;
}
declare function List<T>({ items, children, ...props }: ListProps<T>): react_jsx_runtime.JSX.Element;

type ModalProps = DialogProps & {
    type?: 'default' | 'nested';
    handle?: boolean;
    trigger?: React.ReactNode;
    title: string;
    children: React.ReactNode;
    classes?: {
        content?: string;
    };
};
declare function Modal({ type, handle, trigger, title, children, classes, ...props }: ModalProps): react_jsx_runtime.JSX.Element;

type ImageSrc = string | {
    src: string;
};

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: ImageSrc;
}
declare function Image({ src, ...props }: ImageProps): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: {
    variant?: "text" | "icon" | "contained";
    width?: "full";
    size?: "sm" | "md" | "xs";
    color?: "primary" | "secondary";
    rounded?: "sm" | "md" | "lg" | "full" | "xl";
} & class_variance_authority_types.ClassProp) => string;
declare function Button({ className, variant, width, size, color, rounded, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>): react_jsx_runtime.JSX.Element;

declare const inputVariants: (props?: {} & class_variance_authority_types.ClassProp) => string;
declare function Input({ className, ...props }: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>): react_jsx_runtime.JSX.Element;

declare function useRefValue<T>(value: T): React__default.RefObject<T>;

declare function useClientOnce(setup: () => void | undefined | (() => void)): void;

export { AmountInput, type AmountInputProps, Button, DEFAULT_STACK, Dropdown, type DropdownItem, type DropdownProps, Image, type ImageProps, type ImageSrc, Input, Layout, List, type ListProps, Modal, type ModalProps, type Route, type Screen, ScreenType, type Stack, StackNavigatorContext, type StackNavigatorContextState, StackNavigatorProvider, type StackNavigatorProviderProps, type Tab, TabBar, type TabBarProps, Typography, type TypographyProps, buttonVariants, formatAmount, inputVariants, useClientOnce, useNavigate, useRefValue, useRoute };
