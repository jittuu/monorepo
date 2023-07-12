import {useCallback, useState} from 'react';
import {
  QueryObserverBaseResult,
  RefetchOptions,
  RefetchQueryFilters,
} from 'react-query';

export const useRefreshByUser = <T extends QueryObserverBaseResult>({
  refetch,
  ...rest
}: T) => {
  const [isRefreshingByUser, setIsRefreshingByUser] = useState(false);

  const refresh = useCallback(
    async (
      options?: (RefetchOptions & RefetchQueryFilters<unknown>) | undefined,
    ) => {
      try {
        setIsRefreshingByUser(true);
        const result = await refetch(options);
        return result;
      } finally {
        setIsRefreshingByUser(false);
      }
    },
    [refetch],
  );

  return {...rest, refetch, refresh, isRefreshingByUser};
};
