import { FieldConfiguration } from "@/components/formCreation/FieldConfiguration";
import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";

export const SingleRecordCreateFieldConfiguration = () => {
  return (
    <FieldConfiguration
      firstStepRoute="/create-form/create-single-record/form-info"
      previousRoute="/create-form/create-single-record/field-selection"
      nextRoute="/create-form/create-single-record/preview"
      useFormCreationStore={useSingleRecordCreateStore}
    />
  );
};
