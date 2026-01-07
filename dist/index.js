var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { default as default2 } from "react-hot-toast";

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
import { useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
function toPlainString(num) {
  return String(num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    (_, sign, int, frac, exp) => {
      exp = Number(exp);
      const digits = int + frac;
      if (exp < 0) {
        const pos = int.length + exp;
        return sign + "0." + "0".repeat(-pos) + digits;
      } else {
        return sign + digits + "0".repeat(exp - frac.length);
      }
    }
  );
}
function isMobile() {
  const ua = navigator.userAgent;
  const isTouch = navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);
  return isMobileUA || isTouch;
}
function formatAmount(input) {
  if (!input) return "";
  const parts = input.split(".");
  const rawIntegerPart = parts[0] || "";
  if (rawIntegerPart === "" || /^0+$/.test(rawIntegerPart)) {
    const integerPart2 = rawIntegerPart;
    if (parts.length > 1) {
      return `${integerPart2}.${parts[1]}`;
    } else if (input.endsWith(".")) {
      return `${integerPart2}.`;
    }
    return integerPart2;
  }
  const leadingZerosMatch = rawIntegerPart.match(/^(0+)/);
  if (leadingZerosMatch) {
    const leadingZeros = leadingZerosMatch[1];
    const significantPart = rawIntegerPart.slice(leadingZeros.length);
    if (significantPart) {
      const formattedSignificant = significantPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );
      const integerPart2 = leadingZeros + formattedSignificant;
      if (parts.length > 1) {
        return `${integerPart2}.${parts[1]}`;
      } else if (input.endsWith(".")) {
        return `${integerPart2}.`;
      }
      return integerPart2;
    }
  }
  const integerPart = rawIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  onInputChange,
  maxDigits,
  ...props
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);
  useEffect(() => {
    if (inputValue === "." && value === "") {
      return;
    }
    if (inputValue === "0" && value === "") {
      setInputValue("");
    }
    if (Number(inputValue) === Number(value)) return;
    if (inputValue !== "" && value === "") {
      setInputValue("");
    } else {
      setInputValue(value);
    }
  }, [value, inputValue]);
  useEffect(() => {
    onInputChange?.(inputValue);
  }, [inputValue, onInputChange]);
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      className: props.className ? `input ${props.className}` : "input",
      type: "text",
      value: isComposing ? inputValue : formatAmount(inputValue),
      onChange: (e) => {
        if (isMobile()) {
          setIsComposing(true);
        }
        let value2 = e.target.value.replace(/,/g, "");
        if (value2 === "" || value2 === ".") {
          setInputValue(value2);
          onChange("");
          return;
        }
        if (value2.startsWith(".") && value2.length > 1) {
          const previousValue = inputValue.replace(/,/g, "");
          if (previousValue.startsWith("0.") && previousValue.slice(1) === value2) {
          } else {
            value2 = "0" + value2;
          }
        }
        if ((value2.match(/\./g) || []).length > 1) return;
        if (!/^\.?\d*\.?\d*$/.test(value2)) return;
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
          onChange(toPlainString(Number(value2)));
        }
      }
    }
  );
}

// src/components/Layout.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function Root({
  className,
  style,
  children
}) {
  return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
  return /* @__PURE__ */ jsx2(
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
  HeaderTitle,
  Main
};

// src/components/List.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function List({ items, children, ...props }) {
  return /* @__PURE__ */ jsx3("div", { ...props, children: items.map((item) => children(item)) });
}

// src/components/TabBar.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function TabBar({ style, items, renderItem }) {
  return /* @__PURE__ */ jsx4(
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
import clsx from "clsx";
import { Drawer } from "vaul";
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
function Modal({
  type = "default",
  handle = true,
  trigger,
  title,
  children,
  classes,
  ...props
}) {
  const Root2 = type === "default" ? Drawer.Root : Drawer.NestedRoot;
  return /* @__PURE__ */ jsxs(Root2, { ...props, children: [
    trigger && /* @__PURE__ */ jsx5(Drawer.Trigger, { asChild: true, children: trigger }),
    /* @__PURE__ */ jsxs(Drawer.Portal, { children: [
      /* @__PURE__ */ jsx5(
        Drawer.Overlay,
        {
          style: {
            position: "fixed",
            inset: "0",
            zIndex: 9999
          }
        }
      ),
      /* @__PURE__ */ jsx5(
        Drawer.Content,
        {
          style: {
            position: "fixed",
            zIndex: 9999,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "0 4px 28px"
          },
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: clsx(classes?.content, "bg-modal"),
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
                /* @__PURE__ */ jsx5(Drawer.Title, { className: "hidden", children: title }),
                /* @__PURE__ */ jsx5(Drawer.Description, { className: "hidden", children: title }),
                handle && /* @__PURE__ */ jsx5(Drawer.Handle, {}),
                children
              ]
            }
          )
        }
      )
    ] })
  ] });
}

