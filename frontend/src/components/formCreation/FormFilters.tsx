import { FormLayout } from "@/components/form/Form";
import {
  FormCreationBackButton,
  FormCreationButtons,
  FormCreationContent,
  FormCreationHeading,
  FormCreationInfo,
  FormCreationSubmitButton,
} from "@/components/formCreation/FormCreation";
import { useAppForm } from "@/hooks/formHook";
import { useNavigate } from "react-router-dom";
import {
  type FormFilters as FormFiltersType,
  type FormWithFormFilters,
} from "@shared/schema/formCreationSchemas";
import { useFilterableFields } from "@/hooks/formCreation/getFilterableFields";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/form/Select";
import {
  formatOperator,
  getValidOperations,
} from "@shared/lib/filterConditionUtils";
import type {
  FormCreationState,
  UseFormCreationStore,
} from "@/lib/FormCreationStore";
import type { AirtableField, Base } from "@shared/schema/schema";
import { formFiltersFormOpts } from "@/lib/formFiltersFormOpts";
import { FilterConditionValue } from "./FilterConditionValue";

type FormFiltersProps<TState extends FormCreationState<FormWithFormFilters>> = {
  previousRoute: string;
  nextRoute: string;
  useFormCreationStore: UseFormCreationStore<TState>;
  fields: AirtableField[] | undefined;
};

