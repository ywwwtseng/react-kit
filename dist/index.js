var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/navigation/StackNavigator.tsx
import {
  createContext,
  use,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import { parseJSON } from "@ywwwtseng/ywjs";
import { jsx } from "react/jsx-runtime";
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
  screens: {},
  stacks: [],
  navigate: (screen, options) => {
  }
});
function StackNavigatorProvider({
  screens,
  children
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
      navigate,
      screens,
      stacks
    }),
    [route, navigate, screens, stacks]
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
  return /* @__PURE__ */ jsx(StackNavigatorContext.Provider, { value, children });
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

// src/navigation/Navigator.tsx
import { use as use2, useMemo as useMemo2 } from "react";

// src/components/DrawerScreen.tsx
import { Drawer } from "vaul";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function DrawerScreen({
  title,
  description,
  style,
  children
}) {
  return /* @__PURE__ */ jsx2(
    Drawer.Root,
    {
      handleOnly: true,
      direction: "right",
      open: !!children,
      repositionInputs: false,
      children: /* @__PURE__ */ jsx2(Drawer.Portal, { children: /* @__PURE__ */ jsxs(
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
            /* @__PURE__ */ jsx2(Drawer.Title, { style: { display: "none" }, children: title }),
            /* @__PURE__ */ jsx2(Drawer.Description, { style: { display: "none" }, children: description }),
            /* @__PURE__ */ jsx2("div", { className: "w-full h-full overflow-y-auto", style, children })
          ]
        }
      ) })
    }
  );
}

