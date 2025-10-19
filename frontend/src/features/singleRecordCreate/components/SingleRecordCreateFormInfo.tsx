import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";
import { FormInfo } from "@/components/formCreation/FormInfo";

export const SingleRecordCreateFormInfo = () => {
  return (
    <FormInfo
      nextRoute="/create-form/create-single-record/data-source"
      useFormCreationStore={useSingleRecordCreateStore}
    />
  );
};
