import {
  FormCreationBackButton,
  FormCreationButtons,
  FormCreationContent,
  FormCreationHeading,
  FormCreationInfo,
} from "@/components/formCreation/FormCreation";
import type {
  FormCreationState,
  UseFormCreationStore,
} from "@/lib/FormCreationStore";
import { Button } from "../ui/button";
import { usePublishForm } from "@/hooks/publishForm";
import { Spinner } from "../ui/Spinner";
import { toast } from "react-toastify";

type PublishProps<TState extends FormCreationState> = {
  previousRoute: string;
  useFormCreationStore: UseFormCreationStore<TState>;
};

export const Publish = ({
  previousRoute,
  useFormCreationStore,
}: PublishProps<FormCreationState>) => {
  const name = useFormCreationStore((state) => state.name);
  const description = useFormCreationStore((state) => state.description);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { setData, ...formState } = useFormCreationStore((state) => state);

  console.log(formState);

  // TODO: Handle loading states, error states, etc.
  // Also need to decide what we do when we're successful
  const publishFormMutation = usePublishForm({
    mutationConfig: {
      onSuccess: () => {
        console.log("Successfully published form!");
        toast.success("Form published!");
      },
    },
  });

  return (
    <FormCreationContent>
      <FormCreationHeading>
        {/* Heading and Save Status Indicator */}
        {/* Display form name or default */}
        <FormCreationHeading.FormName name={name} />
        {/* TODO: Status */}
        {/* {getStatusIndicator()} */}
        <FormCreationHeading.StepName name="Publish" />
        <FormCreationHeading.Description>
          Review, publish, and share your form with others.
        </FormCreationHeading.Description>
      </FormCreationHeading>
      <FormCreationInfo>
        <FormCreationInfo.Heading className="text-lg">
          Form Summary
        </FormCreationInfo.Heading>
        <FormCreationInfo.Text className="pb-1 border-b">
          Review your form details before publishing.
        </FormCreationInfo.Text>
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <FormCreationInfo.Heading>Form name</FormCreationInfo.Heading>
            <FormCreationInfo.Text>
              {name || "Untitled form"}
            </FormCreationInfo.Text>
          </div>
          <div>
            <FormCreationInfo.Heading>Description</FormCreationInfo.Heading>
            <FormCreationInfo.Text>
              {description || "N/A"}
            </FormCreationInfo.Text>
          </div>
        </div>
      </FormCreationInfo>
      <FormCreationInfo>
        <FormCreationInfo.Heading>Publish form</FormCreationInfo.Heading>
        <FormCreationInfo.Text>
          This will make your form accessible from the dashboard and generate a
          shareable link.
        </FormCreationInfo.Text>
        <Button
          variant="secondary"
          // Disable while submitting-- disallow users from clicking multiple times
          disabled={publishFormMutation.isPending}
          onClick={() => publishFormMutation.mutate(formState)}
        >
          Publish
          {publishFormMutation.isPending && <Spinner size="x-small" />}
        </Button>
      </FormCreationInfo>
      <FormCreationButtons>
        <FormCreationBackButton to={previousRoute} />
      </FormCreationButtons>
    </FormCreationContent>
  );
};
