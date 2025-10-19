import { withForm } from "@/hooks/formHook";
import { formFiltersFormOpts } from "@/lib/formFiltersFormOpts";
import { useStore } from "@tanstack/react-form";
import { z } from "zod";
import {
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/form/Select";
import { useAirtableRecords } from "@/hooks/getAirtableRecords";
import type { Base } from "@shared/schema/schema";
import { Spinner } from "@/components/ui/Spinner";

const FilterConditionTextValue = withForm({
  ...formFiltersFormOpts,
  props: {
    i: 0, // Index in formFilters
  },
  render: function Render({ form, i }) {
    return (
      <form.AppField
        name={`formFilters[${i}].value`}
        validators={{
          onSubmit: z.string().min(1, "Value is required"),
        }}
        children={(subField) => (
          <subField.Input
            value={subField.state.value as string}
            onChange={(e) => {
              subField.handleChange(e.target.value);
            }}
          />
        )}
      />
    );
  },
});

const FilterConditionRecordLink = withForm({
  ...formFiltersFormOpts,
  props: {
    i: 0, // Index in formFilters
    baseId: "",
    tableId: "",
    base: {
      id: "",
      name: "",
      tables: [],
    } as Base,
  },
  render: function Render({ form, i, baseId, tableId, base }) {
    const airtableRecords = useAirtableRecords({
      baseId: baseId,
      tableId: tableId,
    });

    // table is guaranteed to exist in the same base
    const table = base.tables?.find((table) => table.id === tableId);
    // primaryField is guaranteed to exist in table
    const primaryField = table?.fields.find(
      (field) => field.id === table?.primaryFieldId,
    );

    return (
      <form.AppField
        name={`formFilters[${i}].value`}
        validators={{
          onSubmit: z.string().min(1, "Value is required"),
        }}
        children={(subField) => (
          <subField.Select>
            <subField.SelectTrigger disabled={airtableRecords.isLoading}>
              {airtableRecords.isLoading && (
                <>
                  <Spinner size="x-small" />
                  <p>Fetching records...</p>
                </>
              )}
              <SelectValue />
            </subField.SelectTrigger>
            <SelectContent>
              {airtableRecords.data?.data.length === 0 && (
                <p className="text-sm p-2 text-muted-foreground">
                  No records found.
                </p>
              )}
              {airtableRecords.data?.data.map((record) => (
                <SelectItem value={record.id}>
                  {record.fields[primaryField?.name as string]}
                </SelectItem>
              ))}
              <subField.FieldErrors />
            </SelectContent>
          </subField.Select>
        )}
      />
    );
  },
});

export const FilterConditionValue = withForm({
  ...formFiltersFormOpts,
  props: {
    i: 0, // Index in FormFilters
    baseId: "",
    base: {
      id: "",
      name: "",
      tables: [],
    } as Base,
  },
  render: function Render({ form, i, baseId, base }) {
    const { selectedField, operation } = useStore(form.store, (state) => ({
      selectedField: state.values.formFilters[i].field,
      operation: state.values.formFilters[i].operation,
    }));

    /* TODO: Specialized input based on operation + fieldtype */
    /* TODO: Need validations for each type of specialized input :( */

    // If either have not been selected yet, return nothing
    if (!selectedField.id || !operation) {
      return <></>;
    }

    // Otherwise, start returning the proper function
    switch (selectedField.type) {
      case "singleLineText":
        if (["is", "isNot"].includes(operation)) {
          return <FilterConditionTextValue i={i} form={form} />;
        }
        break;
      case "multipleRecordLinks":
        // For now, we don't care about options.prefersSingleLi
        if (["contains", "doesNotContain"].includes(operation)) {
          const tableId = selectedField.options?.linkedTableId as string;
          return (
            <FilterConditionRecordLink
              i={i}
              form={form}
              baseId={baseId}
              base={base}
              tableId={tableId}
            />
          );
        }
        break;
      default:
      // No default, let it fall through to unsupported message
    }

    return (
      // This is probably the incorrect way to go about things
      // and is most likely inaccessible, but I can't think of another way :(
      <form.AppField
        name={`formFilters[${i}]`}
        children={(subField) => (
          <subField.Input
            value=""
            placeholder="Unsupported field type"
            disabled
          />
        )}
        validators={{
          onSubmit: z.any().refine(
            () => false,
            // TODO: better error message
            "Filter condition is unsupported. Delete it or change fields",
          ),
        }}
      />
    );
  },
});
