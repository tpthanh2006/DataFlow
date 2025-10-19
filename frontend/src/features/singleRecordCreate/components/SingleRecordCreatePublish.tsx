import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";
import { Publish } from "@/components/formCreation/Publish";

export const SingleRecordCreatePublish = () => {
  return (
    <Publish
      previousRoute="/create-form/create-single-record/preview"
      useFormCreationStore={useSingleRecordCreateStore}
    ></Publish>
  );
};
