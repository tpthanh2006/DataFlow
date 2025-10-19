import { FieldSelection } from "@/components/formCreation/FieldSelection";
import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";

export const SingleRecordEditFieldSelection = () => {
  return (
    <FieldSelection
      previousRoute="/create-form/edit-single-record/data-source"
      nextRoute="/create-form/edit-single-record/field-configuration"
      useFormCreationStore={useSingleRecordEditStore}
    />
  );
};
