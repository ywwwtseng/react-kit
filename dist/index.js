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
  ref,
  style,
  children
}) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      ref,
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
import { Drawer } from "vaul";
import { jsx as jsx5, jsxs } from "react/jsx-runtime";
function Modal({
  type = "default",
  handle = true,
  trigger,
  title,
  children,
  classes,
  styles,
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
              className: classes?.content,
              style: {
                paddingTop: 16,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                gap: 16,
                backgroundColor: "var(--modal)",
                ...styles?.content
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

// src/icons/Loading.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function Loading(props) {
  return /* @__PURE__ */ jsxs2(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      "aria-hidden": "true",
      className: "animate-spin text-white/50 fill-white/80",
      viewBox: "0 0 100 101",
      style: { color: "currentColor" },
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

// src/icons/Search.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function Search(props) {
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: [
        /* @__PURE__ */ jsx7("path", { d: "m21 21-4.34-4.34" }),
        /* @__PURE__ */ jsx7("circle", { cx: "11", cy: "11", r: "8" })
      ]
    }
  );
}

// src/icons/Spinner.tsx
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
function Spinner(props) {
  return /* @__PURE__ */ jsx8("svg", { fill: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", ...props, children: /* @__PURE__ */ jsxs4("g", { children: [
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", opacity: ".14" }),
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", transform: "rotate(30 12 12)", opacity: ".29" }),
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", transform: "rotate(60 12 12)", opacity: ".43" }),
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", transform: "rotate(90 12 12)", opacity: ".57" }),
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", transform: "rotate(120 12 12)", opacity: ".71" }),
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", transform: "rotate(150 12 12)", opacity: ".86" }),
    /* @__PURE__ */ jsx8("rect", { x: "11", y: "1", width: "2", height: "5", transform: "rotate(180 12 12)" }),
    /* @__PURE__ */ jsx8("animateTransform", { attributeName: "transform", type: "rotate", calcMode: "discrete", dur: "0.75s", values: "0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12", repeatCount: "indefinite" })
  ] }) });
}

// src/icons/ChevronLeft.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
function ChevronLeft(props) {
  return /* @__PURE__ */ jsx9(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: /* @__PURE__ */ jsx9("path", { d: "m15 18-6-6 6-6" })
    }
  );
}

// src/icons/ChevronRight.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function ChevronRight(props) {
  return /* @__PURE__ */ jsx10(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: /* @__PURE__ */ jsx10("path", { d: "m9 18 6-6-6-6" })
    }
  );
}

// src/icons/ChevronDown.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
function ChevronDown(props) {
  return /* @__PURE__ */ jsx11(
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
      children: /* @__PURE__ */ jsx11("path", { d: "m6 9 6 6 6-6" })
    }
  );
}

// src/icons/Check.tsx
import { jsx as jsx12 } from "react/jsx-runtime";
function Check(props) {
  return /* @__PURE__ */ jsx12(
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
      children: /* @__PURE__ */ jsx12("path", { d: "M20 6 9 17l-5-5" })
    }
  );
}

