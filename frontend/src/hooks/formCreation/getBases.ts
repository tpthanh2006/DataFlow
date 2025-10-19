import { api } from "@/lib/apiClient";
import { type QueryConfig } from "@/lib/reactQuery";
import type { Base } from "@shared/types/formTypes";
import { queryOptions, useQuery } from "@tanstack/react-query";

// This may be subject to change depending on how our server is developed
interface GetBasesData {
  data: Base[];
  count: number;
}

export const getBases = async (): Promise<Base[]> => {
  const response = await api.get<GetBasesData>("airtable/bases/");
  const data = await response.json();
  return data.data;
};

export const getBasesQueryOptions = () => {
  return queryOptions({
    queryKey: ["bases"],
    queryFn: () => getBases(),
  });
};

type UseBasesOptions = {
  queryConfig?: QueryConfig<typeof getBasesQueryOptions>;
};

export const useBases = ({ queryConfig }: UseBasesOptions = {}) => {
  return useQuery({
    ...getBasesQueryOptions(),
    ...queryConfig,
  });
};
