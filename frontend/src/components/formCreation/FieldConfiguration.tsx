import { FormLayout } from "@/components/form/Form";
import { useAppForm } from "@/hooks/formHook";
import {
  FormCreationBackButton,
  FormCreationButtons,
  FormCreationContent,
  FormCreationHeading,
  FormCreationSubmitButton,
} from "@/components/formCreation/FormCreation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type {
  FormCreationState,
  UseFormCreationStore,
} from "@/lib/FormCreationStore";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type FieldSelection as FieldConfigurationType,
  fieldSelectionSchema as fieldConfigurationSchema,
} from "@shared/schema/formCreationSchemas";

type FieldConfigurationProps<TState extends FormCreationState> = {
  previousRoute: string;
  nextRoute: string;
  useFormCreationStore: UseFormCreationStore<TState>;
};

export const FieldConfiguration = ({
  previousRoute,
  nextRoute,
  useFormCreationStore,
}: FieldConfigurationProps<FormCreationState>) => {
  const name = useFormCreationStore((state) => state.name);
  const selectedFields = useFormCreationStore((state) => state.selectedFields);
  const setData = useFormCreationStore((state) => state.setData);
  const navigate = useNavigate();

  const defaultValues: FieldConfigurationType = {
    selectedFields: selectedFields || [],
  };

  const form = useAppForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      console.log(value);
      setData(value);
      navigate(nextRoute);
    },
    validators: {
      onSubmit: fieldConfigurationSchema,
    },
  });

  // Move sensors hook to the top level
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // Helper component for sortable row
  function SortableTableRow({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      background: isDragging ? "#f3f4f6" : undefined,
    };

    return (
      <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </tr>
    );
  }

  // TODO: In the future it may be better to use Tanstack Table instead but this works for now
  return (
    <FormCreationContent>
      <FormCreationHeading>
        {/* Heading and Save Status Indicator */}
        {/* Display form name or default */}
        <FormCreationHeading.FormName name={name} />
        {/* TODO: Status */}
        {/* {getStatusIndicator()} */}
        <FormCreationHeading.StepName name="Field Configuration" />
      </FormCreationHeading>
      {/* Field Configuration Section */}
      <FormLayout
        onSubmit={() => {
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="selectedFields"
          children={(field) => {
            // Handler for drag end
            const handleDragEnd = (
              event: import("@dnd-kit/core").DragEndEvent,
            ) => {
              const { active, over } = event;
              if (active.id !== over?.id) {
                const oldIndex = field.state.value.findIndex(
                  (item) => item.original.id === active.id,
                );
                const newIndex = over
                  ? field.state.value.findIndex(
                      (item) => item.original.id === over.id,
                    )
                  : -1;
                if (newIndex !== -1) {
                  const newItems = arrayMove(
                    field.state.value,
                    oldIndex,
                    newIndex,
                  );
                  field.handleChange(newItems);
                }
              }
            };

            return (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div>
                    <field.FieldLabel>Available fields</field.FieldLabel>
                    <field.FieldDescription>
                      Click to make fields editable/required in your form.
                    </field.FieldDescription>
                  </div>
                  {/* Select/Deselect All Button */}
                  <div className="flex gap-1"></div>
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={field.state.value.map((f) => f.original.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border">
                          <TableHead>Field</TableHead>
                          <TableHead className="text-center">
                            Editable
                          </TableHead>
                          <TableHead className="text-center">
                            Required
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {field.state.value.map((selectedField) => (
                          <SortableTableRow
                            key={selectedField.original.id}
                            id={selectedField.original.id}
                          >
                            <TableCell className="flex items-center gap-2">
                              <GripVertical className="text-gray-400 cursor-move" />
                              <div>
                                <p>{selectedField.original.name}</p>
                                <p className="text-xs text-gray-500">
                                  Type: {selectedField.original.type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {selectedField.original.id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Label className="flex justify-center">
                                {/* Editable */}
                                <Checkbox
                                  className="border-primary/40 size-5"
                                  checked={field.state.value.some(
                                    (option) =>
                                      option.original.id ===
                                        selectedField.original.id &&
                                      option.isEditable,
                                  )}
                                  onCheckedChange={() => {
                                    const newState = field.state.value.map(
                                      (option) =>
                                        option.original.id ===
                                        selectedField.original.id
                                          ? {
                                              ...selectedField,
                                              // If making it not editable, it can't be required
                                              isRequired:
                                                selectedField.isEditable
                                                  ? false
                                                  : selectedField.isRequired,
                                              isEditable:
                                                !selectedField.isEditable,
                                            }
                                          : option,
                                    );
                                    field.handleChange(newState);
                                  }}
                                />
                              </Label>
                            </TableCell>
                            <TableCell className="text-center">
                              <Label className="flex justify-center">
                                {/* Required */}

                                <Checkbox
                                  className="border-primary/40 size-5"
                                  checked={field.state.value.some(
                                    (option) =>
                                      option.original.id ===
                                        selectedField.original.id &&
                                      option.isRequired,
                                  )}
                                  onCheckedChange={() => {
                                    const newState = field.state.value.map(
                                      (option) =>
                                        option.original.id ===
                                        selectedField.original.id
                                          ? {
                                              ...selectedField,
                                              // If making it required, it has to be made editable too
                                              isEditable:
                                                !selectedField.isRequired
                                                  ? true
                                                  : selectedField.isEditable,
                                              isRequired:
                                                !selectedField.isRequired,
                                            }
                                          : option,
                                    );
                                    field.handleChange(newState);
                                  }}
                                />
                              </Label>
                            </TableCell>
                          </SortableTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </SortableContext>
                </DndContext>
                <field.FieldErrors />
              </div>
            );
          }}
        />
        <FormCreationButtons>
          <FormCreationBackButton to={previousRoute} />
          <FormCreationSubmitButton />
        </FormCreationButtons>
      </FormLayout>
    </FormCreationContent>
  );
};