export const FormFilters = ({
  nextRoute,
  previousRoute,
  useFormCreationStore,
  fields,
}: FormFiltersProps<FormCreationState<FormWithFormFilters>>) => {
  const name = useFormCreationStore((state) => state.name);
  const base = useFormCreationStore((state) => state.base);
  const formFilters = useFormCreationStore((state) => state.formFilters);
  const setData = useFormCreationStore((state) => state.setData);
  const navigate = useNavigate();
  // TODO: Would it be good to show unfilterable fields as well?
  // Just to show users they cant and explain why not
  const { fieldOptions, unsupportedFields } = useFilterableFields(fields);

  const defaultValues: FormFiltersType = {
    formFilters: formFilters || [],
  };

  const form = useAppForm({
    ...formFiltersFormOpts,
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
  });

  return (
    <FormCreationContent>
      <FormCreationHeading>
        {/* Heading and Save Status Indicator */}
        {/* Display form name or default */}
        <FormCreationHeading.FormName name={name} />
        {/* TODO: Status */}
        {/* {getStatusIndicator()} */}
        <FormCreationHeading.StepName name="Form Filters" />
        {/* Information header */}
        {/* In the future, this description may be edited when multirecord/dynamic uses form filters */}
        <FormCreationHeading.Description>
          Create a filter on fields from your target table to limit what records
          form users are able to edit.
        </FormCreationHeading.Description>
        {unsupportedFields.length > 0 && (
          <FormCreationInfo>
            <p className="form-create-info-heading">
              The following fields cannot be filtered on:
            </p>
            <ul className="form-create-info-text list-disc">
              {unsupportedFields.map((fieldOption) => (
                <li className="ml-4" key={fieldOption.id}>
                  {fieldOption.name} ({fieldOption.type})
                </li>
              ))}
            </ul>
          </FormCreationInfo>
        )}
      </FormCreationHeading>

      <FormLayout
        onSubmit={() => {
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="formFilters"
          mode="array"
          children={(field) => (
            <div className="flex flex-col gap-2">
              {/* Filter condition description */}
              <div>
                <field.FieldLabel>Filter conditions</field.FieldLabel>
                <field.FieldDescription>
                  Select a field, condition, and value to create a filter
                  condition. Join filter conditions together using "and" or
                  "or".
                </field.FieldDescription>
              </div>
              {/* Filter condition input rows */}
              <div className="flex flex-col gap-1">
                {field.state.value?.map((_, i) => (
                  <form.AppField
                    key={i}
                    name={`formFilters[${i}]`}
                    children={(subField) => (
                      <div className="flex flex-col gap-0.5">
                        <div className="flex gap-0.5">
                          {/* If it's not the first condition, chain with a logical operator */}
                          {i > 0 && (
                            <subField.Select
                              aria-required
                              value={subField.state.value?.logicalOperator}
                              onValueChange={(value) => {
                                subField.handleChange({
                                  ...subField.state.value,
                                  logicalOperator: value as "and" | "or",
                                });
                              }}
                            >
                              <subField.SelectTrigger className="max-w-[5rem]">
                                <SelectValue />
                              </subField.SelectTrigger>
                              <SelectContent>
                                <SelectItem value="and">and</SelectItem>
                                <SelectItem value="or">or</SelectItem>
                              </SelectContent>
                            </subField.Select>
                          )}
                          {/* Field to filter on */}
                          <subField.Select
                            aria-required
                            value={subField.state.value?.field?.id}
                            onValueChange={(value) => {
                              const selectedField = fieldOptions.find(
                                (fieldOption) => fieldOption.id === value,
                              );
                              if (selectedField) {
                                subField.handleChange({
                                  ...subField.state.value,
                                  // TODO: If field changes, also change other stuff
                                  field: selectedField,
                                  operation: "",
                                  value: "",
                                });
                              }
                            }}
                          >
                            <subField.SelectTrigger>
                              <SelectValue placeholder="Select a field" />
                            </subField.SelectTrigger>
                            <SelectContent>
                              {fieldOptions.length === 0 && (
                                <p className="text-sm p-2 text-muted-foreground">
                                  No fields found.
                                </p>
                              )}
                              {fieldOptions.map((fieldOption) => (
                                <SelectItem
                                  value={fieldOption.id}
                                  key={fieldOption.id}
                                >
                                  {fieldOption.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </subField.Select>
                          {/* Filter operation */}
                          <form.Subscribe
                            selector={(state) =>
                              state.values.formFilters[i].field
                            }
                            children={(selectedField) => (
                              <subField.Select
                                aria-required
                                value={subField.state.value?.operation || ""}
                                onValueChange={(operation) => {
                                  subField.handleChange({
                                    ...subField.state.value,
                                    value: "",
                                    operation,
                                  });
                                }}
                              >
                                <subField.SelectTrigger
                                  // Disable this select until the field is selected
                                  disabled={!selectedField?.id}
                                >
                                  <SelectValue placeholder="Select a condition" />
                                </subField.SelectTrigger>
                                <SelectContent>
                                  {getValidOperations(selectedField?.type).map(
                                    (operation) => (
                                      <SelectItem
                                        value={operation}
                                        key={operation}
                                      >
                                        {formatOperator(operation)}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </subField.Select>
                            )}
                          />
                          {/* 
                          Extracted this part of the form to a separate component because it gets
                          unreasonably complex/unreadable
                        */}
                          <FilterConditionValue
                            form={form}
                            i={i}
                            // Base should be defined by the time this step is reached so cast as string
                            baseId={base?.id as string}
                            base={base as Base}
                          />
                          {/* Delete button */}
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => field.removeValue(i)}
                          >
                            <p className="sr-only">
                              Delete this form filter condition
                            </p>
                            <Trash />
                          </Button>
                        </div>
                        <div>
                          <subField.FieldErrors />
                          <form.AppField
                            name={`formFilters[${i}].value`}
                            children={(valueField) => (
                              <valueField.FieldErrors />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  />
                ))}
              </div>
              {/* Add new filter condition button */}
              <Button
                variant="outline"
                type="button"
                className="w-fit"
                onClick={() => {
                  if (field.state.value.length || 0 >= 0) {
                    field.handleChange([
                      ...field.state.value,
                      {
                        operation: "",
                        field: {
                          id: "",
                          name: "",
                          type: "singleLineText", // This will get changed when a user selects a field, this just keeps Typescript from screaming
                        },
                        value: "",
                        logicalOperator: "and",
                      },
                    ]);
                  }
                }}
              >
                <Plus /> Add filter
              </Button>
            </div>
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
