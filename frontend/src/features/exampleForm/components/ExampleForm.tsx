import { FieldLayout, FormLayout } from "@/components/form/Form";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/formHook";
import { Field } from "@/components/form/Form";
import z from "zod";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/form/Select";

// Step 1: Create/use a schema
// You can create an entire new schema
const BaseFormSchema = z.object({
  id: z.string().trim().min(1, "Form ID is required"),
  name: z.string().trim().min(1, "Form name is required"),
  description: z.string().trim().optional(),
  base: z.string().trim().min(1, "Base is required"),
  // dataSource: DataSourceSchema,
  // selectedFields: z
  //   .array(FieldSchema)
  //   .min(1, "At least 1 field must be selected"),
});

// Or just pick out the parts you need
const formSchema = BaseFormSchema.pick({
  name: true,
  description: true,
  base: true,
});

// Step 2a: Configure the form
const defaultValues: z.infer<typeof formSchema> = {
  name: "",
  description: "",
  base: "",
};

export const ExampleForm = () => {
  // Step 2b: Configure the form's hooks
  const form = useAppForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      console.log(value);
    },
    // We can use our schema from step 1 to validate our form :)
    validators: {
      onSubmit: formSchema,
    },
  });

  // Step 3: Create the form
  return (
    <FormLayout
      onSubmit={() => {
        form.handleSubmit();
      }}
      className="m-8"
    >
      <form.AppField
        name="name"
        children={(field) => (
          <FieldLayout>
            <field.FieldLabel>Form name*</field.FieldLabel>
            <field.FieldDescription>
              The name of the form
            </field.FieldDescription>
            {/* To use pre-made components like Input, you need to bind them (ex. src/components/form/Input)
                and then register it in the form hook (src/lib/form/formContext.ts)
             */}
            <field.Input
              // aria-describedby should be used when there's a description present (default id is fieldName-description)
              // and is ALWAYS used when there's an Errors component present (default id is fieldName-errors)
              aria-describedby={`${field.name}-description ${field.name}-errors`}
              aria-required
            />
            <field.FieldErrors />
          </FieldLayout>
        )}
      />

      <form.AppField
        name="description"
        children={(field) => (
          // I've created this wrapper component which should cover most of our needs
          // but you can still use components individually like in the above field
          <Field label="Form description">
            <field.Textarea aria-describedby={`${field.name}-errors`} />
          </Field>
        )}
      />

      <form.AppField
        name="base"
        children={(field) => (
          // Select and SelectTrigger use Tanstack's field context, so we need to use field.Select and field.SelectTrigger
          // The other Select components don't use the context so there's no need to do the same
          <Field label="Airtable base">
            <field.Select>
              <field.SelectTrigger>
                <SelectValue />
              </field.SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </field.Select>
          </Field>
        )}
      />

      <Button>Submit</Button>
    </FormLayout>
  );
};
