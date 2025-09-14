// src/context/StackNavigatorContext.tsx
import {
  createContext,
  use,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import { parseJSON } from "@ywwwtseng/utils";

// src/components/DrawerScreen.tsx
import { Drawer } from "vaul";
import { jsx, jsxs } from "react/jsx-runtime";
function DrawerScreen({
  title,
  description,
  style,
  children
}) {
  return /* @__PURE__ */ jsx(Drawer.Root, { handleOnly: true, direction: "right", open: !!children, children: /* @__PURE__ */ jsx(Drawer.Portal, { children: /* @__PURE__ */ jsxs(
    Drawer.Content,
    {
      style: {
        height: "100vh",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        outline: "none",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(Drawer.Title, { style: { display: "none" }, children: title }),
        /* @__PURE__ */ jsx(Drawer.Description, { style: { display: "none" }, children: description }),
        children
      ]
    }
  ) }) });
}

// src/context/StackNavigatorContext.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ScreenType = /* @__PURE__ */ ((ScreenType2) => {
  ScreenType2["PAGE"] = "page";
  ScreenType2["DRAWER"] = "drawer";
  return ScreenType2;
})(ScreenType || {});
var DEFAULT_STACK = parseJSON(sessionStorage.getItem("navigator/screen")) || { screen: "Home", params: {} };
var StackNavigatorContext = createContext({
  route: void 0,
  navigate: (screen, options) => {
  }
});
function StackNavigatorProvider({ screens, drawer, layout: Layout2 }) {
  const [stacks, setStacks] = useState([DEFAULT_STACK]);
  const route = useMemo(() => {
    const stack = stacks[stacks.length - 1];
    const screen = screens[stack.screen];
    return {
      name: stack.screen,
      title: screen.title,
      params: stack.params,
      type: screen.type,
      screen: screen.screen
    };
  }, [stacks, screens]);
  const Screen = useMemo(() => {
    if (route.type === "drawer") {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : void 0;
    }
    return route.screen;
  }, [route, stacks, screens]);
  const DrawerContent = useMemo(() => {
    if (route.type === "drawer") {
      return route.screen;
    }
  }, [route, stacks, screens]);
  const navigate = useCallback((screen, options) => {
    if (typeof screen === "string") {
      if (!Object.keys(screens).includes(screen)) {
        console.warn(`Screen ${screen} not found`);
        return;
      }
    }
    setStacks((prev) => {
      if (screen === -1 && prev.length > 1) {
        return prev.slice(0, -1);
      } else if (typeof screen === "string") {
        if (prev[prev.length - 1]?.screen === screen) {
          return prev;
        }
        const route2 = { screen, params: options?.params || {} };
        return [...prev, route2];
      }
      return prev;
    });
  }, [screens]);
  const value = useMemo(() => ({
    route,
    navigate
  }), [route, navigate]);
  useEffect(() => {
    if (route.type === "drawer") {
      return;
    }
    sessionStorage.setItem("navigator/screen", JSON.stringify({
      screen: route.name,
      params: route.params
    }));
  }, [route]);
  return /* @__PURE__ */ jsx2(
    StackNavigatorContext.Provider,
    {
      value,
      children: /* @__PURE__ */ jsxs2(
        Layout2,
        {
          styles: {
            tabBar: !!DrawerContent ? { display: "none" } : {}
          },
          children: [
            Screen && /* @__PURE__ */ jsx2(
              "div",
              {
                style: {
                  height: "100%",
                  overflowY: "auto",
                  display: !!DrawerContent ? "none" : "block"
                },
                children: /* @__PURE__ */ jsx2(Screen, { params: route.params })
              }
            ),
            /* @__PURE__ */ jsx2(
              DrawerScreen,
              {
                title: route.title,
                description: route.title,
                style: drawer.style,
                children: !!DrawerContent && /* @__PURE__ */ jsx2(DrawerContent, { params: route.params })
              }
            )
          ]
        }
      )
    }
  );
}
var useNavigate = () => {
  const context = use(StackNavigatorContext);
  if (!context) {
    throw new Error("useNavigate must be used within a StackNavigator");
  }
  return context.navigate;
};
var useRoute = () => {
  const context = use(StackNavigatorContext);
  if (!context) {
    throw new Error("useRoute must be used within a StackNavigator");
  }
  return context.route;
};

