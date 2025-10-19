import { DataSource } from "@/components/formCreation/DataSource";
import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";

export const SingleRecordEditDataSource = () => {
  return (
    <DataSource
      previousRoute="/create-form/edit-single-record/form-info"
      nextRoute="/create-form/edit-single-record/field-selection"
      useFormCreationStore={useSingleRecordEditStore}
    />
  );
};
