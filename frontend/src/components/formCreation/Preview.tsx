import {
  FormCreationBackButton,
  FormCreationButtons,
  FormCreationContent,
  FormCreationHeading,
  FormCreationSubmitButton,
} from "@/components/formCreation/FormCreation";
import type {
  FormCreationState,
  UseFormCreationStore,
} from "@/lib/FormCreationStore";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Still need the hooks for things like displaying for name and all
// Still need a way to check redirect condition ()
type PreviewProps<TState extends FormCreationState> = {
  previousRoute: string;
  nextRoute: string;
  useFormCreationStore: UseFormCreationStore<TState>;
  children: ReactNode;
};

export const Preview = ({
  previousRoute,
  nextRoute,
  useFormCreationStore,
  children,
}: PreviewProps<FormCreationState>) => {
  const name = useFormCreationStore((state) => state.name);
  const navigate = useNavigate();

  return (
    <FormCreationContent>
      <FormCreationHeading>
        {/* Heading and Save Status Indicator */}
        {/* Display form name or default */}
        <FormCreationHeading.FormName name={name} />

        {/* TODO: Status */}
        {/* {getStatusIndicator()} */}
        <FormCreationHeading.StepName name="Preview" />
        <FormCreationHeading.Description>
          See how your form will look and test its functionality.
        </FormCreationHeading.Description>
      </FormCreationHeading>

      {/* Preview form should go here */}
      {children}

      <FormCreationButtons>
        <FormCreationBackButton to={previousRoute} />
        {/* TODO: If this ends up becoming a form, remove the navigate from this and put it
          in form submission logic
        */}
        <FormCreationSubmitButton onClick={() => navigate(nextRoute)} />
      </FormCreationButtons>
    </FormCreationContent>
  );
};