// src/icons/WalletConnect.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function WalletConnect(props) {
  return /* @__PURE__ */ jsx13("svg", { viewBox: "0 0 300 185", version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink", ...props, children: /* @__PURE__ */ jsx13("g", { stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd", children: /* @__PURE__ */ jsx13("g", { id: "walletconnect-logo-alt", fill: "currentColor", fillRule: "nonzero", children: /* @__PURE__ */ jsx13("path", { d: "M61.4385429,36.2562612 C110.349767,-11.6319051 189.65053,-11.6319051 238.561752,36.2562612 L244.448297,42.0196786 C246.893858,44.4140867 246.893858,48.2961898 244.448297,50.690599 L224.311602,70.406102 C223.088821,71.6033071 221.106302,71.6033071 219.883521,70.406102 L211.782937,62.4749541 C177.661245,29.0669724 122.339051,29.0669724 88.2173582,62.4749541 L79.542302,70.9685592 C78.3195204,72.1657633 76.337001,72.1657633 75.1142214,70.9685592 L54.9775265,51.2530561 C52.5319653,48.8586469 52.5319653,44.9765439 54.9775265,42.5821357 L61.4385429,36.2562612 Z M280.206339,77.0300061 L298.128036,94.5769031 C300.573585,96.9713 300.573599,100.85338 298.128067,103.247793 L217.317896,182.368927 C214.872352,184.763353 210.907314,184.76338 208.461736,182.368989 C208.461726,182.368979 208.461714,182.368967 208.461704,182.368957 L151.107561,126.214385 C150.496171,125.615783 149.504911,125.615783 148.893521,126.214385 C148.893517,126.214389 148.893514,126.214393 148.89351,126.214396 L91.5405888,182.368927 C89.095052,184.763359 85.1300133,184.763399 82.6844276,182.369014 C82.6844133,182.369 82.684398,182.368986 82.6843827,182.36897 L1.87196327,103.246785 C-0.573596939,100.852377 -0.573596939,96.9702735 1.87196327,94.5758653 L19.7936929,77.028998 C22.2392531,74.6345898 26.2042918,74.6345898 28.6498531,77.028998 L86.0048306,133.184355 C86.6162214,133.782957 87.6074796,133.782957 88.2188704,133.184355 C88.2188796,133.184346 88.2188878,133.184338 88.2188969,133.184331 L145.571,77.028998 C148.016505,74.6345347 151.981544,74.6344449 154.427161,77.028798 C154.427195,77.0288316 154.427229,77.0288653 154.427262,77.028899 L211.782164,133.184331 C212.393554,133.782932 213.384814,133.782932 213.996204,133.184331 L271.350179,77.0300061 C273.79574,74.6355969 277.760778,74.6355969 280.206339,77.0300061 Z", id: "WalletConnect" }) }) }) });
}

// src/icons/ArrowDown.tsx
import { jsx as jsx14, jsxs as jsxs5 } from "react/jsx-runtime";
function ArrowDown(props) {
  return /* @__PURE__ */ jsxs5(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: [
        /* @__PURE__ */ jsx14("path", { d: "M12 5v14" }),
        /* @__PURE__ */ jsx14("path", { d: "m19 12-7 7-7-7" })
      ]
    }
  );
}

// src/icons/ArrowUp.tsx
import { jsx as jsx15, jsxs as jsxs6 } from "react/jsx-runtime";
function ArrowUp(props) {
  return /* @__PURE__ */ jsxs6(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: [
        /* @__PURE__ */ jsx15("path", { d: "m5 12 7-7 7 7" }),
        /* @__PURE__ */ jsx15("path", { d: "M12 19V5" })
      ]
    }
  );
}

// src/icons/ArrowUpDown.tsx
import { jsx as jsx16, jsxs as jsxs7 } from "react/jsx-runtime";
function ArrowUpDown(props) {
  return /* @__PURE__ */ jsxs7(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      ...props,
      children: [
        /* @__PURE__ */ jsx16("path", { d: "m21 16-4 4-4-4" }),
        /* @__PURE__ */ jsx16("path", { d: "M17 20V4" }),
        /* @__PURE__ */ jsx16("path", { d: "m3 8 4-4 4 4" }),
        /* @__PURE__ */ jsx16("path", { d: "M7 4v16" })
      ]
    }
  );
}

// src/components/Button.tsx
import { jsx as jsx17 } from "react/jsx-runtime";
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
  textColor = "#ffffff",
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
      whiteSpace: "nowrap",
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
    const colorValue = colors[color] ?? color;
    const hoverColor = isHovered && !disabled ? withOpacity(colorValue, 0.9) : colorValue;
    if (variant === "text") {
      baseStyle.backgroundColor = "transparent";
      baseStyle.color = hoverColor;
    } else if (variant === "contained") {
      baseStyle.backgroundColor = hoverColor;
      baseStyle.color = textColor;
    } else if (variant === "icon") {
      baseStyle.backgroundColor = hoverColor;
      baseStyle.color = textColor;
    }
    return baseStyle;
  }, [variant, width, size, color, rounded, isHovered, disabled, style]);
  return /* @__PURE__ */ jsx17(
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
      children: isLoading ? /* @__PURE__ */ jsx17(Spinner, { width: 24, height: 24 }) : children
    }
  );
}

