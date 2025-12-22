import { useEffect, useState } from 'react';

function toPlainString(num: number) {
  return String(num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    (_, sign, int, frac, exp) => {
      exp = Number(exp);
      const digits = int + frac;

      if (exp < 0) {
        const pos = int.length + exp;
        return sign + '0.' + '0'.repeat(-pos) + digits;
      } else {
        return sign + digits + '0'.repeat(exp - frac.length);
      }
    },
  );
}

function isMobile() {
  const ua = navigator.userAgent;
  const isTouch = navigator.maxTouchPoints > 0;

  const isMobileUA = /Android|iPhone|iPad|iPod|Windows Phone/i.test(ua);

  return isMobileUA || isTouch;
}

export interface AmountInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  value: string;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  decimal?: number;
  maxDigits?: number;
}
export function formatAmount(input: string) {
  if (!input) return '';
  const parts = input.split('.');
  const rawIntegerPart = parts[0] || '';

  // 如果 integerPart 是空或全為 0（如 00000），不添加千位分隔符
  if (rawIntegerPart === '' || /^0+$/.test(rawIntegerPart)) {
    const integerPart = rawIntegerPart;
    if (parts.length > 1) {
      return `${integerPart}.${parts[1]}`;
    } else if (input.endsWith('.')) {
      return `${integerPart}.`;
    }
    return integerPart;
  }

  // 處理前導零的情況（如 000001000 → 000001,000）
  const leadingZerosMatch = rawIntegerPart.match(/^(0+)/);
  if (leadingZerosMatch) {
    const leadingZeros = leadingZerosMatch[1];
    const significantPart = rawIntegerPart.slice(leadingZeros.length);

    // 如果去除前導零後還有數字，則對有效數字部分添加千位分隔符
    if (significantPart) {
      const formattedSignificant = significantPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ',',
      );
      const integerPart = leadingZeros + formattedSignificant;

      if (parts.length > 1) {
        return `${integerPart}.${parts[1]}`;
      } else if (input.endsWith('.')) {
        return `${integerPart}.`;
      }
      return integerPart;
    }
  }

  // 沒有前導零的情況，正常添加千位分隔符
  const integerPart = rawIntegerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (parts.length > 1) {
    return `${integerPart}.${parts[1]}`;
  } else if (input.endsWith('.')) {
    return `${integerPart}.`;
  }
  return integerPart;
}

export function AmountInput({
  decimal = 0,
  value,
  onChange,
  onInputChange,
  maxDigits,
  ...props
}: AmountInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (inputValue === '.' && value === '') {
      return;
    }

    if (inputValue === '0' && value === '') {
      setInputValue('');
    }

    if (Number(inputValue) === Number(value)) return;

    if (inputValue !== '' && value === '') {
      setInputValue('');
    } else {
      setInputValue(value);
    }
  }, [value, inputValue]);

  useEffect(() => {
    onInputChange?.(inputValue);
  }, [inputValue, onInputChange]);

  return (
    <input
      {...props}
      className={props.className ? `input ${props.className}` : 'input'}
      type="text"
      value={isComposing ? inputValue : formatAmount(inputValue)}
      onChange={(e) => {
        if (isMobile()) {
          setIsComposing(true);
        }

        let value = e.target.value.replace(/,/g, '');
        if (value === '' || value === '.') {
          setInputValue(value);
          onChange('');
          return;
        }
        // 如果輸入以小數點開頭且後面有數字，檢查是否是刪除操作
        if (value.startsWith('.') && value.length > 1) {
          const previousValue = inputValue.replace(/,/g, '');
          // 如果之前的值是 0.xxx 格式，且刪除 0 後變成 .xxx，則允許（不自動補 0）
          // 例如：0.1 → .1（允許）
          if (
            previousValue.startsWith('0.') &&
            previousValue.slice(1) === value
          ) {
            // 允許刪除操作，不自動補 0
          } else {
            // 其他情況（如直接輸入 .1234），自動在前面添加 0
            value = '0' + value; // 從 .1234 變成 0.1234
          }
        }
        // 禁止多個小數點
        if ((value.match(/\./g) || []).length > 1) return;
        // 禁止輸入非數字和小數點（允許以小數點開頭）
        if (!/^\.?\d*\.?\d*$/.test(value)) return;
        // 允許所有有效的數字格式（0, 0.5, 0000.1, .1, 00000000, 000000001）
        // 移除對以多個零開頭整數的限制，允許 000000001 等格式
        // 檢查總長度（不含小數點） <= maxDigits
        if (typeof maxDigits === 'number') {
          const totalDigits = value.replace('.', '');
          if (totalDigits.length > maxDigits) return;
        }
        if (decimal === 0) {
          if (value === '0') {
            setInputValue('');
            onChange('');
          } else {
            setInputValue(value.replace('.', ''));
            onChange(value.replace('.', ''));
          }
          return;
        }
        // 檢查小數點後的位數 <= decimal
        const decimalPart = value.split('.')[1];
        if (decimalPart && decimalPart.length > decimal) return;

        if (Number(value) >= 0) {
          setInputValue(value);
          onChange(toPlainString(Number(value)));
        }
      }}
    />
  );
}
