import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React$1 from 'react';
import React__default, { ElementType, ComponentProps } from 'react';
import { DialogProps } from 'vaul';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';

interface DrawerScreenProps extends React.PropsWithChildren {
    title: string;
    description: string;
    style?: React.CSSProperties;
}

type Stack = {
    screen: string;
    params: Record<string, string | number | boolean | null | undefined>;
};
declare enum ScreenType {
    PAGE = "page",
    DRAWER = "drawer",
    SINGLE = "single"
}
type Screen = {
    screen: ElementType;
    title: string;
    type: ScreenType;
    back?: {
        title?: string;
        push?: string;
        replace?: string;
    };
};
type Route = {
    name: Stack['screen'];
    params: Stack['params'];
    back?: Screen['back'];
    title: Screen['title'];
    type: Screen['type'];
    screen: Screen['screen'];
};
interface StackNavigatorContextState {
    route: Route;
    navigate: (screen: string | number, options?: {
        params?: Stack['params'];
        type?: 'push' | 'replace';
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
declare function StackNavigatorProvider({ screens, drawer, layout: Layout, }: StackNavigatorProviderProps): react_jsx_runtime.JSX.Element;
declare const useNavigate: () => (screen: string | number, options?: {
    params?: Stack["params"];
    type?: "push" | "replace";
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
declare const Typography: React__default.MemoExoticComponent<({ as, align, weight, size, className, ellipsis, lineClamp, capitalize, whitespacePreWrap, noWrap, dangerouslySetInnerHTML, children, ...props }: TypographyProps) => React__default.DetailedReactHTMLElement<React__default.HTMLAttributes<HTMLElement>, HTMLElement>>;

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    decimal?: number;
    maxDigits?: number;
}
declare function formatAmount(input: string): string;
declare function AmountInput({ decimal, value, onChange, maxDigits, ...props }: AmountInputProps): react_jsx_runtime.JSX.Element;

interface DropdownProps {
    value?: string;
    items: {
        key: string;
        name: string;
        icon?: React.ReactNode;
    }[];
    showIcon?: boolean;
    size?: 'sm' | 'md';
    placeholder?: string;
    disabled?: boolean;
    classes?: {
        trigger?: string;
    };
    onChange: (key: string) => void;
}
declare function Dropdown({ value, items, size, showIcon, classes, disabled, placeholder, onChange, }: DropdownProps): react_jsx_runtime.JSX.Element;

declare function Root({ className, style, children, }: React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function Header({ style, children, }: React.PropsWithChildren<{
    style?: React.CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function HeaderLeft({ style, children, }: React.PropsWithChildren<{
    style?: React.CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function HeaderTitle({ style, children, }: React.PropsWithChildren<{
    style?: React.CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function HeaderRight({ style, children, }: React.PropsWithChildren<{
    style?: React.CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare function Main({ style, children, }: React.PropsWithChildren<{
    style?: React.CSSProperties;
}>): react_jsx_runtime.JSX.Element;
declare const Layout: {
    Root: typeof Root;
    Header: typeof Header;
    HeaderLeft: typeof HeaderLeft;
    HeaderRight: typeof HeaderRight;
    HeaderTitle: typeof HeaderTitle;
    Main: typeof Main;
};

interface Tab {
    name: string;
    title: string;
    icon: React.ReactNode;
}
interface TabBarProps {
    style?: React.CSSProperties;
    items: Tab[];
    renderItem: (item: Tab) => React.ReactNode;
}
declare function TabBar({ style, items, renderItem }: TabBarProps): react_jsx_runtime.JSX.Element;

interface ListProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    items: T[];
    children: (item: T) => React.ReactNode;
}
declare function List<T>({ items, children, ...props }: ListProps<T>): react_jsx_runtime.JSX.Element;

type ModalProps = DialogProps & {
    type?: 'default' | 'nested';
    handle?: boolean;
    trigger?: React.ReactNode;
    title: string;
    children?: React.ReactNode;
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
    color?: "primary" | "secondary" | "destructive";
    rounded?: "sm" | "md" | "full" | "lg" | "xl";
} & class_variance_authority_types.ClassProp) => string;
type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
};
declare function Button({ className, variant, width, size, color, rounded, isLoading, children, onClick, ...props }: ButtonProps): react_jsx_runtime.JSX.Element;

declare const inputVariants: (props?: {} & class_variance_authority_types.ClassProp) => string;
declare function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>): react_jsx_runtime.JSX.Element;

declare const textareaVariants: (props?: {} & class_variance_authority_types.ClassProp) => string;
declare function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaVariants>): react_jsx_runtime.JSX.Element;

declare function Canvas({ image, size, ...props }: {
    image: HTMLImageElement;
    size?: number;
} & React.CanvasHTMLAttributes<HTMLCanvasElement>): react_jsx_runtime.JSX.Element;

type ConfirmProps = ModalProps & {
    description: string;
    cancel: ButtonProps;
    confirm: ButtonProps;
};
declare function Confirm({ title, description, onOpenChange, cancel, confirm, ...props }: ConfirmProps): react_jsx_runtime.JSX.Element;

declare function useRefValue<T>(value: T): React__default.RefObject<T>;

declare function useClientOnce(setup: () => void | undefined | (() => void)): void;

declare function useIsMounted(): boolean;

declare function useDisclosure(): {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onOpen: () => void;
    onClose: () => void;
};

declare function Spinner(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ChevronDown(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function Check(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

export { AmountInput, type AmountInputProps, Button, type ButtonProps, Canvas, Check, ChevronDown, Confirm, type ConfirmProps, DEFAULT_STACK, Dropdown, type DropdownProps, Image, type ImageProps, type ImageSrc, Input, Layout, List, type ListProps, Modal, type ModalProps, type Route, type Screen, ScreenType, Spinner, type Stack, StackNavigatorContext, type StackNavigatorContextState, StackNavigatorProvider, type StackNavigatorProviderProps, type Tab, TabBar, type TabBarProps, Textarea, Typography, type TypographyProps, buttonVariants, formatAmount, inputVariants, textareaVariants, useClientOnce, useDisclosure, useIsMounted, useNavigate, useRefValue, useRoute };
