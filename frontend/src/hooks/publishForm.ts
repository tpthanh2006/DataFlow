import { getFormsQueryOptions } from "@/features/formsList/api/getForms";
import { api } from "@/lib/apiClient";
import type { MutationConfig } from "@/lib/reactQuery";
import type { Form } from "@shared/schema/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const publishForm = async (form: Partial<Form>): Promise<Form> => {
  const response = await api.post<Form>("forms/", {
    body: JSON.stringify(form),
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  console.log(response);
  console.log(data);
  return data;
};

type UsePublishFormOptions = {
  mutationConfig?: MutationConfig<typeof publishForm>;
};

export const usePublishForm = ({
  mutationConfig = {},
}: UsePublishFormOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig;

  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getFormsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: publishForm,
  });
};