// src/components/Typography.tsx
import React from "react";
var config = {
  size: {
    "12": { fontSize: "8rem", lineHeight: "1" },
    "11": { fontSize: "6rem", lineHeight: "1" },
    "10": { fontSize: "4.5rem", lineHeight: "1" },
    "9": { fontSize: "3.75rem", lineHeight: "1" },
    "8": { fontSize: "2.25rem", lineHeight: "2.5rem" },
    "7": { fontSize: "1.875rem", lineHeight: "2.25rem" },
    "6": { fontSize: "1.5rem", lineHeight: "2rem" },
    "5": { fontSize: "1.25rem", lineHeight: "1.75rem" },
    "4": { fontSize: "1.125rem", lineHeight: "1.75rem" },
    "3": { fontSize: "1rem", lineHeight: "1.5rem" },
    "2": { fontSize: "0.875rem", lineHeight: "1.25rem" },
    "1": { fontSize: "0.75rem", lineHeight: "1rem" }
  }
};
var Typography = React.memo(({
  as = "p",
  color = "currentColor",
  align = "left",
  weight = 400,
  size = "3",
  className,
  ellipsis = false,
  lineClamp,
  capitalize = false,
  whitespacePreWrap = false,
  noWrap = false,
  dangerouslySetInnerHTML = false,
  children,
  ...props
}) => {
  return React.createElement(
    as,
    {
      className,
      style: {
        textAlign: align,
        color,
        fontWeight: weight,
        ...config.size[size],
        ...ellipsis ? { textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" } : {},
        ...lineClamp ? { WebkitLineClamp: lineClamp, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" } : {},
        ...capitalize ? { textTransform: "capitalize" } : {},
        ...whitespacePreWrap ? { whiteSpace: "pre-wrap" } : {},
        ...noWrap ? { whiteSpace: "nowrap" } : {},
        ...props
      },
      ...dangerouslySetInnerHTML ? {
        dangerouslySetInnerHTML: {
          __html: children
        }
      } : { children }
    }
  );
});

// src/components/AmountInput.tsx
import { useState as useState2 } from "react";

// src/components/Input.tsx
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { jsx as jsx3 } from "react/jsx-runtime";
var inputVariants = cva("focus:outline-none outline-none", {
  variants: {},
  defaultVariants: {},
  compoundVariants: []
});
function Input({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx3("input", { className: clsx(inputVariants({ className })), ...props });
}

// src/components/AmountInput.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function formatAmount(input) {
  if (!input) return "";
  const parts = input.split(".");
  const integerPart = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return `${integerPart}.${parts[1]}`;
  } else if (input.endsWith(".")) {
    return `${integerPart}.`;
  }
  return integerPart;
}
function AmountInput({
  decimal = 0,
  value,
  onChange,
  maxDigits,
  ...props
}) {
  const [inputValue, setInputValue] = useState2(value);
  return /* @__PURE__ */ jsx4(
    Input,
    {
      ...props,
      className: props.className ? `input ${props.className}` : "input",
      type: "text",
      value: formatAmount(inputValue),
      onChange: (e) => {
        const value2 = e.target.value.replace(/,/g, "");
        if (value2 === "") {
          setInputValue("");
          onChange("");
          return;
        }
        if (value2.startsWith(".")) return;
        if ((value2.match(/\./g) || []).length > 1) return;
        if (!/^\d*\.?\d*$/.test(value2)) return;
        if (/^0\d+/.test(value2) && !/^0\.\d*$/.test(value2)) return;
        if (typeof maxDigits === "number") {
          const totalDigits = value2.replace(".", "");
          if (totalDigits.length > maxDigits) return;
        }
        if (decimal === 0) {
          if (value2 === "0") {
            setInputValue("");
            onChange("");
          } else {
            setInputValue(value2.replace(".", ""));
            onChange(value2.replace(".", ""));
          }
          return;
        }
        const decimalPart = value2.split(".")[1];
        if (decimalPart && decimalPart.length > decimal) return;
        if (Number(value2) >= 0) {
          setInputValue(value2);
          if (/^(0|[1-9]\d*)(\.\d+)?$/.test(value2)) {
            if (Number(value2) === 0) {
              onChange("");
            } else {
              onChange(value2);
            }
          }
        }
      }
    }
  );
}

// src/components/Dropdown.tsx
import {
  Dropdown as HerouiDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function Dropdown({
  items,
  children,
  onChange,
  ...props
}) {
  return /* @__PURE__ */ jsxs3(HerouiDropdown, { ...props, children: [
    /* @__PURE__ */ jsx5(DropdownTrigger, { children }),
    /* @__PURE__ */ jsx5(DropdownMenu, { children: items.map((item) => /* @__PURE__ */ jsx5(
      DropdownItem,
      {
        onClick: () => onChange(item.key),
        startContent: item.icon ? /* @__PURE__ */ jsx5("div", { style: { marginRight: "10px" }, children: item.icon }) : null,
        textValue: item.key,
        children: /* @__PURE__ */ jsx5(Typography, { size: "2", children: item.name })
      },
      item.key
    )) })
  ] });
}

// src/components/Layout.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function Root({ className, style, children }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className,
      style: {
        display: "flex",
        opacity: 0,
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        ...style
      },
      children
    }
  );
}
function Header({ style, children }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      style: {
        width: "100vw",
        left: 0,
        top: 0,
        padding: "8px 16px",
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "8px",
        zIndex: 1e3,
        pointerEvents: "auto",
        ...style
      },
      children
    }
  );
}
function HeaderLeft({ style, children }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        ...style
      },
      children
    }
  );
}
function HeaderRight({ style, children }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        ...style
      },
      children
    }
  );
}
function Main({ style, children }) {
  return /* @__PURE__ */ jsx6(
    "div",
    {
      style: {
        height: "100vh",
        overflowY: "auto",
        ...style
      },
      children
    }
  );
}
var Layout = {
  Root,
  Header,
  HeaderLeft,
  HeaderRight,
  Main
};

