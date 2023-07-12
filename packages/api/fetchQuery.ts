import {fetchJSON} from './base';

export const fetchQuery = async <T>(
  url: string,
  params: {[k: string]: any},
  method: 'GET' | 'DELETE' | 'POST' | 'PUT' = 'POST',
) => {
  const resp = await fetchJSON(url, params, method);
  if (resp.status === 'success') {
    return resp.data as T;
  } else {
    throw resp.error;
  }
};
