const defaultErrorMessages: {[k: number]: string} = {
  [404]: 'Not Found',
  [401]: 'Unauthorized',
  [403]: 'Forbidden',
  [500]: 'Internal Server Error',
};

type ErrorCode =
  | 'facebook/window-policy'
  | 'generic'
  | 'user/already-exist'
  | 'facebook/soon-unblocking-target'
  | 'facebook/audiences_create'
  | 'facebook/audience_terms_not_accepted'
  | 'facebook/invalid-page-access-token'
  | 'facebook/page-already-connected'
  | 'facebook/cannot-access'
  | 'zoho/invoice-mark-as-sent'
  | 'app/unauthorized';

export class ApiError extends Error {
  code: ErrorCode;
  message: string;

  constructor({code, message}: {code: ErrorCode; message: string}) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const baseURL = 'https://api.staging.bigbee.tech/api/v1';

export function toQueryString(params: {[k: string]: any}) {
  return Object.keys(params)
    .filter(k => params[k])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export type ResponseT<T = any> =
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'error';
      error: ApiError;
    };

export const getHeaders = async (token: string) => {
  const headers: {[key: string]: string} = token
    ? {
        ...DEFAULT_HEADERS,
        Authorization: `BEARER ${token}`,
      }
    : DEFAULT_HEADERS;
  return headers;
};

const fetchJSON = async <T>(
  url: string,
  params: {[k: string]: any},
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' = 'POST',
) => {
  let rURL = API_BASE + url;
  if (method === 'GET' && params) {
    rURL += `?${toQueryString(params)}`;
  }

  console.log(`executing query: ${rURL}, method:${method}`);
  const headers = await getHeaders('');
  const body =
    method === 'POST' || method === 'PUT' ? JSON.stringify(params) : undefined;
  return await fetchWithTimeout<T>(rURL, {method, headers, body});
};

const fetchWithTimeout = async <T>(resource: any, options: any) => {
  // const {timeout = 10000} = options;

  // const controller = new AbortController();
  // const id = setTimeout(() => controller.abort(), timeout);
  try {
    const resp = await fetch(resource, {
      ...options,
      // signal: controller.signal,
    });
    // clearTimeout(id);
    if (resp.status >= 200 && resp.status < 300) {
      const text = await resp.text();
      const data = text ? parseJSONwithDate(text) : null;
      if (data) {
        return data as ResponseT<T>;
      }

      return {
        status: 'success',
        data: {},
      } as ResponseT<T>;
    } else if (resp.status === 404) {
      return {
        status: 'success',
        data: {},
      } as ResponseT<T>;
    } else {
      const text = await resp.text();
      const [apiError, ok] = tryParseJSON<ApiError>(text);
      return {
        status: 'error',
        error: ok
          ? apiError
          : new ApiError({
              code: 'generic',
              message: text || defaultErrorMessages[resp.status],
            }),
      } as ResponseT<T>;
    }
  } catch (err) {
    return {
      status: 'error',
      error: new ApiError({code: 'generic', message: 'Timeout'}),
    } as ResponseT<T>;
  }
};

export {fetchJSON};

const tryParseJSON = <T>(text: string): [T | null, boolean] => {
  try {
    return [parseJSONwithDate(text), true];
  } catch (e) {
    return [null, false];
  }
};

const iso8601Regex =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d[0-5]\d|Z)/;
const parseJSONwithDate = (text: string) => {
  return JSON.parse(text, (key, value) => {
    if (typeof value === 'string' && iso8601Regex.test(value)) {
      return new Date(value);
    }
    return value;
  });
};