// src/components/List.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function List({ items, children, ...props }) {
  return /* @__PURE__ */ jsx7("div", { ...props, children: items.map((item) => children(item)) });
}

// src/components/TabBar.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
function TabBar({ style, items, renderItem }) {
  return /* @__PURE__ */ jsx8(
    List,
    {
      style: {
        width: "100vw",
        left: 0,
        bottom: 0,
        padding: "4px 32px 0px",
        position: "fixed",
        display: "flex",
        alignItems: "start",
        justifyContent: "space-between",
        ...style
      },
      items,
      children: (item) => renderItem(item)
    }
  );
}

// src/components/Modal.tsx
import { Drawer as Drawer2 } from "vaul";
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function Modal({
  type = "default",
  handle = true,
  trigger,
  title,
  children,
  classes,
  ...props
}) {
  const Root2 = type === "default" ? Drawer2.Root : Drawer2.NestedRoot;
  return /* @__PURE__ */ jsxs4(Root2, { ...props, children: [
    trigger && /* @__PURE__ */ jsx9(Drawer2.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxs4(Drawer2.Portal, { children: [
      /* @__PURE__ */ jsx9(
        Drawer2.Overlay,
        {
          style: {
            position: "fixed",
            inset: "0",
            zIndex: "30"
          }
        }
      ),
      /* @__PURE__ */ jsxs4(
        Drawer2.Content,
        {
          className: classes?.content,
          style: {
            position: "fixed",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            zIndex: 30,
            paddingTop: 16,
            bottom: 0,
            left: 0,
            right: 0
          },
          children: [
            handle && /* @__PURE__ */ jsx9(Drawer2.Handle, {}),
            /* @__PURE__ */ jsx9(Drawer2.Title, { className: "hidden", children: title }),
            /* @__PURE__ */ jsx9(Drawer2.Description, { className: "hidden", children: title }),
            children
          ]
        }
      )
    ] })
  ] });
}

// src/components/Image.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function Image({ src, ...props }) {
  const url = typeof src === "string" ? src : src.src;
  return /* @__PURE__ */ jsx10("img", { src: url, ...props });
}

// src/components/Button.tsx
import { cva as cva2 } from "class-variance-authority";
import clsx2 from "clsx";
import { jsx as jsx11 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "flex items-center justify-center cursor-pointer focus:outline-none outline-none",
  {
    variants: {
      variant: {
        text: "text",
        contained: "contained",
        icon: "rounded-full"
      },
      width: {
        full: "w-full"
      },
      size: {
        xs: "text-xs min-h-8",
        sm: "text-sm min-h-10",
        md: "text-lg min-h-12"
      },
      color: {
        primary: "",
        secondary: ""
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full"
      }
    },
    defaultVariants: {
      variant: "text"
    },
    compoundVariants: [
      {
        variant: "text",
        color: "primary",
        className: "text-primary hover:text-primary/90"
      },
      {
        variant: "text",
        color: "secondary",
        className: "text-secondary hover:text-secondary/90"
      },
      {
        variant: "contained",
        color: "primary",
        className: "bg-primary hover:bg-primary/90"
      },
      {
        variant: "contained",
        color: "secondary",
        className: "bg-secondary hover:bg-secondary/90"
      },
      {
        variant: "icon",
        color: "primary",
        className: "bg-primary hover:bg-primary/90"
      },
      {
        variant: "icon",
        color: "secondary",
        className: "bg-secondary hover:bg-secondary/90"
      },
      {
        variant: "icon",
        size: "xs",
        className: "h-8 w-8"
      },
      {
        variant: "icon",
        size: "sm",
        className: "h-10 w-10"
      },
      {
        variant: "icon",
        size: "md",
        className: "h-12 w-12"
      }
    ]
  }
);
function Button({
  className,
  variant,
  width,
  size,
  color,
  rounded,
  ...props
}) {
  return /* @__PURE__ */ jsx11(
    "button",
    {
      className: clsx2(
        buttonVariants({ variant, width, size, color, rounded, className })
      ),
      ...props
    }
  );
}

// src/hooks/useRefValue.ts
import React2 from "react";
function useRefValue(value) {
  const ref = React2.useRef(value);
  React2.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

// src/hooks/useClientOnce.ts
import { useEffect as useEffect2, useRef } from "react";
function useClientOnce(setup) {
  const canCall = useRef(true);
  useEffect2(() => {
    if (!canCall.current) {
      return;
    }
    canCall.current = false;
    const destroy = setup();
    return () => {
      if (destroy) {
        destroy();
      }
    };
  }, []);
}
export {
  AmountInput,
  Button,
  DEFAULT_STACK,
  Dropdown,
  Image,
  Input,
  Layout,
  List,
  Modal,
  ScreenType,
  StackNavigatorContext,
  StackNavigatorProvider,
  TabBar,
  Typography,
  buttonVariants,
  formatAmount,
  inputVariants,
  useClientOnce,
  useNavigate,
  useRefValue,
  useRoute
};
