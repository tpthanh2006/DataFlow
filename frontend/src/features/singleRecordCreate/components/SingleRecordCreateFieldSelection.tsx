import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";
import { FieldSelection } from "@/components/formCreation/FieldSelection";

export const SingleRecordCreateFieldSelection = () => {
  return (
    <FieldSelection
      //firstStepRoute="/create-form/create-single-record/form-info"
      previousRoute="/create-form/create-single-record/data-source"
      nextRoute="/create-form/create-single-record/field-configuration"
      useFormCreationStore={useSingleRecordCreateStore}
    />
  );
};
