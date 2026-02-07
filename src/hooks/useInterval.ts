import { useRef, useEffect } from 'react';
import { useRefValue } from './useRefValue';

interface UseIntervalOptions {
	delay: number;
	enabled?: boolean;
	timeout?: number;
	onTimeout?: () => void;
}

export function useInterval(callback: () => void, { delay, enabled = true, timeout = Infinity, onTimeout }: UseIntervalOptions) {
	const callbackRef = useRefValue<(() => void) | null>(callback);
	const timeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const pollStartedAt = useRef<number | null>(null);

	useEffect(() => {
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