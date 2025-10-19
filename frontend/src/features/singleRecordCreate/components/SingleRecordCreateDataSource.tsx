import { DataSource } from "@/components/formCreation/DataSource";
import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";

export const SingleRecordCreateDataSource = () => {
  return (
    <DataSource
      firstStepRoute="/create-form/create-single-record/form-info"
      previousRoute="/create-form/create-single-record/form-info"
      nextRoute="/create-form/create-single-record/field-selection"
      useFormCreationStore={useSingleRecordCreateStore}
    />
  );
};