// src/navigation/Navigator.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function Navigator({ drawer }) {
  const { route, stacks, screens } = use2(StackNavigatorContext);
  const Screen = useMemo2(() => {
    if (route.type !== "page" /* PAGE */) {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : void 0;
    }
    return route.screen;
  }, [route, stacks, screens]);
  const drawerScreen = useMemo2(() => {
    if (route.type !== "page" /* PAGE */) {
      const Screen2 = route.screen;
      return /* @__PURE__ */ jsx3(
        DrawerScreen,
        {
          title: route.title,
          description: route.title,
          style: drawer.style,
          children: /* @__PURE__ */ jsx3(Screen2, { params: route.params })
        }
      );
    }
  }, [route]);
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    Screen && /* @__PURE__ */ jsx3(
      "div",
      {
        style: {
          height: "100%",
          overflowY: "auto",
          display: !!drawerScreen ? "none" : "block"
        },
        children: /* @__PURE__ */ jsx3(Screen, { params: route.params })
      }
    ),
    drawerScreen
  ] });
}

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
import { jsx as jsx4 } from "react/jsx-runtime";
var inputVariants = cva("focus:outline-none outline-none", {
  variants: {},
  defaultVariants: {},
  compoundVariants: []
});
function Input({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx4("input", { className: clsx(inputVariants({ className })), ...props });
}

// src/components/AmountInput.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx5(
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
import { useMemo as useMemo3 } from "react";
import clsx2 from "clsx";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// src/icons/Spinner.tsx
import { jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
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
        /* @__PURE__ */ jsx6(
          "path",
          {
            d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx6(
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
import { jsx as jsx7 } from "react/jsx-runtime";
function ChevronDown(props) {
  return /* @__PURE__ */ jsx7(
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
      children: /* @__PURE__ */ jsx7("path", { d: "m6 9 6 6 6-6" })
    }
  );
}

// src/icons/Check.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
function Check(props) {
  return /* @__PURE__ */ jsx8(
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
      children: /* @__PURE__ */ jsx8("path", { d: "M20 6 9 17l-5-5" })
    }
  );
}

// src/icons/Flag.tsx
var Flag_exports = {};
__export(Flag_exports, {
  EN: () => EN,
  TW: () => TW
});
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function EN(props) {
  return /* @__PURE__ */ jsxs4(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 512 512",
      ...props,
      children: [
        /* @__PURE__ */ jsx9("mask", { id: "a", children: /* @__PURE__ */ jsx9("circle", { cx: "256", cy: "256", r: "256", fill: "#fff" }) }),
        /* @__PURE__ */ jsxs4("g", { mask: "url(#a)", children: [
          /* @__PURE__ */ jsx9(
            "path",
            {
              fill: "#eee",
              d: "m0 0 8 22-8 23v23l32 54-32 54v32l32 48-32 48v32l32 54-32 54v68l22-8 23 8h23l54-32 54 32h32l48-32 48 32h32l54-32 54 32h68l-8-22 8-23v-23l-32-54 32-54v-32l-32-48 32-48v-32l-32-54 32-54V0l-22 8-23-8h-23l-54 32-54-32h-32l-48 32-48-32h-32l-54 32L68 0H0z"
            }
          ),
          /* @__PURE__ */ jsx9(
            "path",
            {
              fill: "#0052b4",
              d: "M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z"
            }
          ),
          /* @__PURE__ */ jsx9(
            "path",
            {
              fill: "#d80027",
              d: "M0 0v45l131 131h45L0 0zm208 0v208H0v96h208v208h96V304h208v-96H304V0h-96zm259 0L336 131v45L512 0h-45zM176 336 0 512h45l131-131v-45zm160 0 176 176v-45L381 336h-45z"
            }
          )
        ] })
      ]
    }
  );
}
function TW(props) {
  return /* @__PURE__ */ jsxs4(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 512 512",
      ...props,
      children: [
        /* @__PURE__ */ jsx9("mask", { id: "a", children: /* @__PURE__ */ jsx9("circle", { cx: "256", cy: "256", r: "256", fill: "#fff" }) }),
        /* @__PURE__ */ jsxs4("g", { mask: "url(#a)", children: [
          /* @__PURE__ */ jsx9("path", { fill: "#d80027", d: "M0 256 256 0h256v512H0z" }),
          /* @__PURE__ */ jsx9("path", { fill: "#0052b4", d: "M256 256V0H0v256z" }),
          /* @__PURE__ */ jsx9(
            "path",
            {
              fill: "#eee",
              d: "m222.6 149.8-31.3 14.7 16.7 30.3-34-6.5-4.3 34.3-23.6-25.2-23.7 25.2-4.3-34.3-34 6.5 16.7-30.3-31.2-14.7 31.2-14.7-16.6-30.3 34 6.5 4.2-34.3 23.7 25.3L169.7 77l4.3 34.3 34-6.5-16.7 30.3z"
            }
          ),
          /* @__PURE__ */ jsx9("circle", { cx: "146.1", cy: "149.8", r: "47.7", fill: "#0052b4" }),
          /* @__PURE__ */ jsx9("circle", { cx: "146.1", cy: "149.8", r: "41.5", fill: "#eee" })
        ] })
      ]
    }
  );
}

// src/components/Dropdown.tsx
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
function Dropdown({
  value,
  trigger,
  items,
  size = "md",
  classes,
  disabled,
  placeholder,
  onChange
}) {
  const typographySize = size === "sm" ? "1" : "2";
  const selected = useMemo3(() => {
    return items.find((item) => item.key === value) ?? null;
  }, [items, value]);
  return /* @__PURE__ */ jsxs5(DropdownMenu.Root, { children: [
    /* @__PURE__ */ jsx10(DropdownMenu.Trigger, { asChild: true, disabled, children: trigger || /* @__PURE__ */ jsxs5(
      "button",
      {
        className: clsx2(
          "flex items-center justify-between gap-2 !scale-[100%] !opacity-100 cursor-pointer outline-none",
          classes?.trigger
        ),
        children: [
          selected ? /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
            selected.icon && selected.icon,
            /* @__PURE__ */ jsx10(Typography, { size: typographySize, children: selected.name })
          ] }) : /* @__PURE__ */ jsx10(Typography, { className: "text-placeholder", size: typographySize, children: placeholder }),
          /* @__PURE__ */ jsx10(
            ChevronDown,
            {
              width: size === "sm" ? 16 : 20,
              height: size === "sm" ? 16 : 20,
              strokeWidth: 1.5,
              className: "max-w-4"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsx10(DropdownMenu.Portal, { children: /* @__PURE__ */ jsx10(
      DropdownMenu.Content,
      {
        className: "z-10 min-w-[220px] rounded-md bg-modal p-2 mx-2 mb-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade",
        sideOffset: 5,
        children: items.map((item) => /* @__PURE__ */ jsxs5(
          DropdownMenu.Item,
          {
            className: clsx2(
              "relative flex p-2 select-none items-center rounded-lg leading-none outline-none",
              selected?.key === item.key && "bg-active"
            ),
            onClick: () => {
              onChange(item.key);
            },
            children: [
              item.icon ? /* @__PURE__ */ jsx10("div", { style: { marginRight: "10px" }, children: item.icon }) : null,
              /* @__PURE__ */ jsx10(Typography, { size: "2", children: item.name }),
              selected?.key === item.key && /* @__PURE__ */ jsx10(Check, { className: "w-4 h-4 ml-auto" })
            ]
          },
          item.key
        ))
      }
    ) })
  ] });
}

// src/components/Layout.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function Root2({
  className,
  style,
  children
}) {
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(
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
        zIndex: 1,
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
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11(
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
import { jsx as jsx12 } from "react/jsx-runtime";
function List({ items, children, ...props }) {
  return /* @__PURE__ */ jsx12("div", { ...props, children: items.map((item) => children(item)) });
}

// src/components/TabBar.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function TabBar({ style, items, renderItem }) {
  return /* @__PURE__ */ jsx13(
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
import { jsx as jsx14, jsxs as jsxs6 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs6(Root3, { ...props, children: [
    trigger && /* @__PURE__ */ jsx14(Drawer2.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxs6(Drawer2.Portal, { children: [
      /* @__PURE__ */ jsx14(
        Drawer2.Overlay,
        {
          style: {
            position: "fixed",
            inset: "0",
            zIndex: 9999
          }
        }
      ),
      /* @__PURE__ */ jsx14(
        Drawer2.Content,
        {
          style: {
            position: "fixed",
            zIndex: 9999,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "0 4px 28px"
          },
          children: /* @__PURE__ */ jsxs6(
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
                /* @__PURE__ */ jsx14(Drawer2.Title, { className: "hidden", children: title }),
                /* @__PURE__ */ jsx14(Drawer2.Description, { className: "hidden", children: title }),
                handle && /* @__PURE__ */ jsx14(Drawer2.Handle, {}),
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
import { jsx as jsx15 } from "react/jsx-runtime";
function Image({ src, ...props }) {
  const url = typeof src === "string" ? src : src.src;
  return /* @__PURE__ */ jsx15("img", { src: url, ...props });
}

// src/components/Button.tsx
import clsx4 from "clsx";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx16 } from "react/jsx-runtime";
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
        active: "",
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
        color: "active",
        className: "text-active [&:not(:disabled)]:hover:text-active/90"
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
        variant: "contained",
        color: "active",
        className: "bg-active [&:not(:disabled)]:hover:bg-active/90"
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
        color: "active",
        className: "bg-active [&:not(:disabled)]:hover:bg-active/90"
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
  return /* @__PURE__ */ jsx16(
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
      children: isLoading ? /* @__PURE__ */ jsx16(Spinner, { width: 24, height: 24 }) : children
    }
  );
}

// src/components/Textarea.tsx
import { cva as cva3 } from "class-variance-authority";
import clsx5 from "clsx";
import { jsx as jsx17 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx17("textarea", { className: clsx5(textareaVariants({ className })), ...props });
}

// src/components/Canvas.tsx
import { useEffect as useEffect3, useRef } from "react";
import { jsx as jsx18 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx18("canvas", { ref: canvasRef, ...props, width: size, height: size });
}

// src/components/Confirm.tsx
import { jsx as jsx19, jsxs as jsxs7 } from "react/jsx-runtime";
function Confirm({
  title,
  description,
  onOpenChange,
  cancel,
  confirm,
  ...props
}) {
  return /* @__PURE__ */ jsxs7(Modal, { title, onOpenChange, ...props, children: [
    /* @__PURE__ */ jsx19(Typography, { size: "4", children: title }),
    /* @__PURE__ */ jsx19("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx19(Typography, { size: "2", children: description }) }),
    /* @__PURE__ */ jsxs7("div", { className: "flex w-full gap-6 py-4 px-6", children: [
      /* @__PURE__ */ jsx19(
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
      /* @__PURE__ */ jsx19(
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
  Flag_exports as Flag,
  Image,
  Input,
  Layout,
  List,
  Modal,
  Navigator,
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
