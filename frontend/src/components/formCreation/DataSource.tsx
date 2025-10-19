import { Field, FormLayout } from "@/components/form/Form";
import { useAppForm } from "@/hooks/formHook";
import { useEffect } from "react";
import {
  FormCreationBackButton,
  FormCreationButtons,
  FormCreationContent,
  FormCreationHeading,
  FormCreationSubmitButton,
} from "@/components/formCreation/FormCreation";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/form/Select";
import { useNavigate } from "react-router-dom";
import type {
  FormCreationState,
  UseFormCreationStore,
} from "@/lib/FormCreationStore";
import {
  type DataSource as DataSourceType,
  dataSourceSchema,
} from "@shared/schema/formCreationSchemas";
import { useBases } from "@/hooks/formCreation/getBases";
import { useTables } from "@/hooks/formCreation/getTables";
import { useStore } from "@tanstack/react-form";

type DataSourceProps<TState extends FormCreationState> = {
  previousRoute: string;
  nextRoute: string;
  useFormCreationStore: UseFormCreationStore<TState>;
};

export const DataSource = ({
  previousRoute,
  nextRoute,
  useFormCreationStore,
}: DataSourceProps<FormCreationState>) => {
  const name = useFormCreationStore((state) => state.name);
  const base = useFormCreationStore((state) => state.base);
  const targetTable = useFormCreationStore((state) => state.targetTable);
  const setData = useFormCreationStore((state) => state.setData);
  const navigate = useNavigate();

  // Minor issue:
  // With Zod schemas and Tanstack Form, any object schemas (z.object(...)) like base/targetTable
  // have their errors mapped to an attribute (ex. base.id instead of base). As a result, this
  // makes displaying error messages difficult.
  // I've made these default to being undefined to start so that we get a "required" error
  // if users try to submit without filling these
  // An issue with this however, is that it makes Select go from uncontrolled to controlled, so
  // using refines might be better :/
  const defaultValues: Partial<DataSourceType> = {
    base: base || undefined,
    targetTable: targetTable || undefined,
  };

  const form = useAppForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      console.log(value);
      setData(value);
      navigate(nextRoute);
    },
    onSubmitInvalid: ({ value }) => {
      console.log("---invalid---");
      console.log(value);
      console.log(form.state.errors);
    },
    validators: {
      onSubmit: dataSourceSchema,
    },
  });

  // Subscribe to form state
  const selectedBase = useStore(form.store, (state) => state.values.base);

  // TODO: Might need to make more complex considerations for loading/error states
  const bases = useBases();
  const tables = useTables({
    baseId: selectedBase?.id || "",
    // Only make the query if a base has been selected
    queryConfig: { enabled: selectedBase !== undefined },
  });

  // Update the base's tables when the tables query is done loading
  // This may be helpful for validation or getting other tables (like the reference table)
  // in certain form creation workflow
  useEffect(() => {
    if (tables.data && selectedBase) {
      form.setFieldValue("base.tables", tables.data);
    }
  }, [form, tables.data, selectedBase]);

  return (
    <FormCreationContent>
      <FormCreationHeading>
        {/* Heading and Save Status Indicator */}
        {/* Display form name or default */}
        <FormCreationHeading.FormName name={name} />
        {/* TODO: Status */}
        {/* {getStatusIndicator()} */}
        <FormCreationHeading.StepName name="Data Source" />
      </FormCreationHeading>
      {/* Data Source Section */}
      <FormLayout
        onSubmit={() => {
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="base"
          children={(field) => (
            <Field label="Airtable base">
              <field.Select
                aria-describedby={`${field.name}-errors`}
                aria-required
                value={field.state.value?.id}
                onValueChange={(value) => {
                  const selectedBase = bases.data?.find(
                    (base) => base.id === value,
                  );
                  // The above statement should never be undefined but Typescript still yells at us
                  if (selectedBase) {
                    field.handleChange(selectedBase);
                  }
                }}
              >
                <field.SelectTrigger
                  aria-invalid={!field.state.meta.isValid}
                  // Disable
                  disabled={bases.isLoading}
                >
                  <SelectValue placeholder="Select an Airtable base" />
                </field.SelectTrigger>
                <SelectContent>
                  {bases.data?.length === 0 && (
                    <p className="text-sm p-2 text-muted-foreground">
                      No bases found.
                    </p>
                  )}
                  {bases.data?.map((base) => (
                    <SelectItem value={base.id} key={base.id}>
                      {base.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.Select>
            </Field>
          )}
        />
        <form.AppField
          name="targetTable"
          children={(field) => (
            <Field label="Target table">
              <field.Select
                aria-describedby={`${field.name}-errors`}
                aria-required
                value={field.state.value?.id}
                onValueChange={(value) => {
                  const selectedTable = tables.data?.find(
                    (table) => table.id === value,
                  );
                  // The above statement should never be undefined but Typescript still yells at us
                  if (selectedTable) {
                    field.handleChange(selectedTable);
                  }
                }}
              >
                {/* Subscribe to form state to disable this select until Base gets filled out */}
                <form.Subscribe
                  selector={(state) => state.values.base}
                  children={(base) => (
                    <field.SelectTrigger disabled={!base || tables.isLoading}>
                      <SelectValue placeholder="Select your target table from the base" />
                    </field.SelectTrigger>
                  )}
                />
                <SelectContent>
                  {tables.data?.length === 0 && (
                    <p className="text-sm p-2 text-muted-foreground">
                      No tables found.
                    </p>
                  )}
                  {tables.data?.map((table) => (
                    <SelectItem value={table.id} key={table.id}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </field.Select>
            </Field>
          )}
        />
        <FormCreationButtons>
          <FormCreationBackButton to={previousRoute} />
          <FormCreationSubmitButton />
        </FormCreationButtons>
      </FormLayout>
    </FormCreationContent>
  );
};
