import { api } from "@/lib/apiClient";
import { type QueryConfig } from "@/lib/reactQuery";
import type { Table } from "@shared/types/formTypes";
import { queryOptions, useQuery } from "@tanstack/react-query";

// This may be subject to change depending on how our server is developed
interface GetTablesData {
  data: Table[];
  count: number;
}

export const getTables = async (baseId: string): Promise<Table[]> => {
  const response = await api.get<GetTablesData>(
    `airtable/bases/${baseId}/tables/`,
  );
  const data = await response.json();
  return data.data;
};

export const getTablesQueryOptions = (baseId: string) => {
  return queryOptions({
    queryKey: ["tables", baseId],
    queryFn: () => getTables(baseId),
  });
};

type UseTablesOptions = {
  baseId: string;
  queryConfig?: QueryConfig<typeof getTablesQueryOptions>;
};

export const useTables = ({ baseId, queryConfig }: UseTablesOptions) => {
  return useQuery({
    ...getTablesQueryOptions(baseId),
    ...queryConfig,
  });
};
