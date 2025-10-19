import { Preview } from "@/components/formCreation/Preview";
import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";

export const SingleRecordCreatePreview = () => {
  return (
    <Preview
      previousRoute="/create-form/create-single-record/field-configuration"
      nextRoute="/create-form/create-single-record/publish"
      useFormCreationStore={useSingleRecordCreateStore}
    >
      <p>
        TODO: Preview page for forms. This will probably be blocked until we are
        able to use Uyen's form components code
      </p>
    </Preview>
  );
};