// src/components/Button.tsx
import { useState as useState2, useMemo } from "react";

// src/icons/Spinner.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function Spinner(props) {
  return /* @__PURE__ */ jsxs2(
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
import { jsx as jsx9, jsxs as jsxs3 } from "react/jsx-runtime";
function EN(props) {
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 512 512",
      ...props,
      children: [
        /* @__PURE__ */ jsx9("mask", { id: "a", children: /* @__PURE__ */ jsx9("circle", { cx: "256", cy: "256", r: "256", fill: "#fff" }) }),
        /* @__PURE__ */ jsxs3("g", { mask: "url(#a)", children: [
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
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 512 512",
      ...props,
      children: [
        /* @__PURE__ */ jsx9("mask", { id: "a", children: /* @__PURE__ */ jsx9("circle", { cx: "256", cy: "256", r: "256", fill: "#fff" }) }),
        /* @__PURE__ */ jsxs3("g", { mask: "url(#a)", children: [
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

// src/components/Button.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
var colors = {
  primary: "#3b82f6",
  // blue-500
  secondary: "rgba(66,66,66,0.8)",
  // gray-800 with 80% opacity
  active: "#10b981",
  // emerald-500
  destructive: "#ef4444"
  // red-500
};
var sizes = {
  xs: { fontSize: "0.75rem", minHeight: "32px", padding: "0.25rem 0.5rem" },
  sm: { fontSize: "0.875rem", minHeight: "40px", padding: "0.5rem 0.75rem" },
  md: { fontSize: "1.125rem", minHeight: "48px", padding: "0.75rem 1rem" }
};
var borderRadius = {
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px"
};
var withOpacity = (color, opacity = 0.9) => {
  if (color.startsWith("rgb")) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (match) {
      const originalOpacity = match[4] ? parseFloat(match[4]) : 1;
      const newOpacity = originalOpacity * opacity;
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${newOpacity})`;
    }
  }
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
function Button({
  variant = "text",
  width,
  size = "md",
  color = "primary",
  rounded,
  isLoading = false,
  children,
  onClick,
  style,
  disabled,
  ...props
}) {
  const [isHovered, setIsHovered] = useState2(false);
  const buttonStyle = useMemo(() => {
    const baseStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      outline: "none",
      border: "none",
      opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s ease-in-out",
      ...style
    };
    if (width === "full") {
      baseStyle.width = "100%";
    }
    if (size) {
      const sizeConfig = sizes[size];
      baseStyle.fontSize = sizeConfig.fontSize;
      baseStyle.minHeight = sizeConfig.minHeight;
      if (variant !== "icon") {
        baseStyle.padding = sizeConfig.padding;
      }
    }
    if (rounded) {
      baseStyle.borderRadius = borderRadius[rounded];
    } else if (variant === "icon") {
      baseStyle.borderRadius = borderRadius.full;
    }
    if (variant === "icon" && size) {
      const iconSize = sizes[size].minHeight;
      baseStyle.width = iconSize;
      baseStyle.height = iconSize;
      baseStyle.padding = "0";
    }
    const colorValue = colors[color || "primary"];
    const hoverColor = isHovered && !disabled ? withOpacity(colorValue, 0.9) : colorValue;
    if (variant === "text") {
      baseStyle.backgroundColor = "transparent";
      baseStyle.color = hoverColor;
    } else if (variant === "contained") {
      baseStyle.backgroundColor = hoverColor;
      baseStyle.color = "#ffffff";
    } else if (variant === "icon") {
      baseStyle.backgroundColor = hoverColor;
      baseStyle.color = "#ffffff";
    }
    return baseStyle;
  }, [variant, width, size, color, rounded, isHovered, disabled, style]);
  return /* @__PURE__ */ jsx10(
    "button",
    {
      style: buttonStyle,
      onClick: (event) => {
        if (isLoading || disabled) return;
        onClick?.(event);
      },
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      disabled: disabled || isLoading,
      ...props,
      children: isLoading ? /* @__PURE__ */ jsx10(Spinner, { width: 24, height: 24 }) : children
    }
  );
}

// src/components/Input.tsx
import { cva } from "class-variance-authority";
import clsx2 from "clsx";
import { jsx as jsx11 } from "react/jsx-runtime";
var inputVariants = cva(
  "focus:outline-none outline-none placeholder:text-placeholder",
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: []
  }
);
function Input({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx11("input", { className: clsx2(inputVariants({ className })), ...props });
}

// src/components/Textarea.tsx
import { cva as cva2 } from "class-variance-authority";
import clsx3 from "clsx";
import { jsx as jsx12 } from "react/jsx-runtime";
var textareaVariants = cva2(
  "focus:outline-none outline-none resize-none placeholder:text-placeholder",
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
  return /* @__PURE__ */ jsx12("textarea", { className: clsx3(textareaVariants({ className })), ...props });
}

// src/components/Canvas.tsx
import { useEffect as useEffect2, useRef } from "react";
import { jsx as jsx13 } from "react/jsx-runtime";
function Canvas({
  image,
  size = 40,
  ...props
}) {
  const canvasRef = useRef(null);
  useEffect2(() => {
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
  return /* @__PURE__ */ jsx13("canvas", { ref: canvasRef, ...props, width: size, height: size });
}

// src/components/Confirm.tsx
import { jsx as jsx14, jsxs as jsxs4 } from "react/jsx-runtime";
function Confirm({
  title,
  description,
  onOpenChange,
  cancel,
  confirm,
  ...props
}) {
  return /* @__PURE__ */ jsxs4(Modal, { title, onOpenChange, ...props, children: [
    /* @__PURE__ */ jsx14(Typography, { size: "2", children: title }),
    /* @__PURE__ */ jsx14("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx14(Typography, { size: "1", children: description }) }),
    /* @__PURE__ */ jsxs4(
      "div",
      {
        style: {
          display: "flex",
          width: "100%",
          gap: 24,
          padding: "16px 24px"
        },
        children: [
          /* @__PURE__ */ jsx14(
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
          /* @__PURE__ */ jsx14(
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
        ]
      }
    )
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
import { useEffect as useEffect3, useRef as useRef2 } from "react";
function useClientOnce(setup) {
  const canCall = useRef2(true);
  useEffect3(() => {
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
import { useEffect as useEffect4, useState as useState3 } from "react";
function useIsMounted() {
  const [isMounted, setIsMounted] = useState3(false);
  useEffect4(() => {
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

// src/navigation/StackNavigatorContext.tsx
import {
  createContext,
  use,
  useState as useState5,
  useCallback,
  useMemo as useMemo2,
  useEffect as useEffect5
} from "react";
import { parseJSON } from "@ywwwtseng/ywjs";
import { jsx as jsx15 } from "react/jsx-runtime";
var ScreenType = /* @__PURE__ */ ((ScreenType2) => {
  ScreenType2["PAGE"] = "page";
  ScreenType2["DRAWER"] = "drawer";
  ScreenType2["SINGLE"] = "single";
  return ScreenType2;
})(ScreenType || {});
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
  const [stacks, setStacks] = useState5([
    parseJSON(sessionStorage.getItem("navigator/screen")) || {
      screen: "Home",
      params: {}
    }
  ]);
  const route = useMemo2(() => {
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
          const route2 = { screen, params: options?.params || {} };
          if (type === "replace") {
            return [...prev.slice(0, -1), route2];
          }
          if (prev[prev.length - 1]?.screen === screen) {
            return [...prev.slice(0, -1), route2];
          }
          return [...prev, route2].slice(-10);
        }
        return prev;
      });
    },
    [screens]
  );
  const value = useMemo2(
    () => ({
      route,
      navigate,
      screens,
      stacks
    }),
    [route, navigate, screens, stacks]
  );
  useEffect5(() => {
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
  return /* @__PURE__ */ jsx15(StackNavigatorContext.Provider, { value, children: typeof children === "function" ? children(value) : children });
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
import { use as use2, useMemo as useMemo3 } from "react";

// src/components/DrawerScreen.tsx
import { Drawer as Drawer2 } from "vaul";
import { jsx as jsx16, jsxs as jsxs5 } from "react/jsx-runtime";
function DrawerScreen({
  title,
  description,
  style,
  children
}) {
  return /* @__PURE__ */ jsx16(
    Drawer2.Root,
    {
      handleOnly: true,
      direction: "right",
      open: !!children,
      repositionInputs: false,
      children: /* @__PURE__ */ jsx16(Drawer2.Portal, { children: /* @__PURE__ */ jsxs5(
        Drawer2.Content,
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
            /* @__PURE__ */ jsx16(Drawer2.Title, { style: { display: "none" }, children: title }),
            /* @__PURE__ */ jsx16(Drawer2.Description, { style: { display: "none" }, children: description }),
            /* @__PURE__ */ jsx16(
              "div",
              {
                style: {
                  width: "100%",
                  height: "100%",
                  overflowY: "auto",
                  ...style
                },
                children
              }
            )
          ]
        }
      ) })
    }
  );
}

// src/navigation/Navigator.tsx
import { Fragment, jsx as jsx17, jsxs as jsxs6 } from "react/jsx-runtime";
function Navigator({ drawer }) {
  const { route, stacks, screens } = use2(StackNavigatorContext);
  const Screen = useMemo3(() => {
    if (route.type !== "page" /* PAGE */) {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : void 0;
    }
    return route.screen;
  }, [route, stacks, screens]);
  const drawerScreen = useMemo3(() => {
    if (route.type !== "page" /* PAGE */) {
      const Screen2 = route.screen;
      return /* @__PURE__ */ jsx17(
        DrawerScreen,
        {
          title: route.title,
          description: route.title,
          style: drawer.style,
          children: /* @__PURE__ */ jsx17(Screen2, { params: route.params })
        }
      );
    }
  }, [route]);
  return /* @__PURE__ */ jsxs6(Fragment, { children: [
    Screen && /* @__PURE__ */ jsx17(
      "div",
      {
        style: {
          height: "100%",
          overflowY: "auto",
          display: !!drawerScreen ? "none" : "block"
        },
        children: /* @__PURE__ */ jsx17(Screen, { params: route.params })
      }
    ),
    drawerScreen
  ] });
}

// src/app/ClientContext.tsx
import { AppError } from "@ywwwtseng/ywjs";
import {
  useRef as useRef3,
  useMemo as useMemo5,
  useCallback as useCallback3,
  createContext as createContext3
} from "react";
import { Request } from "@ywwwtseng/request";

// src/app/AppStateContext.tsx
import {
  createContext as createContext2,
  useCallback as useCallback2,
  useMemo as useMemo4
} from "react";
import { create } from "zustand";
import { produce } from "immer";
import { merge } from "@ywwwtseng/ywjs";
import { jsx as jsx18 } from "react/jsx-runtime";
var AppStateContext = createContext2(
  void 0
);
var useAppStateStore = create((set) => ({
  state: {},
  loading: [],
  update: (commands) => {
    set((store) => {
      return produce(store, (draft) => {
        for (const command of commands) {
          if (command.type === "update" && typeof command.payload === "function") {
            return command.payload(draft);
          } else {
            if (command.type === "update" && command.target) {
              draft.state[command.target] = command.payload;
            } else if (command.type === "merge" && command.target) {
              draft.state[command.target] = merge(
                draft.state[command.target],
                command.payload
              );
            } else if (command.type === "replace") {
              const payload = command.payload;
              const target = command.target || "id";
              if (typeof payload === "object" && payload && target in payload) {
                for (const key of Object.keys(draft.state)) {
                  const state = draft.state[key];
                  if (!Array.isArray(state)) continue;
                  const index = state.findIndex((item) => {
                    if (item[target] !== payload[target]) return false;
                    const itemKeys = Object.keys(item);
                    const payloadKeys = Object.keys(payload);
                    if (itemKeys.length !== payloadKeys.length) return false;
                    return itemKeys.every((key2) => payloadKeys.includes(key2));
                  });
                  if (index !== -1) {
                    state[index] = payload;
                  }
                }
              }
            } else if (command.type === "unshift" && command.target) {
              const state = draft.state[command.target];
              if (Array.isArray(state)) {
                state.unshift(command.payload);
              }
            } else if (command.type === "push" && command.target) {
              const state = draft.state[command.target];
              if (Array.isArray(state)) {
                state.push(command.payload);
              }
            } else if (command.type === "delete" && command.target) {
              const payload = command.payload;
              const target = command.target || "id";
              for (const key of Object.keys(draft.state)) {
                const state = draft.state[key];
                if (!Array.isArray(state)) continue;
                const index = state.findIndex(
                  (item) => item[target] === payload
                );
                if (index !== -1) {
                  state.splice(index, 1);
                }
              }
            }
          }
        }
      });
    });
  }
}));
function AppStateProvider({ children }) {
  const { update } = useAppStateStore();
  const clear = useCallback2((key) => {
    update([
      {
        type: "update",
        target: "state",
        payload: (draft) => {
          delete draft.state[key];
        }
      }
    ]);
  }, [update]);
  const value = useMemo4(
    () => ({
      update,
      clear
    }),
    [update, clear]
  );
  return /* @__PURE__ */ jsx18(AppStateContext.Provider, { value, children });
}

// src/app/utils.ts
function getQueryKey(path, params) {
  return params && Object.keys(params).length > 0 ? JSON.stringify({ path, params }) : path;
}

// src/app/ClientContext.tsx
import { jsx as jsx19 } from "react/jsx-runtime";
var ClientContext = createContext3(void 0);
function ClientProvider({
  url,
  transformRequest,
  onError,
  children
}) {
  const loadingRef = useRef3([]);
  const navigate = useNavigate();
  const { update } = useAppStateStore();
  const request = useMemo5(
    () => new Request({
      transformRequest
    }),
    [transformRequest]
  );
  const query = useCallback3(
    async (path, params, options) => {
      const key = getQueryKey(path, params);
      loadingRef.current.push(key);
      update([
        {
          type: "update",
          target: "loading",
          payload: (draft) => {
            draft.loading.push(key);
          }
        }
      ]);
      try {
        const data = await request.post(url, { type: "query", path, params: params ?? {} });
        if (data.commands) {
          update(data.commands);
        }
        if (data.error) {
          throw new AppError(data.error, data.message ?? "Unknown error");
        }
        if (data.navigate) {
          navigate(data.navigate.screen, {
            type: "replace",
            params: data.navigate.params
          });
        }
        if (data.notify) {
          options?.onNotify?.(data.notify);
        }
        return { key, data };
      } catch (error) {
        onError?.(error);
        throw error;
      } finally {
        loadingRef.current = loadingRef.current.filter((k) => k !== key);
        update([
          {
            type: "update",
            target: "loading",
            payload: (draft) => {
              draft.loading = draft.loading.filter((k) => k !== key);
            }
          }
        ]);
      }
    },
    [request]
  );
  const mutate = useCallback3(
    async (action, payload) => {
      try {
        let data;
        if (payload instanceof FormData) {
          payload.append("mutation:type", "mutate");
          payload.append("mutation:action", action);
          data = await request.post(url, payload);
        } else {
          data = await request.post(url, { type: "mutate", action, payload });
        }
        if (data.error) {
          throw new AppError(data.error, data.message ?? "Unknown error");
        }
        if (data.commands) {
          update(data.commands);
        }
        if (data.navigate) {
          navigate(data.navigate.screen, {
            type: "replace",
            params: data.navigate.params
          });
        }
        return { data };
      } catch (error) {
        onError?.(error);
        throw error;
      }
    },
    [request]
  );
  const value = useMemo5(
    () => ({
      query,
      mutate,
      loadingRef
    }),
    [query, mutate, loadingRef]
  );
  return /* @__PURE__ */ jsx19(ClientContext.Provider, { value, children });
}

// src/app/AppContext.tsx
import { Toaster } from "react-hot-toast";

// src/app/I18nContext.tsx
import {
  useCallback as useCallback4,
  useMemo as useMemo6,
  createContext as createContext4,
  use as use3
} from "react";
import { get as get2, getLocale, translate } from "@ywwwtseng/ywjs";

// src/app/hooks/useAppState.ts
import { get } from "@ywwwtseng/ywjs";
function useAppState(path) {
  return useAppStateStore((store) => get(store.state, path));
}

// src/app/I18nContext.tsx
import { jsx as jsx20 } from "react/jsx-runtime";
var I18nContext = createContext4(
  void 0
);
function I18nProvider({
  locales,
  path = ["me", "language_code"],
  callback = "en",
  children
}) {
  const state = useAppState(path[0]);
  const language_code = useMemo6(() => {
    if (!state) return callback;
    return get2(state, path.slice(1)) || callback;
  }, [state, path, callback]);
  const locale = useMemo6(() => {
    if (!locales) return null;
    return getLocale(locales, language_code, locales[callback]);
  }, [language_code, callback, locales]);
  const t = useCallback4(
    (key, params) => {
      if (!locale) return key;
      return translate(locale, key, params);
    },
    [locale]
  );
  const value = useMemo6(
    () => ({
      language_code,
      t
    }),
    [locale, t]
  );
  return /* @__PURE__ */ jsx20(I18nContext.Provider, { value, children });
}

// src/app/AppContext.tsx
import { jsx as jsx21, jsxs as jsxs7 } from "react/jsx-runtime";
function AppProvider({
  url,
  transformRequest,
  onError,
  i18nProps = {},
  toasterProps = {},
  children
}) {
  return /* @__PURE__ */ jsxs7(AppStateProvider, { children: [
    /* @__PURE__ */ jsx21(ClientProvider, { url, transformRequest, onError, children: /* @__PURE__ */ jsx21(I18nProvider, { ...i18nProps, children }) }),
    /* @__PURE__ */ jsx21(Toaster, { ...toasterProps })
  ] });
}

// src/app/hooks/useInfiniteQuery.ts
import { use as use5, useMemo as useMemo7, useState as useState6, useCallback as useCallback5, useEffect as useEffect6 } from "react";

// src/app/hooks/useClient.ts
import { use as use4 } from "react";
function useClient() {
  const context = use4(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}

// src/app/hooks/useInfiniteQuery.ts
var getNextPageParam = (lastPage) => {
  return Array.isArray(lastPage) ? lastPage?.[lastPage.length - 1]?.created_at ?? null : null;
};
function useInfiniteQuery(path, options) {
  const route = useRoute();
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const state = useAppStateStore((store) => store.state);
  const [pageKeys, setPageKeys] = useState6([]);
  const data = useMemo7(() => {
    return pageKeys.map((key) => state[key]).filter(Boolean);
  }, [pageKeys, state]);
  const { update } = use5(AppStateContext);
  const { query, loadingRef } = useClient();
  const hasNextPage = useMemo7(() => {
    const page = data[data.length - 1];
    if (Array.isArray(page)) {
      const limit = options.params?.limit;
      if (typeof limit === "number") {
        return page.length === limit;
      }
      if (page.length === 0) {
        return false;
      }
    }
    return true;
  }, [data]);
  const fetchNextPage = useCallback5(() => {
    if (!hasNextPage) {
      return;
    }
    const params = options?.params ?? {};
    if (!enabled) {
      return;
    }
    const cursor = getNextPageParam(
      data ? data[data.length - 1] : void 0
    );
    if (cursor) {
      params.cursor = cursor;
    }
    const queryKey = getQueryKey(path, params);
    if (loadingRef.current.includes(queryKey)) {
      return;
    }
    setPageKeys((pageKeys2) => [...pageKeys2, queryKey]);
    query(path, params);
  }, [path, JSON.stringify(options), hasNextPage, enabled, data]);
  const isLoading = useMemo7(() => {
    if (!enabled) {
      return false;
    }
    return pageKeys.length > 0 ? state[pageKeys[pageKeys.length - 1]] === void 0 : false;
  }, [pageKeys, state, enabled]);
  useEffect6(() => {
    if (!enabled) {
      return;
    }
    const params = options?.params ?? {};
    const queryKey = getQueryKey(path, params);
    if (loadingRef.current.includes(queryKey)) {
      return;
    }
    if (state[queryKey] !== void 0 && refetchOnMount === false) {
      return;
    }
    setPageKeys((pageKeys2) => [...pageKeys2, queryKey]);
    query(path, params);
    return () => {
      if (refetchOnMount) {
        update([
          {
            type: "update",
            payload: (draft) => {
              pageKeys.forEach((page) => {
                delete draft.state[page];
              });
            }
          }
        ]);
        setPageKeys([]);
      }
    };
  }, [path, JSON.stringify(options), enabled, route.name]);
  return {
    data: data.length > 0 ? data.flat() : void 0,
    isLoading,
    hasNextPage,
    fetchNextPage
  };
}

// src/app/hooks/useMutation.ts
import { useState as useState7, useCallback as useCallback6 } from "react";
import toast from "react-hot-toast";

// src/app/hooks/useI18n.ts
import { use as use6 } from "react";
function useI18n() {
  const context = use6(I18nContext);
  if (!context) {
    console.trace("useI18n must be used within a I18nProvider");
    throw new Error("useI18n must be used within a I18nProvider");
  }
  return context;
}

// src/app/hooks/useMutation.ts
function useMutation(action, { onError, onSuccess } = {}) {
  const client = useClient();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState7(false);
  const isLoadingRef = useRefValue(isLoading);
  const mutate = useCallback6(
    (payload) => {
      if (isLoadingRef.current) {
        return Promise.reject({
          message: "Already loading"
        });
      }
      isLoadingRef.current = true;
      setIsLoading(true);
      return client.mutate(action, payload).then(({ data }) => {
        if (data.notify) {
          (toast[data.notify.type] || toast)?.(t?.(data.notify.message, data.notify.params) ?? data.notify.message);
        }
        onSuccess?.(data);
        return data;
      }).catch((res) => {
        onError?.(res.data);
        const message = res.data.message ?? "Unknown error";
        toast.error(message);
        return {
          ok: false
        };
      }).finally(() => {
        isLoadingRef.current = false;
        setIsLoading(false);
      });
    },
    [client.mutate, action, t]
  );
  return {
    mutate,
    isLoading
  };
}

// src/app/hooks/useQuery.ts
import { use as use7, useEffect as useEffect7, useCallback as useCallback7, useMemo as useMemo8, useRef as useRef4 } from "react";
import toast2 from "react-hot-toast";
function useQuery(path, options) {
  const isUnMountedRef = useRef4(false);
  const { t } = useI18n();
  const tRef = useRefValue(t);
  const { query, loadingRef } = useClient();
  const { clear } = use7(AppStateContext);
  const route = useRoute();
  const currentRouteRef = useRef4(route.name);
  const key = useMemo8(() => getQueryKey(path, options?.params ?? {}), [path, JSON.stringify(options?.params ?? {})]);
  const currentKeyRef = useRef4(key);
  const params = options?.params ?? {};
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const isLoading = useAppStateStore((store) => store.loading).includes(key);
  const data = useAppStateStore((store) => store.state[key]);
  const refetch = useCallback7(() => {
    if (!enabled) {
      return;
    }
    if (loadingRef.current.includes(key)) {
      return;
    }
    query(path, params).then(({ key: key2 }) => {
      if (options?.autoClearCache && key2 !== currentKeyRef.current) {
        clear(key2);
      }
    });
  }, [key, enabled, route.name]);
  useEffect7(() => {
    currentKeyRef.current = key;
    return () => {
      if (options?.autoClearCache) {
        clear(key);
      }
    };
  }, [key]);
  useEffect7(() => {
    return () => {
      isUnMountedRef.current = true;
    };
  }, []);
  useEffect7(() => {
    if (isUnMountedRef.current) {
      return;
    }
    if (!enabled) {
      return;
    }
    if (loadingRef.current.includes(key)) {
      return;
    }
    if (data !== void 0 && refetchOnMount === false) {
      return;
    }
    if (refetchOnMount && currentRouteRef.current !== route.name) {
      return;
    }
    query(path, params).then(({ key: key2, data: data2 }) => {
      if (data2.notify) {
        (toast2[data2.notify.type] || toast2)?.(tRef.current?.(data2.notify.message, data2.notify.params) ?? data2.notify.message);
      }
      if (options?.autoClearCache && key2 !== currentKeyRef.current) {
        clear(key2);
      }
    });
  }, [key, enabled, route.name]);
  return {
    refetch,
    isLoading,
    data
  };
}
export {
  AmountInput,
  AppProvider,
  AppStateContext,
  AppStateProvider,
  Button,
  Canvas,
  Check,
  ChevronDown,
  ClientContext,
  ClientProvider,
  Confirm,
  Flag_exports as Flag,
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
  formatAmount,
  getQueryKey,
  inputVariants,
  textareaVariants,
  default2 as toast,
  useAppState,
  useAppStateStore,
  useClient,
  useClientOnce,
  useDisclosure,
  useI18n,
  useInfiniteQuery,
  useIsMounted,
  useMutation,
  useNavigate,
  useQuery,
  useRefValue,
  useRoute
};
