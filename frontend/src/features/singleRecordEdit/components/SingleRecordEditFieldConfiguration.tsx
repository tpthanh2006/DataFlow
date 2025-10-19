import { FieldConfiguration } from "@/components/formCreation/FieldConfiguration";
import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";

export const SingleRecordEditFieldConfiguration = () => {
  return (
    <FieldConfiguration
      previousRoute="/create-form/edit-single-record/field-selection"
      nextRoute="/create-form/edit-single-record/form-filters"
      useFormCreationStore={useSingleRecordEditStore}
    />
  );
};
