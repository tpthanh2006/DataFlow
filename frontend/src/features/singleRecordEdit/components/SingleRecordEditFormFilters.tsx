import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";
import { FormFilters } from "@/components/formCreation/FormFilters";

export const SingleRecordEditFormFilters = () => {
  // Target table should always be defined by the time we reach here (otherwise we wouldve redirected)
  const fields = useSingleRecordEditStore((state) => state.targetTable?.fields);

  return (
    <FormFilters
      previousRoute="/create-form/edit-single-record/field-configuration"
      nextRoute="/create-form/edit-single-record/preview"
      useFormCreationStore={useSingleRecordEditStore}
      fields={fields}
    />
  );
};
