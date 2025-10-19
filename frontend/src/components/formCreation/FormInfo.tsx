import {
  formInfoSchema,
  type FormInfo as FormInfoType,
} from "@shared/schema/formCreationSchemas";
import { Field, FormLayout } from "@/components/form/Form";
import { useAppForm } from "@/hooks/formHook";
import {
  FormCreationButtons,
  FormCreationContent,
  FormCreationHeading,
  FormCreationInfo,
  FormCreationSubmitButton,
} from "@/components/formCreation/FormCreation";
import { useNavigate } from "react-router-dom";
import type {
  FormCreationState,
  UseFormCreationStore,
} from "@/lib/FormCreationStore";

type FormInfoProps<TState extends FormCreationState> = {
  nextRoute: string;
  useFormCreationStore: UseFormCreationStore<TState>;
};

export const FormInfo = ({
  nextRoute,
  useFormCreationStore,
}: FormInfoProps<FormCreationState>) => {
  const navigate = useNavigate();
  const setData = useFormCreationStore((state) => state.setData);
  const name = useFormCreationStore((state) => state.name);
  const description = useFormCreationStore((state) => state.description);

  const defaultValues: FormInfoType = {
    name: name || "",
    description: description || "",
  };

  const form = useAppForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      console.log(value);
      setData(value);
      navigate(nextRoute);
    },
    validators: {
      onSubmit: formInfoSchema,
    },
  });

  return (
    <FormCreationContent>
      {/* Default Heading and Save Status Indicator */}
      <FormCreationHeading>
        {/* Display form name or default */}
        {/* Since form name is based off of Form Info, this is subscribed to form state. This is
              not the case for future form creation steps */}
        <form.Subscribe
          selector={(state) => state.values.name}
          children={(name) => <FormCreationHeading.FormName name={name} />}
        />
        {/* TODO: Status */}
        {/* {getStatusIndicator()} */}
        <FormCreationHeading.StepName name="Form Information" />
      </FormCreationHeading>
      {/* Form Information Section */}
      <FormLayout
        onSubmit={() => {
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => (
            <Field label="Form name">
              <field.Input
                aria-describedby={`${field.name}-errors`}
                aria-required
                placeholder="Enter your form's name"
              />
            </Field>
          )}
        />
        <form.AppField
          name="description"
          children={(field) => (
            <Field label="Form description">
              <field.Textarea
                aria-describedby={`${field.name}-errors`}
                rows={4} // Makes the textarea long
                placeholder="Provide a detailed description of your form..."
              />
            </Field>
          )}
        />
        <FormCreationButtons>
          <FormCreationSubmitButton />
        </FormCreationButtons>
      </FormLayout>
      {/* Record Editing Form Information */}
      <FormCreationInfo>
        <FormCreationInfo.Heading>
          Single Record Creation Form
        </FormCreationInfo.Heading>
        <FormCreationInfo.Text>
          This form is configured for creating a single new record in Airtable.
        </FormCreationInfo.Text>
      </FormCreationInfo>
    </FormCreationContent>
  );
};
