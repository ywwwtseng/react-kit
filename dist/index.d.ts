import { ToasterProps } from 'react-hot-toast';
export { default as toast } from 'react-hot-toast';
import * as React$1 from 'react';
import React__default, { ComponentProps, ElementType, RefObject, PropsWithChildren, ReactNode } from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { DialogProps } from 'vaul';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import { AppError, Locales, ErrorResponse } from '@ywwwtseng/ywjs';
import * as zustand from 'zustand';

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
    onInputChange?: (value: string) => void;
    decimal?: number;
    maxDigits?: number;
}
declare function formatAmount(input: string): string;
declare function AmountInput({ decimal, value, onChange, onInputChange, maxDigits, ...props }: AmountInputProps): react_jsx_runtime.JSX.Element;

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
declare function Main({ ref, style, children, }: React.PropsWithChildren<{
    ref?: React.RefObject<HTMLDivElement>;
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
    styles?: {
        content?: React.CSSProperties;
    };
};
declare function Modal({ type, handle, trigger, title, children, classes, styles, ...props }: ModalProps): react_jsx_runtime.JSX.Element;

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'text' | 'contained' | 'icon';
    width?: 'full';
    size?: 'xs' | 'sm' | 'md';
    color?: 'primary' | 'secondary' | 'active' | 'destructive' | string;
    textColor?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    isLoading?: boolean;
};
declare function Button({ variant, width, size, color, textColor, rounded, isLoading, children, onClick, style, disabled, ...props }: ButtonProps): react_jsx_runtime.JSX.Element;

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

declare function useDebounce<T>(value: T, delay?: number): T;

interface UseIntervalOptions {
    delay: number;
    enabled?: boolean;
    timeout?: number;
    onTimeout?: () => void;
}
declare function useInterval(callback: () => void, { delay, enabled, timeout, onTimeout }: UseIntervalOptions): void;

/**
 * 持久化冷卻倒數：成功後 N 秒內不能操作，重新整理後仍會繼續倒數
 * @param storageKey 儲存鍵（會加上前綴，避免衝突）
 * @param durationSeconds 冷卻秒數
 */
declare function usePersistedCooldown(storageKey: string, durationSeconds: number): {
    isCoolingDown: boolean;
    remainingSeconds: number;
    startCooldown: () => void;
};

interface DrawerViewProps extends React.PropsWithChildren {
    title: string;
    description: string;
    style?: React.CSSProperties;
}

interface StackViewProps {
    drawer?: {
        style: DrawerViewProps['style'];
    };
}
declare function StackView({ drawer }: StackViewProps): react_jsx_runtime.JSX.Element;

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
    screens: Record<string, Screen>;
    stacks: Stack[];
    navigate: (screen: string | number, options?: {
        params?: Stack['params'];
        type?: 'push' | 'replace';
    }) => void;
}
declare const StackNavigatorContext: React$1.Context<StackNavigatorContextState>;
interface StackNavigatorProviderProps {
    screens: Record<string, Screen> & {
        Home: Screen;
    };
    children: React.ReactNode | ((state: StackNavigatorContextState) => React.ReactNode);
}
declare function StackNavigatorProvider({ screens, children, }: StackNavigatorProviderProps): react_jsx_runtime.JSX.Element;
declare const useNavigate: () => (screen: string | number, options?: {
    params?: Stack["params"];
    type?: "push" | "replace";
}) => void;
declare const useRoute: () => Route;

type QueryParams = Record<string, string | number | boolean | null | undefined>;
interface Command {
    type: 'update' | 'merge' | 'replace' | 'unshift' | 'push' | 'delete';
    target?: string;
    payload: unknown;
}
type NotifyType = 'success' | 'error' | 'default';
interface Notify {
    type?: NotifyType;
    message: string;
    params?: Record<string, string>;
}
interface ResponseData {
    error?: number;
    message?: string;
    commands?: Command[];
    data?: unknown;
    notify?: Notify;
    navigate?: {
        screen: string;
        params: Record<string, string | number | boolean>;
    };
    ok: boolean;
}

interface ClientContextState {
    loadingRef: RefObject<string[]>;
    query: (path: string, params?: QueryParams) => Promise<{
        key: string;
        data: ResponseData;
    }>;
    mutate: (action: string, payload?: unknown) => Promise<{
        data: ResponseData;
    }>;
}
declare const ClientContext: React$1.Context<ClientContextState>;
interface ClientProviderProps extends PropsWithChildren {
    url: string;
    transformRequest?: (headers: Headers) => Headers;
    onError?: (error: AppError) => void;
}
declare function ClientProvider({ url, transformRequest, onError, children, }: ClientProviderProps): react_jsx_runtime.JSX.Element;

interface AppStateContextState {
    update: (commands: Command[]) => void;
    clear: (key: string) => void;
    queryKeysMap: Map<string, string[]>;
}
declare const AppStateContext: React$1.Context<AppStateContextState>;
type AppState = {
    state: Record<string, unknown>;
    loading: string[];
    update: (commands: Command[]) => void;
};
declare const useAppStateStore: zustand.UseBoundStore<zustand.StoreApi<AppState>>;
declare function AppStateProvider({ children }: PropsWithChildren): react_jsx_runtime.JSX.Element;

