import { api } from "@/lib/apiClient";
import type { QueryConfig } from "@/lib/reactQuery";
import type { AirtableRecord } from "@shared/types/airtableRecordTypes";
import { queryOptions, useQuery } from "@tanstack/react-query";

// Relevant documentation:
// https://airtable.com/developers/web/api/list-records

interface GetAirtableRecordsData {
  data: AirtableRecord[];
  count: number;
  offset?: string;
}

// TODO: In the future, this needs to support filterByFormula
// TODO: In the future, this needs to support pagination
export const getAirtableRecords = async (baseId: string, tableId: string) => {
  const response = await api.get<GetAirtableRecordsData>(
    `airtable/${baseId}/${tableId}`,
  );
  const data = await response.json();

  // For now returning just data alone should be fine?
  // Information like offset is useful for pagination components
  return data;
};

export const getAirtableRecordsQueryOptions = (
  baseId: string,
  tableId: string,
) => {
  return queryOptions({
    queryKey: ["airtableRecords", baseId, tableId],
    queryFn: () => getAirtableRecords(baseId, tableId),
  });
};

type UseAirtableRecordsOptions = {
  baseId: string;
  tableId: string;
  queryConfig?: QueryConfig<typeof getAirtableRecordsQueryOptions>;
};

export const useAirtableRecords = ({
  baseId,
  tableId,
  queryConfig,
}: UseAirtableRecordsOptions) => {
  return useQuery({
    ...getAirtableRecordsQueryOptions(baseId, tableId),
    ...queryConfig,
  });
};
