import { useState, useEffect } from 'react';
import { Input } from './Input';

export interface AmountInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  value: string;
  onChange: (value: string) => void;
  decimal?: number;
  maxDigits?: number;
}

export function formatAmount(input: string) {
  if (!input) return '';

  const parts = input.split('.');
  const integerPart = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 如果原本有 "."（即使沒有小數），就保留
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
  maxDigits,
  ...props
}: AmountInputProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (value === '') {
      setInputValue('');
    }
  }, [value]);

  return (
    <Input
      {...props}
      className={props.className ? `input ${props.className}` : 'input'}
      type="text"
      value={formatAmount(inputValue)}
      onChange={(e) => {
        const value = e.target.value.replace(/,/g, '');
        if (value === '') {
          setInputValue('');
          onChange('');
          return;
        }

        // 禁止開頭是小數點
        if (value.startsWith('.')) return;
        // 禁止多個小數點
        if ((value.match(/\./g) || []).length > 1) return;
        // 禁止輸入非數字和小數點
        if (!/^\d*\.?\d*$/.test(value)) return;
        // 禁止開頭是 00 或更多（允許 0, 0.5）
        if (/^0\d+/.test(value) && !/^0\.\d*$/.test(value)) return;
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

          if (/^(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
            if (Number(value) === 0) {
              onChange('');
            } else {
              onChange(value);
            }
          }
        }
      }}
    />
  );
}
