import {useQuery} from "react-query";
import {useRefreshByUser} from "./useRefreshing";
import {fetchQuery} from "./fetchQuery";
import {categoryKeys} from "./CategoryKeys";
import {CategoryWithFeaturePhoto} from "./types";

export const useCategories = () => {
  return useRefreshByUser(
    useQuery(categoryKeys.lists(), async () => {
      const data = await fetchQuery<CategoryWithFeaturePhoto[]>(
        '/categories/',
        {},
        'GET',
      );
      return data;
    }),
  );
};