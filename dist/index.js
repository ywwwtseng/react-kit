// src/context/StackNavigatorContext.tsx
import {
  createContext,
  use,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import { parseJSON } from "@ywwwtseng/ywjs";

// src/components/DrawerScreen.tsx
import { Drawer } from "vaul";
import { jsx, jsxs } from "react/jsx-runtime";
function DrawerScreen({
  title,
  description,
  style,
  children
}) {
  return /* @__PURE__ */ jsx(
    Drawer.Root,
    {
      handleOnly: true,
      direction: "right",
      open: !!children,
      repositionInputs: false,
      children: /* @__PURE__ */ jsx(Drawer.Portal, { children: /* @__PURE__ */ jsxs(
        Drawer.Content,
        {
          style: {
            height: "100vh",
            minHeight: "100vh",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            outline: "none"
          },
          children: [
            /* @__PURE__ */ jsx(Drawer.Title, { style: { display: "none" }, children: title }),
            /* @__PURE__ */ jsx(Drawer.Description, { style: { display: "none" }, children: description }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-full overflow-y-auto", style, children })
          ]
        }
      ) })
    }
  );
}

// src/context/StackNavigatorContext.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var ScreenType = /* @__PURE__ */ ((ScreenType2) => {
  ScreenType2["PAGE"] = "page";
  ScreenType2["DRAWER"] = "drawer";
  ScreenType2["SINGLE"] = "single";
  return ScreenType2;
})(ScreenType || {});
var DEFAULT_STACK = parseJSON(
  sessionStorage.getItem("navigator/screen")
) || { screen: "Home", params: {} };
var StackNavigatorContext = createContext({
  route: void 0,
  navigate: (screen, options) => {
  }
});
function StackNavigatorProvider({
  screens,
  drawer,
  layout: Layout2
}) {
  const [stacks, setStacks] = useState([DEFAULT_STACK]);
  const route = useMemo(() => {
    const stack = stacks[stacks.length - 1];
    const screen = screens[stack.screen];
    return {
      name: stack.screen,
      params: stack.params,
      type: screen.type,
      title: screen.title,
      screen: screen.screen,
      back: screen.back
    };
  }, [stacks, screens]);
  const Screen = useMemo(() => {
    if (route.type !== "page" /* PAGE */) {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : void 0;
    }
    return route.screen;
  }, [route, stacks, screens]);
  const drawerScreen = useMemo(() => {
    if (route.type !== "page" /* PAGE */) {
      const Screen2 = route.screen;
      return /* @__PURE__ */ jsx2(
        DrawerScreen,
        {
          title: route.title,
          description: route.title,
          style: drawer.style,
          children: /* @__PURE__ */ jsx2(Screen2, { params: route.params })
        }
      );
    }
  }, [route, stacks, screens]);
  const navigate = useCallback(
    (screen, options) => {
      if (typeof screen === "string") {
        if (!Object.keys(screens).includes(screen)) {
          console.warn(`Screen ${screen} not found`);
          return;
        }
      }
      const type = options?.type || "push";
      setStacks((prev) => {
        if (screen === -1 && prev.length > 1) {
          return prev.slice(0, -1);
        } else if (typeof screen === "string") {
          if (prev[prev.length - 1]?.screen === screen) {
            return prev;
          }
          const route2 = { screen, params: options?.params || {} };
          if (type === "replace") {
            return [...prev.slice(0, -1), route2];
          } else {
            return [...prev, route2].slice(-10);
          }
        }
        return prev;
      });
    },
    [screens]
  );
  const value = useMemo(
    () => ({
      route,
      navigate
    }),
    [route, navigate]
  );
  useEffect(() => {
    if (route.type === "drawer") {
      return;
    }
    sessionStorage.setItem(
      "navigator/screen",
      JSON.stringify({
        screen: route.name,
        params: route.params
      })
    );
  }, [route]);
  return /* @__PURE__ */ jsx2(StackNavigatorContext.Provider, { value, children: /* @__PURE__ */ jsxs2(
    Layout2,
    {
      styles: {
        tabBar: !!drawerScreen ? { display: "none" } : {}
      },
      children: [
        Screen && /* @__PURE__ */ jsx2(
          "div",
          {
            style: {
              height: "100%",
              overflowY: "auto",
              display: !!drawerScreen ? "none" : "block"
            },
            children: /* @__PURE__ */ jsx2(Screen, { params: route.params })
          }
        ),
        drawerScreen
      ]
    }
  ) });
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
var Typography = React.memo(
  ({
    as = "p",
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
    return React.createElement(as, {
      className,
      style: {
        textAlign: align,
        fontWeight: weight,
        ...config.size[size],
        ...ellipsis ? {
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap"
        } : {},
        ...lineClamp ? {
          WebkitLineClamp: lineClamp,
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        } : {},
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
    });
  }
);

// src/components/AmountInput.tsx
import { useState as useState2, useEffect as useEffect2 } from "react";

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
  const [isComposing, setIsComposing] = useState2(false);
  const [inputValue, setInputValue] = useState2(value);
  useEffect2(() => {
    if (value === "") {
      setInputValue("");
    }
  }, [value]);
  return /* @__PURE__ */ jsx4(
    Input,
    {
      ...props,
      className: props.className ? `input ${props.className}` : "input",
      type: "text",
      value: isComposing ? inputValue : formatAmount(inputValue),
      onCompositionStart: () => {
        setIsComposing(true);
      },
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
import { useMemo as useMemo2 } from "react";
import clsx2 from "clsx";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// src/icons/Spinner.tsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function Spinner(props) {
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      "aria-hidden": "true",
      className: "animate-spin text-white/50 fill-white/80",
      viewBox: "0 0 100 101",
      fill: "none",
      ...props,
      children: [
        /* @__PURE__ */ jsx5(
          "path",
          {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx5(
          "path",
          {
            d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
            fill: "currentFill"
          }
        )
      ]
    }
  );
}

// src/icons/ChevronDown.tsx
import { jsx as jsx6 } from "react/jsx-runtime";
function ChevronDown(props) {
  return /* @__PURE__ */ jsx6(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      "aria-hidden": "true",
      ...props,
      children: /* @__PURE__ */ jsx6("path", { d: "m6 9 6 6 6-6" })
    }
  );
}

// src/icons/Check.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function Check(props) {
  return /* @__PURE__ */ jsx7(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      "aria-hidden": "true",
      ...props,
      children: /* @__PURE__ */ jsx7("path", { d: "M20 6 9 17l-5-5" })
    }
  );
}

// src/components/Dropdown.tsx
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
function Dropdown({
  value,
  items,
  size = "md",
  showIcon = true,
  classes,
  disabled,
  placeholder,
  onChange
}) {
  const typographySize = size === "sm" ? "1" : "2";
  const selected = useMemo2(() => {
    return items.find((item) => item.key === value) ?? null;
  }, [items, value]);
  return /* @__PURE__ */ jsxs4(DropdownMenu.Root, { children: [
    /* @__PURE__ */ jsx8(DropdownMenu.Trigger, { asChild: true, disabled, children: /* @__PURE__ */ jsxs4(
      "button",
      {
        className: clsx2(
          "flex items-center justify-between gap-2 !scale-[100%] !opacity-100 cursor-pointer outline-none",
          classes?.trigger
        ),
        children: [
          selected ? /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2", children: [
            selected.icon && showIcon && selected.icon,
            /* @__PURE__ */ jsx8(Typography, { size: typographySize, children: selected.name })
          ] }) : /* @__PURE__ */ jsx8(Typography, { className: "text-placeholder", size: typographySize, children: placeholder }),
          /* @__PURE__ */ jsx8(
            ChevronDown,
            {
              width: size === "sm" ? 16 : 20,
              height: size === "sm" ? 16 : 20,
              strokeWidth: 1.5,
              className: "text-icon-foreground max-w-4"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx8(DropdownMenu.Portal, { children: /* @__PURE__ */ jsx8(
      DropdownMenu.Content,
      {
        className: "min-w-[220px] rounded-md bg-modal p-2 mx-2 mb-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade",
        sideOffset: 5,
        children: items.map((item) => /* @__PURE__ */ jsxs4(
          DropdownMenu.Item,
          {
            className: clsx2(
              "relative flex p-2 select-none items-center rounded-lg leading-none outline-none",
              selected?.key === item.key && "bg-default"
            ),
            onClick: () => {
              onChange(item.key);
            },
            children: [
              item.icon ? /* @__PURE__ */ jsx8("div", { style: { marginRight: "10px" }, children: item.icon }) : null,
              /* @__PURE__ */ jsx8(Typography, { size: "2", children: item.name }),
              selected?.key === item.key && /* @__PURE__ */ jsx8(Check, { className: "w-4 h-4 ml-auto" })
            ]
          },
          item.key
        ))
      }
    ) })
  ] });
}

// src/components/Layout.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function Root2({
  className,
  style,
  children
}) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      className,
      style: {
        display: "flex",
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
function Header({
  style,
  children
}) {
  return /* @__PURE__ */ jsx9(
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
function HeaderLeft({
  style,
  children
}) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "8px",
        flex: 1,
        ...style
      },
      children
    }
  );
}
function HeaderTitle({
  style,
  children
}) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        flex: 1,
        ...style
      },
      children
    }
  );
}
function HeaderRight({
  style,
  children
}) {
  return /* @__PURE__ */ jsx9(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "8px",
        flex: 1,
        ...style
      },
      children
    }
  );
}
function Main({
  style,
  children
}) {
  return /* @__PURE__ */ jsx9(
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
  Root: Root2,
  Header,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
  Main
};

// src/components/List.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function List({ items, children, ...props }) {
  return /* @__PURE__ */ jsx10("div", { ...props, children: items.map((item) => children(item)) });
}

