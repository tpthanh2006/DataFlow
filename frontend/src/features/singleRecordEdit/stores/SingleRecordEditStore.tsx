import type { SingleRecordEditForm } from "@shared/schema/schema";
import { createFormCreationStoreContext } from "@/lib/FormCreationStore";

// Typically, the type we export is directly inferred from the Zod schema but this should be
// fine for now
export type SingleRecordEditFormState = Partial<SingleRecordEditForm> & {
  setData: (data: Partial<SingleRecordEditForm>) => void;
};

const {
  FormCreationStoreProvider: SingleRecordEditStoreProvider,
  useFormCreationStore: useSingleRecordEditStore,
  useFormCreationStoreApi: useSingleRecordEditStoreApi,
} = createFormCreationStoreContext<SingleRecordEditFormState>((set) => ({
  type: "singleRecordEdit",
  setData: (data) => set(data),
}));

export {
  SingleRecordEditStoreProvider,
  useSingleRecordEditStore,
  useSingleRecordEditStoreApi,
};
