import { AppError, ErrorCodes } from '@ywwwtseng/ywjs';
import BigNumber from 'bignumber.js';

export function formatTinyAmount(
  value: string | number,
  significantDigits = 2
) {
  const str = typeof value === 'number'
    ? new BigNumber(value).toFixed()
    : value

  if (!str.startsWith('0.')) return str

  const decimals = str.slice(2)

  // 計算連續 0
  const zeroMatch = decimals.match(/^0+/)
  if (!zeroMatch) return str

  const zeroCount = zeroMatch[0].length
  const rest = decimals.slice(zeroCount)

  if (!rest) return str

  // 获取有效数字，并去掉末尾的 0
  let significant = rest.slice(0, significantDigits)
  // 去掉末尾的 0
  significant = significant.replace(/0+$/, '')

  return {
    zeroCount,
    significant,
  }
}

export function displayAmount(
  v: string | number,
  options: { showTinyAmount: false }
): string;
export function displayAmount(
  v: string | number,
  options?: { showTinyAmount?: true }
): string | React.ReactElement;
export function displayAmount(
  v: string | number | undefined | null,
  options?: { showTinyAmount?: boolean }
): string | React.ReactElement | undefined;
export function displayAmount(
  v: string | number | undefined | null,
  { showTinyAmount = true }: { showTinyAmount?: boolean } = { showTinyAmount: true }
): string | React.ReactElement | undefined {
  if (v === undefined || v === null) {
    return undefined;
  }

  if (v === '0' || v === 0) {
    return '0';
  }

  let digits = 0;
  const number = new BigNumber(v);

  if (number.gt(10000)) {
    digits = 1;
  } else if (number.gt(1000)) {
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

    if (typeof result === 'object') {
      const { zeroCount, significant } = result;

      return (
        <span>
          0.0
          <sub>{zeroCount} </sub>
          {significant}
        </span>
      )

    }
  }

  // 無條件捨去（向下取整）
  // const multiplier = Math.pow(10, digits);
  // const floored = number.multipliedBy(multiplier).integerValue(BigNumber.ROUND_DOWN).dividedBy(multiplier);

  return number.toFixed(digits).replace(/\.?0+$/, '');
}

export function parseTokenId(token_id: string): {
  symbol: string;
  decimals: number;
  network: string;
  address: string | undefined;
} {
  const [symbol, decimals, network, address] = token_id.split(':');

  if (!symbol || !decimals) {
    throw new AppError(ErrorCodes.INVALID_PARAMS, 'Invalid token id', {
      token_id,
    });
  }

  return { symbol, decimals: Number(decimals), network, address };
}

export function formatTokenId({ symbol, decimals, network, address }: { symbol: string; decimals: number; network: string; address: string | undefined }): string {
  return address ? `${symbol}:${decimals}:${network}:${address}` : `${symbol}:${decimals}:${network}`;
}