interface AppUIContextState {
    loadingUI: number;
    showLoadingUI: (show: boolean) => void;
}
declare const AppUIContext: React$1.Context<AppUIContextState>;
declare function AppUIProvider({ children }: PropsWithChildren): react_jsx_runtime.JSX.Element;
declare function useAppUI(): AppUIContextState;

interface I18nContextState {
    t: (key: string, params?: Record<string, string | number>) => string;
    language_code: string;
}
interface I18nProviderProps extends PropsWithChildren {
    locales?: Locales;
    path?: [string, ...string[]];
    callback?: string;
}

type Plugin = {
    provider: (props: PropsWithChildren<any>) => ReactNode;
    options?: any;
};
interface AppProviderProps extends React.PropsWithChildren, Omit<ClientProviderProps, 'children'> {
    toasterProps?: Omit<ToasterProps, 'children'>;
    i18nProps?: Omit<I18nProviderProps, 'children'>;
    plugins?: Plugin[];
}
declare function AppProvider({ url, transformRequest, onError, plugins, i18nProps, toasterProps, children, }: AppProviderProps): react_jsx_runtime.JSX.Element;

interface UseMutationOptions {
    ignoreNotify?: boolean | ((error: ErrorResponse) => boolean);
    showLoading?: boolean;
    onError?: (error: ErrorResponse) => void;
    onSuccess?: (data: ResponseData) => void;
}
declare function useMutation(action: string, { ignoreNotify, showLoading, onError, onSuccess }?: UseMutationOptions): {
    mutate: <T = unknown>(payload?: T) => Promise<ResponseData>;
    isLoading: boolean;
};

interface UseQueryOptions {
    params?: QueryParams;
    refetchOnMount?: boolean;
    autoClearCache?: boolean;
    enabled?: boolean;
    showLoading?: boolean;
}
declare function useQuery<T = unknown>(path: string, options?: UseQueryOptions): {
    refetch: () => void;
    isLoading: boolean;
    data: T | undefined;
};

declare function useQueryState<T = unknown>(path?: string | string[]): T | undefined;

interface UseInfiniteQueryOptions {
    params: QueryParams & {
        limit: number;
    };
    refetchOnMount?: boolean;
    enabled?: boolean;
    type?: 'cursor' | 'offset';
    showLoading?: boolean;
}
declare function useInfiniteQuery<T = unknown>(path: string, options: UseInfiniteQueryOptions): {
    data: T | undefined;
    isLoading: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
};

declare function useClient(): ClientContextState;

declare function useI18n(): I18nContextState;

declare function getQueryKey(path: string, params?: QueryParams): string;

declare function Loading(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function Search(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function Spinner(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ChevronLeft(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ChevronRight(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ChevronDown(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function Check(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function WalletConnect(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ArrowDown(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ArrowUp(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function ArrowUpDown(props: React.SVGProps<SVGSVGElement>): react_jsx_runtime.JSX.Element;

declare function formatTinyAmount(value: string | number, significantDigits?: number): string | {
    zeroCount: number;
    significant: string;
};
declare function displayAmount(v: string | number, options: {
    showTinyAmount: false;
}): string;
declare function displayAmount(v: string | number, options?: {
    showTinyAmount?: true;
}): string | React.ReactElement;
declare function displayAmount(v: string | number | undefined | null, options?: {
    showTinyAmount?: boolean;
}): string | React.ReactElement | undefined;
declare function parseTokenId(token_id: string): {
    symbol: string;
    decimals: number;
    network: string;
    address: string | undefined;
};
declare function formatTokenId({ symbol, decimals, network, address }: {
    symbol: string;
    decimals: number;
    network: string;
    address: string | undefined;
}): string;

export { AmountInput, type AmountInputProps, AppProvider, type AppProviderProps, type AppState, AppStateContext, type AppStateContextState, AppStateProvider, AppUIContext, type AppUIContextState, AppUIProvider, ArrowDown, ArrowUp, ArrowUpDown, Button, type ButtonProps, Canvas, Check, ChevronDown, ChevronLeft, ChevronRight, ClientContext, type ClientContextState, ClientProvider, type ClientProviderProps, type Command, Confirm, type ConfirmProps, Input, Layout, List, type ListProps, Loading, Modal, type ModalProps, type Notify, type NotifyType, type Plugin, type QueryParams, type ResponseData, type Route, type Screen, ScreenType, Search, Spinner, type Stack, StackNavigatorContext, type StackNavigatorContextState, StackNavigatorProvider, type StackNavigatorProviderProps, StackView, type StackViewProps, type Tab, TabBar, type TabBarProps, Textarea, Typography, type TypographyProps, type UseMutationOptions, type UseQueryOptions, WalletConnect, displayAmount, formatAmount, formatTinyAmount, formatTokenId, getQueryKey, inputVariants, parseTokenId, textareaVariants, useAppStateStore, useAppUI, useClient, useClientOnce, useDebounce, useDisclosure, useI18n, useInfiniteQuery, useInterval, useIsMounted, useMutation, useNavigate, usePersistedCooldown, useQuery, useQueryState, useRefValue, useRoute };
