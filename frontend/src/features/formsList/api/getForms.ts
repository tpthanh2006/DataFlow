import { api } from "@/lib/apiClient";
import type { QueryConfig } from "@/lib/reactQuery";
import type { Form } from "@shared/types/formTypes";
import { queryOptions, useQuery } from "@tanstack/react-query";

interface GetFormsData {
  data: Form[];
  count: number;
}

export const getForms = async (): Promise<Form[]> => {
  const response = await api.get<GetFormsData>("forms/");
  const data = await response.json();
  console.log(data);
  return data.data;
};

export const getFormsQueryOptions = () => {
  return queryOptions({
    queryKey: ["forms"],
    queryFn: () => getForms(),
  });
};

type UseFormsOptions = {
  queryConfig?: QueryConfig<typeof getFormsQueryOptions>;
};

export const useForms = ({ queryConfig }: UseFormsOptions = {}) => {
  return useQuery({
    ...getFormsQueryOptions(),
    ...queryConfig,
  });
};
