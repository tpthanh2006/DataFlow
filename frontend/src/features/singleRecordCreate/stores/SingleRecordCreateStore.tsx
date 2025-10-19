import type { SingleRecordCreateForm } from "@shared/schema/schema";
import { createFormCreationStoreContext } from "@/lib/FormCreationStore";

// Typically, the type we export is directly inferred from the Zod schema but this should be
// fine for now
export type SingleRecordCreateFormState = Partial<SingleRecordCreateForm> & {
  setData: (data: Partial<SingleRecordCreateForm>) => void;
};

const {
  FormCreationStoreProvider: SingleRecordCreateStoreProvider,
  useFormCreationStore: useSingleRecordCreateStore,
  useFormCreationStoreApi: useSingleRecordCreateStoreApi,
} = createFormCreationStoreContext<SingleRecordCreateFormState>((set) => ({
  type: "singleRecordCreate",
  setData: (data) => set(data),
}));

export {
  SingleRecordCreateStoreProvider,
  useSingleRecordCreateStore,
  useSingleRecordCreateStoreApi,
};
