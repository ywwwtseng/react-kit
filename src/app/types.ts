export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface Command {
  type: 'update' | 'merge' | 'replace' | 'unshift' | 'push' | 'delete';
  target?: string;
  payload: unknown;
}

export interface Notify {
  type?: 'success'| 'error' | 'default';
  message: string;
}

export interface ResponseData {
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