// src/components/TabBar.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function TabBar({ style, items, renderItem }) {
  return /* @__PURE__ */ jsx11(
    List,
    {
      style: {
        width: "100vw",
        left: 0,
        bottom: 0,
        padding: "4px 16px 0px",
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
import clsx3 from "clsx";
import { Drawer as Drawer2 } from "vaul";
import { jsx as jsx12, jsxs as jsxs5 } from "react/jsx-runtime";
function Modal({
  type = "default",
  handle = true,
  trigger,
  title,
  children,
  classes,
  ...props
}) {
  const Root3 = type === "default" ? Drawer2.Root : Drawer2.NestedRoot;
  return /* @__PURE__ */ jsxs5(Root3, { ...props, children: [
    trigger && /* @__PURE__ */ jsx12(Drawer2.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxs5(Drawer2.Portal, { children: [
      /* @__PURE__ */ jsx12(
        Drawer2.Overlay,
        {
          style: {
            position: "fixed",
            inset: "0",
            zIndex: "30"
          }
        }
      ),
      /* @__PURE__ */ jsx12(
        Drawer2.Content,
        {
          style: {
            position: "fixed",
            zIndex: 30,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "0 4px 28px"
          },
          children: /* @__PURE__ */ jsxs5(
            "div",
            {
              className: clsx3(classes?.content, "bg-modal"),
              style: {
                paddingTop: 16,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                gap: 16
              },
              children: [
                /* @__PURE__ */ jsx12(Drawer2.Title, { className: "hidden", children: title }),
                /* @__PURE__ */ jsx12(Drawer2.Description, { className: "hidden", children: title }),
                handle && /* @__PURE__ */ jsx12(Drawer2.Handle, {}),
                children
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/Image.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function Image({ src, ...props }) {
  const url = typeof src === "string" ? src : src.src;
  return /* @__PURE__ */ jsx13("img", { src: url, ...props });
}

// src/components/Button.tsx
import clsx4 from "clsx";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx14 } from "react/jsx-runtime";
var buttonVariants = cva2(
  "flex items-center justify-center cursor-pointer focus:outline-none outline-none disabled:cursor-not-allowed disabled:opacity-50",
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
        secondary: "",
        destructive: ""
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
        className: "text-primary [&:not(:disabled)]:hover:text-primary/90"
      },
      {
        variant: "text",
        color: "secondary",
        className: "text-secondary [&:not(:disabled)]:hover:text-secondary/90"
      },
      {
        variant: "text",
        color: "destructive",
        className: "text-destructive [&:not(:disabled)]:hover:text-destructive/90"
      },
      {
        variant: "contained",
        color: "primary",
        className: "bg-primary [&:not(:disabled)]:hover:bg-primary/90"
      },
      {
        variant: "contained",
        color: "secondary",
        className: "bg-secondary [&:not(:disabled)]:hover:bg-secondary/90"
      },
      {
        variant: "contained",
        color: "destructive",
        className: "bg-destructive [&:not(:disabled)]:hover:bg-destructive/90"
      },
      {
        variant: "icon",
        color: "primary",
        className: "bg-primary [&:not(:disabled)]:hover:bg-primary/90"
      },
      {
        variant: "icon",
        color: "secondary",
        className: "bg-secondary [&:not(:disabled)]:hover:bg-secondary/90"
      },
      {
        variant: "icon",
        color: "destructive",
        className: "bg-destructive [&:not(:disabled)]:hover:bg-destructive/90"
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
  isLoading = false,
  children,
  onClick,
  ...props
}) {
  return /* @__PURE__ */ jsx14(
    "button",
    {
      className: clsx4(
        buttonVariants({ variant, width, size, color, rounded, className })
      ),
      onClick: (event) => {
        if (isLoading) return;
        onClick?.(event);
      },
      ...props,
      children: isLoading ? /* @__PURE__ */ jsx14(Spinner, { width: 24, height: 24 }) : children
    }
  );
}

// src/components/Textarea.tsx
import { cva as cva3 } from "class-variance-authority";
import clsx5 from "clsx";
import { jsx as jsx15 } from "react/jsx-runtime";
var textareaVariants = cva3(
  "focus:outline-none outline-none resize-none",
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: []
  }
);
function Textarea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx15("textarea", { className: clsx5(textareaVariants({ className })), ...props });
}

// src/components/Canvas.tsx
import { useEffect as useEffect3, useRef } from "react";
import { jsx as jsx16 } from "react/jsx-runtime";
function Canvas({
  image,
  size = 40,
  ...props
}) {
  const canvasRef = useRef(null);
  useEffect3(() => {
    if (image) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, size, size);
        }
      }
    }
  }, [image, size]);
  return /* @__PURE__ */ jsx16("canvas", { ref: canvasRef, ...props, width: size, height: size });
}

// src/components/Confirm.tsx
import { jsx as jsx17, jsxs as jsxs6 } from "react/jsx-runtime";
function Confirm({
  title,
  description,
  onOpenChange,
  cancel,
  confirm,
  ...props
}) {
  return /* @__PURE__ */ jsxs6(Modal, { title, onOpenChange, ...props, children: [
    /* @__PURE__ */ jsx17(Typography, { size: "4", children: title }),
    /* @__PURE__ */ jsx17("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx17(Typography, { size: "2", children: description }) }),
    /* @__PURE__ */ jsxs6("div", { className: "flex w-full gap-6 py-4 px-6", children: [
      /* @__PURE__ */ jsx17(
        Button,
        {
          width: "full",
          rounded: "full",
          variant: "contained",
          color: "secondary",
          size: "sm",
          onClick: () => {
            onOpenChange(false);
          },
          children: "Cancel",
          ...cancel
        }
      ),
      /* @__PURE__ */ jsx17(
        Button,
        {
          width: "full",
          rounded: "full",
          variant: "contained",
          size: "sm",
          color: "destructive",
          ...confirm,
          onClick: (event) => {
            onOpenChange(false);
            confirm.onClick?.(event);
          }
        }
      )
    ] })
  ] });
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
import { useEffect as useEffect4, useRef as useRef2 } from "react";
function useClientOnce(setup) {
  const canCall = useRef2(true);
  useEffect4(() => {
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

// src/hooks/useIsMounted.ts
import { useEffect as useEffect5, useState as useState3 } from "react";
function useIsMounted() {
  const [isMounted, setIsMounted] = useState3(false);
  useEffect5(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

// src/hooks/useDisclosure.ts
import { useState as useState4 } from "react";
function useDisclosure() {
  const [isOpen, setIsOpen] = useState4(false);
  const onOpenChange = (open) => {
    setIsOpen(open);
  };
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  return { isOpen, onOpenChange, onOpen, onClose };
}
export {
  AmountInput,
  Button,
  Canvas,
  Check,
  ChevronDown,
  Confirm,
  DEFAULT_STACK,
  Dropdown,
  Image,
  Input,
  Layout,
  List,
  Modal,
  ScreenType,
  Spinner,
  StackNavigatorContext,
  StackNavigatorProvider,
  TabBar,
  Textarea,
  Typography,
  buttonVariants,
  formatAmount,
  inputVariants,
  textareaVariants,
  useClientOnce,
  useDisclosure,
  useIsMounted,
  useNavigate,
  useRefValue,
  useRoute
};
