import { FormInfo } from "@/components/formCreation/FormInfo";
import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";

export const SingleRecordEditFormInfo = () => {
  return (
    <FormInfo
      nextRoute="/create-form/edit-single-record/data-source"
      useFormCreationStore={useSingleRecordEditStore}
    />
  );
};