// src/components/Input.tsx
import { cva } from "class-variance-authority";
import clsx from "clsx";
import { jsx as jsx18 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx18("input", { className: clsx(inputVariants({ className })), ...props });
}

// src/components/Textarea.tsx
import { cva as cva2 } from "class-variance-authority";
import clsx2 from "clsx";
import { jsx as jsx19 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx19("textarea", { className: clsx2(textareaVariants({ className })), ...props });
}

// src/components/Canvas.tsx
import { useEffect as useEffect2, useRef } from "react";
import { jsx as jsx20 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx20("canvas", { ref: canvasRef, ...props, width: size, height: size });
}

// src/components/Confirm.tsx
import { jsx as jsx21, jsxs as jsxs8 } from "react/jsx-runtime";
function Confirm({
  title,
  description,
  onOpenChange,
  cancel,
  confirm,
  ...props
}) {
  return /* @__PURE__ */ jsxs8(Modal, { title, onOpenChange, ...props, children: [
    /* @__PURE__ */ jsx21(Typography, { size: "2", children: title }),
    /* @__PURE__ */ jsx21("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsx21(Typography, { size: "1", children: description }) }),
    /* @__PURE__ */ jsxs8(
      "div",
      {
        style: {
          display: "flex",
          width: "100%",
          gap: 24,
          padding: "16px 24px"
        },
        children: [
          /* @__PURE__ */ jsx21(
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
          /* @__PURE__ */ jsx21(
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

// src/hooks/useDebounce.ts
import { useState as useState5, useEffect as useEffect5 } from "react";
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState5(value);
  useEffect5(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// src/hooks/useInterval.ts
import { useRef as useRef3, useEffect as useEffect6 } from "react";
function useInterval(callback, { delay, enabled = true, timeout = Infinity, onTimeout }) {
  const callbackRef = useRefValue(callback);
  const timeoutRef = useRef3(null);
  const pollStartedAt = useRef3(null);
  useEffect6(() => {
    if (!enabled) {
      return;
    }
    timeoutRef.current = setInterval(() => {
      if (!pollStartedAt.current) {
        pollStartedAt.current = Date.now();
      }
      const elapsed = Date.now() - pollStartedAt.current;
      if (elapsed > timeout) {
        if (timeoutRef.current) {
          if (onTimeout) {
            onTimeout();
          }
          clearInterval(timeoutRef.current);
          timeoutRef.current = null;
          pollStartedAt.current = null;
        }
      } else {
        callbackRef.current?.();
      }
    }, delay);
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
        pollStartedAt.current = null;
      }
    };
  }, [delay, enabled]);
}

// src/hooks/usePersistedCooldown.ts
import { useState as useState6, useEffect as useEffect7, useCallback } from "react";
var STORAGE_PREFIX = "cooldown:";
function usePersistedCooldown(storageKey, durationSeconds) {
  const key = `${STORAGE_PREFIX}${storageKey}`;
  const getEndTime = useCallback(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const end = parseInt(raw, 10);
      return Number.isFinite(end) ? end : null;
    } catch {
      return null;
    }
  }, [key]);
  const [endTime, setEndTime] = useState6(() => getEndTime());
  const [now, setNow] = useState6(() => Date.now());
  useEffect7(() => {
    setEndTime(getEndTime());
  }, [getEndTime]);
  useEffect7(() => {
    const interval = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(interval);
  }, []);
  const effectiveEnd = endTime != null && endTime > now ? endTime : null;
  const remainingSeconds = effectiveEnd != null ? Math.max(0, Math.ceil((effectiveEnd - now) / 1e3)) : 0;
  const isCoolingDown = remainingSeconds > 0;
  useEffect7(() => {
    if (endTime != null && now >= endTime) {
      try {
        localStorage.removeItem(key);
      } catch {
      }
      setEndTime(null);
    }
  }, [endTime, now, key]);
  const startCooldown = useCallback(() => {
    const end = Date.now() + durationSeconds * 1e3;
    try {
      localStorage.setItem(key, String(end));
    } catch {
    }
    setEndTime(end);
    setNow(Date.now());
  }, [durationSeconds, key]);
  return {
    isCoolingDown,
    remainingSeconds,
    startCooldown
  };
}

// src/navigation/StackView.tsx
import { use as use2, useMemo as useMemo3, useRef as useRef4, useEffect as useEffect9 } from "react";

// src/navigation/DrawerView.tsx
import { Drawer as Drawer2 } from "vaul";
import { jsx as jsx22, jsxs as jsxs9 } from "react/jsx-runtime";
function DrawerView({
  title,
  description,
  style,
  children
}) {
  return /* @__PURE__ */ jsx22(
    Drawer2.Root,
    {
      handleOnly: true,
      direction: "right",
      open: !!children,
      repositionInputs: false,
      children: /* @__PURE__ */ jsx22(Drawer2.Portal, { children: /* @__PURE__ */ jsxs9(
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
            /* @__PURE__ */ jsx22(Drawer2.Title, { style: { display: "none" }, children: title }),
            /* @__PURE__ */ jsx22(Drawer2.Description, { style: { display: "none" }, children: description }),
            /* @__PURE__ */ jsx22(
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

// src/navigation/StackNavigatorContext.tsx
import {
  createContext,
  use,
  useState as useState7,
  useCallback as useCallback2,
  useMemo as useMemo2,
  useEffect as useEffect8
} from "react";
import { parseJSON } from "@ywwwtseng/ywjs";
import { jsx as jsx23 } from "react/jsx-runtime";
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
  const [stacks, setStacks] = useState7(() => {
    if (typeof window === "undefined") {
      return [];
    }
    return [
      parseJSON(sessionStorage.getItem("navigator/screen")) || {
        screen: "Home",
        params: {}
      }
    ];
  });
  const route = useMemo2(() => {
    const stack = stacks[stacks.length - 1];
    if (!stack) {
      return void 0;
    }
    const screen = screens[stack.screen];
    if (!screen) {
      return void 0;
    }
    return {
      name: stack.screen,
      params: stack.params,
      type: screen.type,
      title: screen.title,
      screen: screen.screen,
      back: screen.back
    };
  }, [stacks, screens]);
  const navigate = useCallback2(
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
  useEffect8(() => {
    if (!route) {
      return;
    }
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
  return /* @__PURE__ */ jsx23(StackNavigatorContext.Provider, { value, children: typeof children === "function" ? children(value) : children });
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

// src/navigation/StackView.tsx
import { Fragment, jsx as jsx24, jsxs as jsxs10 } from "react/jsx-runtime";
function StackView({ drawer = { style: {} } }) {
  const ref = useRef4(null);
  const { route, stacks, screens } = use2(StackNavigatorContext);
  const drawerView = useMemo3(() => {
    if (route.type !== "page" /* PAGE */) {
      const Screen = route.screen;
      return /* @__PURE__ */ jsx24(
        DrawerView,
        {
          title: route.title,
          description: route.title,
          style: drawer.style,
          children: /* @__PURE__ */ jsx24(Screen, { params: route.params })
        }
      );
    }
  }, [route]);
  const MainView = useMemo3(() => {
    if (route.type !== "page" /* PAGE */) {
      const stack = stacks[stacks.length - 2];
      return stack ? screens[stack.screen].screen : void 0;
    }
    return route.screen;
  }, [route, stacks, screens]);
  useEffect9(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, [route]);
  if (!MainView && !drawerView) {
    return void 0;
  }
  return /* @__PURE__ */ jsxs10(Fragment, { children: [
    MainView && /* @__PURE__ */ jsx24(
      "div",
      {
        ref,
        style: {
          height: "100%",
          overflowY: "auto",
          display: !!drawerView ? "none" : "block"
        },
        children: /* @__PURE__ */ jsx24(MainView, { params: route.params })
      }
    ),
    drawerView
  ] });
}

// src/app/providers/ClientProvider.tsx
import { AppError } from "@ywwwtseng/ywjs";
import {
  useRef as useRef5,
  useMemo as useMemo5,
  useCallback as useCallback4,
  createContext as createContext3
} from "react";
import { Request } from "@ywwwtseng/request";

// src/app/providers/AppStateProvider.tsx
import {
  createContext as createContext2,
  useCallback as useCallback3,
  useMemo as useMemo4
} from "react";
import { create } from "zustand";
import { produce } from "immer";
import { merge } from "@ywwwtseng/ywjs";
import { jsx as jsx25 } from "react/jsx-runtime";
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
  const clear = useCallback3((key) => {
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
  return /* @__PURE__ */ jsx25(AppStateContext.Provider, { value, children });
}

// src/app/utils.ts
function getQueryKey(path, params) {
  return params && Object.keys(params).length > 0 ? JSON.stringify({ path, params }) : path;
}

// src/app/providers/ClientProvider.tsx
import { jsx as jsx26 } from "react/jsx-runtime";
var ClientContext = createContext3(void 0);
function ClientProvider({
  url,
  transformRequest,
  onError,
  children
}) {
  const loadingRef = useRef5([]);
  const navigate = useNavigate();
  const { update } = useAppStateStore();
  const request = useMemo5(
    () => new Request({
      transformRequest
    }),
    [transformRequest]
  );
  const query = useCallback4(
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
  const mutate = useCallback4(
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
  return /* @__PURE__ */ jsx26(ClientContext.Provider, { value, children });
}

// src/app/providers/AppUIProvider.tsx
import {
  createContext as createContext4,
  useCallback as useCallback5,
  use as use3,
  useMemo as useMemo6,
  useState as useState8
} from "react";
import { jsx as jsx27, jsxs as jsxs11 } from "react/jsx-runtime";
var AppUIContext = createContext4(
  void 0
);
function AppUIProvider({ children }) {
  const [loadingUI, setLoadingUI] = useState8(0);
  const showLoadingUI = useCallback5((show) => {
    if (show) {
      setLoadingUI((prev) => prev + 1);
    } else {
      setLoadingUI((prev) => prev - 1);
    }
  }, []);
  const value = useMemo6(
    () => ({
      loadingUI,
      showLoadingUI
    }),
    [loadingUI, showLoadingUI]
  );
  return /* @__PURE__ */ jsxs11(AppUIContext.Provider, { value, children: [
    children,
    loadingUI > 0 && /* @__PURE__ */ jsx27("div", { style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2147483647
    }, children: /* @__PURE__ */ jsx27(Spinner, { width: 24, height: 24 }) })
  ] });
}
function useAppUI() {
  const context = use3(AppUIContext);
  if (!context) {
    throw new Error("useAppUI must be used within an AppUIProvider");
  }
  return context;
}

// src/app/providers/AppProvider.tsx
import { Toaster } from "react-hot-toast";

// src/app/providers/I18nProvider.tsx
import {
  useCallback as useCallback6,
  useMemo as useMemo7,
  createContext as createContext5,
  use as use4
} from "react";
import { get as get2, getLocale, translate } from "@ywwwtseng/ywjs";

// src/app/hooks/useQueryState.ts
import { get } from "@ywwwtseng/ywjs";
function useQueryState(path) {
  return useAppStateStore((store) => {
    if (!path) {
      return store.state;
    }
    return get(store.state, path);
  });
}

// src/app/providers/I18nProvider.tsx
import { jsx as jsx28 } from "react/jsx-runtime";
var I18nContext = createContext5(
  void 0
);
function I18nProvider({
  locales,
  path = ["me", "language_code"],
  callback = "en",
  children
}) {
  const state = useQueryState(path[0]);
  const language_code = useMemo7(() => {
    if (!state) return callback;
    return get2(state, path.slice(1)) || callback;
  }, [state, path, callback]);
  const locale = useMemo7(() => {
    if (!locales) return null;
    return getLocale(locales, language_code, locales[callback]);
  }, [language_code, callback, locales]);
  const t = useCallback6(
    (key, params) => {
      if (!locale) return key;
      return translate(locale, key, params);
    },
    [locale]
  );
  const value = useMemo7(
    () => ({
      language_code,
      t
    }),
    [locale, t]
  );
  return /* @__PURE__ */ jsx28(I18nContext.Provider, { value, children });
}

// src/app/providers/AppProvider.tsx
import { jsx as jsx29, jsxs as jsxs12 } from "react/jsx-runtime";
function PluginsWrapper({ plugins, children }) {
  return plugins.reduce((acc, plugin) => plugin.provider({ children: acc, ...plugin.options }), children);
}
function AppProvider({
  url,
  transformRequest,
  onError,
  plugins = [],
  i18nProps = {},
  toasterProps = {},
  children
}) {
  return /* @__PURE__ */ jsx29(AppUIProvider, { children: /* @__PURE__ */ jsxs12(AppStateProvider, { children: [
    /* @__PURE__ */ jsx29(ClientProvider, { url, transformRequest, onError, children: /* @__PURE__ */ jsx29(I18nProvider, { ...i18nProps, children: /* @__PURE__ */ jsx29(PluginsWrapper, { plugins, children }) }) }),
    /* @__PURE__ */ jsx29(Toaster, { ...toasterProps })
  ] }) });
}

// src/app/hooks/useMutation.ts
import { useState as useState9, useCallback as useCallback8 } from "react";

// src/app/hooks/useClient.ts
import { use as use5 } from "react";
function useClient() {
  const context = use5(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
}

// src/app/hooks/useNotify.ts
import { useCallback as useCallback7 } from "react";
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

// src/app/hooks/useNotify.ts
function useNotify() {
  const { t } = useI18n();
  return useCallback7((type, message, params) => {
    (toast[type] || toast)?.(t?.(message, params) ?? message);
  }, [t]);
}

// src/app/hooks/useMutation.ts
function useMutation(action, { ignoreNotify, showLoading = false, onError, onSuccess } = {}) {
  const { showLoadingUI } = useAppUI();
  const client = useClient();
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState9(false);
  const isLoadingRef = useRefValue(isLoading);
  const mutate = useCallback8(
    (payload) => {
      if (isLoadingRef.current) {
        return Promise.reject({
          message: "Already loading"
        });
      }
      isLoadingRef.current = true;
      setIsLoading(true);
      if (showLoading) {
        showLoadingUI(true);
      }
      return client.mutate(action, payload).then(({ data }) => {
        if (data.notify) {
          notify(data.notify.type, data.notify.message, data.notify.params);
        }
        onSuccess?.(data);
        return data;
      }).catch((res) => {
        onError?.(res.data);
        const params = res.data.info ?? {};
        if (typeof ignoreNotify === "function" ? !ignoreNotify(res.data) : !ignoreNotify) {
          notify("error", res.data.message ?? "Unknown error", params);
        }
        throw res.data;
      }).finally(() => {
        isLoadingRef.current = false;
        setIsLoading(false);
        if (showLoading) {
          showLoadingUI(false);
        }
      });
    },
    [client.mutate, action, notify, showLoading]
  );
  return {
    mutate,
    isLoading
  };
}

// src/app/hooks/useQuery.ts
import { use as use7, useEffect as useEffect10, useCallback as useCallback9, useMemo as useMemo8, useRef as useRef6 } from "react";
function useQuery(path, options) {
  const { showLoadingUI } = useAppUI();
  const isUnMountedRef = useRef6(false);
  const notify = useNotify();
  const notifyRef = useRefValue(notify);
  const { query, loadingRef } = useClient();
  const { clear } = use7(AppStateContext);
  const route = useRoute();
  const currentRouteRef = useRef6(route.name);
  const key = useMemo8(() => getQueryKey(path, options?.params ?? {}), [path, JSON.stringify(options?.params ?? {})]);
  const currentKeyRef = useRef6(key);
  const params = options?.params ?? {};
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const isLoading = useAppStateStore((store) => store.loading).includes(key);
  const data = useAppStateStore((store) => store.state[key]);
  const refetch = useCallback9(() => {
    if (!enabled) {
      return;
    }
    if (loadingRef.current.includes(key)) {
      return;
    }
    if (options?.showLoading) {
      showLoadingUI(true);
    }
    query(path, params).then(({ key: key2, data: data2 }) => {
      if (data2.notify) {
        notifyRef.current(data2.notify.type, data2.notify.message, data2.notify.params);
      }
      if (options?.autoClearCache && key2 !== currentKeyRef.current) {
        clear(key2);
      }
      if (options?.showLoading) {
        showLoadingUI(false);
      }
    });
  }, [key, enabled, route.name]);
  useEffect10(() => {
    currentKeyRef.current = key;
    return () => {
      if (options?.autoClearCache) {
        clear(key);
      }
    };
  }, [key]);
  useEffect10(() => {
    return () => {
      isUnMountedRef.current = true;
    };
  }, []);
  useEffect10(() => {
    if (isUnMountedRef.current) {
      return;
    }
    if (!enabled) {
      clear(key);
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
    if (options?.showLoading) {
      showLoadingUI(true);
    }
    query(path, params).then(({ key: key2, data: data2 }) => {
      if (data2.notify) {
        notifyRef.current(data2.notify.type, data2.notify.message, data2.notify.params);
      }
      if (options?.autoClearCache && key2 !== currentKeyRef.current) {
        clear(key2);
      }
    }).finally(() => {
      if (options?.showLoading) {
        showLoadingUI(false);
      }
    });
  }, [key, enabled, route.name]);
  return {
    refetch,
    isLoading,
    data
  };
}

// src/app/hooks/useInfiniteQuery.ts
import { use as use8, useMemo as useMemo9, useState as useState10, useCallback as useCallback10, useEffect as useEffect11 } from "react";
var getNextPageParam = (lastPage) => {
  return Array.isArray(lastPage) ? lastPage?.[lastPage.length - 1]?.created_at ?? null : null;
};
function useInfiniteQuery(path, options) {
  const { showLoadingUI } = useAppUI();
  const route = useRoute();
  const refetchOnMount = options?.refetchOnMount ?? false;
  const enabled = options?.enabled ?? true;
  const state = useAppStateStore((store) => store.state);
  const [pageKeys, setPageKeys] = useState10([]);
  const data = useMemo9(() => {
    return pageKeys.map((key) => state[key]).filter(Boolean);
  }, [pageKeys, state]);
  const { update } = use8(AppStateContext);
  const { query, loadingRef } = useClient();
  const hasNextPage = useMemo9(() => {
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
  const fetchNextPage = useCallback10(() => {
    if (!hasNextPage) {
      return;
    }
    const params = options?.params ?? {};
    if (!enabled) {
      return;
    }
    if (options?.type === "offset") {
      params.offset = pageKeys.length * options.params.limit;
    } else {
      if (options?.type === "cursor") {
        const cursor = getNextPageParam(
          data ? data[data.length - 1] : void 0
        );
        if (cursor) {
          params.cursor = cursor;
        }
      }
    }
    const queryKey = getQueryKey(path, params);
    if (loadingRef.current.some((key) => [...pageKeys, queryKey].includes(key))) {
      return;
    }
    setPageKeys([...pageKeys, queryKey]);
    query(path, params);
  }, [path, JSON.stringify(options), hasNextPage, enabled, data, pageKeys]);
  const isLoading = useMemo9(() => {
    if (!enabled) {
      return false;
    }
    return pageKeys.length > 0 ? state[pageKeys[pageKeys.length - 1]] === void 0 : false;
  }, [pageKeys, state, enabled]);
  useEffect11(() => {
    if (!enabled) {
      return;
    }
    const params = options?.params ?? {};
    if (options?.type === "offset") {
      params.offset = 0;
    }
    const queryKey = getQueryKey(path, params);
    if (loadingRef.current.includes(queryKey)) {
      return;
    }
    if (state[queryKey] !== void 0 && refetchOnMount === false) {
      return;
    }
    if (options?.showLoading) {
      showLoadingUI(true);
    }
    setPageKeys((pageKeys2) => [...pageKeys2, queryKey]);
    query(path, params).finally(() => {
      if (options?.showLoading) {
        showLoadingUI(false);
      }
    });
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

// src/utils.tsx
import { AppError as AppError2, ErrorCodes } from "@ywwwtseng/ywjs";
import BigNumber from "bignumber.js";
import { jsxs as jsxs13 } from "react/jsx-runtime";
function formatTinyAmount(value, significantDigits = 2) {
  const str = typeof value === "number" ? new BigNumber(value).toFixed() : value;
  if (!str.startsWith("0.")) return str;
  const decimals = str.slice(2);
  const zeroMatch = decimals.match(/^0+/);
  if (!zeroMatch) return str;
  const zeroCount = zeroMatch[0].length;
  const rest = decimals.slice(zeroCount);
  if (!rest) return str;
  let significant = rest.slice(0, significantDigits);
  significant = significant.replace(/0+$/, "");
  return {
    zeroCount,
    significant
  };
}
function displayAmount(v, { showTinyAmount = true } = { showTinyAmount: true }) {
  if (v === void 0 || v === null) {
    return void 0;
  }
  if (v === "0" || v === 0) {
    return "0";
  }
  let digits = 0;
  const number = new BigNumber(v);
  if (number.gt(1e4)) {
    digits = 1;
  } else if (number.gt(1e3)) {
    digits = 2;
  } else if (number.gt(100)) {
    digits = 2;
  } else if (number.gt(10)) {
    digits = 2;
  } else if (number.eq(1)) {
    digits = 2;
  } else if (number.gt(1)) {
    digits = 3;
  } else if (number.eq(0)) {
    digits = 2;
  } else if (number.gt(0.1)) {
    digits = 3;
  } else if (number.gt(0.01)) {
    digits = 4;
  } else {
    digits = 8;
  }
  if (showTinyAmount && number.lt(1e-5)) {
    const result = formatTinyAmount(v);
    if (typeof result === "object") {
      const { zeroCount, significant } = result;
      return /* @__PURE__ */ jsxs13("span", { children: [
        "0.0",
        /* @__PURE__ */ jsxs13("sub", { children: [
          zeroCount,
          " "
        ] }),
        significant
      ] });
    }
  }
  return number.toFixed(digits).replace(/\.?0+$/, "");
}
function parseTokenId(token_id) {
  const [symbol, decimals, network, address] = token_id.split(":");
  if (!symbol || !decimals) {
    throw new AppError2(ErrorCodes.INVALID_PARAMS, "Invalid token id", {
      token_id
    });
  }
  return { symbol, decimals: Number(decimals), network, address };
}
function formatTokenId({ symbol, decimals, network, address }) {
  return address ? `${symbol}:${decimals}:${network}:${address}` : `${symbol}:${decimals}:${network}`;
}
export {
  AmountInput,
  AppProvider,
  AppStateContext,
  AppStateProvider,
  AppUIContext,
  AppUIProvider,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Button,
  Canvas,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClientContext,
  ClientProvider,
  Confirm,
  Input,
  Layout,
  List,
  Loading,
  Modal,
  ScreenType,
  Search,
  Spinner,
  StackNavigatorContext,
  StackNavigatorProvider,
  StackView,
  TabBar,
  Textarea,
  Typography,
  WalletConnect,
  displayAmount,
  formatAmount,
  formatTinyAmount,
  formatTokenId,
  getQueryKey,
  inputVariants,
  parseTokenId,
  textareaVariants,
  default2 as toast,
  useAppStateStore,
  useAppUI,
  useClient,
  useClientOnce,
  useDebounce,
  useDisclosure,
  useI18n,
  useInfiniteQuery,
  useInterval,
  useIsMounted,
  useMutation,
  useNavigate,
  usePersistedCooldown,
  useQuery,
  useQueryState,
  useRefValue,
  useRoute
};
