import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";
import { Publish } from "@/components/formCreation/Publish";

export const SingleRecordEditPublish = () => {
  return (
    <Publish
      previousRoute="/create-form/edit-single-record/preview"
      useFormCreationStore={useSingleRecordEditStore}
    ></Publish>
  );
};
