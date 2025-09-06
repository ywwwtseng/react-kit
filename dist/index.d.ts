import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { PropsWithChildren, CSSProperties, ElementType, ReactNode, ReactElement, HTMLAttributes } from 'react';
import { DropdownProps as DropdownProps$1 } from '@heroui/dropdown';

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
    icon?: ReactNode;
    type: ScreenType;
};
type Route = {
    name: Stack['screen'];
    title: Screen['title'];
    icon: Screen['icon'];
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
declare const StackNavigatorContext: React.Context<StackNavigatorContextState>;
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

interface ListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    items: T[];
    children: (item: T) => ReactNode;
}
declare function List<T>({ items, children, ...props }: ListProps<T>): react_jsx_runtime.JSX.Element;

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

declare function useRefValue<T>(value: T): React__default.RefObject<T>;

declare function useClientOnce(setup: () => void | undefined | (() => void)): void;

export { DEFAULT_STACK, Dropdown, type DropdownItem, type DropdownProps, Layout, List, type ListProps, type Route, type Screen, ScreenType, type Stack, StackNavigatorContext, type StackNavigatorContextState, StackNavigatorProvider, type StackNavigatorProviderProps, type Tab, TabBar, type TabBarProps, Typography, type TypographyProps, useClientOnce, useNavigate, useRefValue, useRoute };
