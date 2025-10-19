import {
  FormCreationPageLayout,
  type FormCreationSidebarLink,
} from "@/components/formCreation/FormCreation";
import { useSingleRecordEditStore } from "../stores/SingleRecordEditStore";

export const SingleRecordEditPageLayout = () => {
  const name = useSingleRecordEditStore((state) => state.name);
  const description = useSingleRecordEditStore((state) => state.description);
  const base = useSingleRecordEditStore((state) => state.base);
  const targetTable = useSingleRecordEditStore((state) => state.targetTable);
  const selectedFields = useSingleRecordEditStore(
    (state) => state.selectedFields,
  );

  const links: FormCreationSidebarLink[] = [
    {
      label: "Form Info",
      route: "/create-form/edit-single-record/form-info",
      disabled: false,
    },
    {
      label: "Data Source",
      route: "/create-form/edit-single-record/data-source",
      disabled: name === undefined || description === undefined,
    },
    {
      label: "Field Selection",
      route: "/create-form/edit-single-record/field-selection",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined,
    },
    {
      label: "Field Configuration",
      route: "/create-form/edit-single-record/field-configuration",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined ||
        selectedFields === undefined,
    },
    {
      label: "Form Filters",
      route: "/create-form/edit-single-record/form-filters",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined ||
        selectedFields === undefined,
    },
    // TODO: These below probably need to be be blocked disabled if search builder step isn't complete
    {
      label: "Preview",
      route: "/create-form/edit-single-record/preview",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined ||
        selectedFields === undefined,
    },
    {
      label: "Publish",
      route: "/create-form/edit-single-record/publish",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined ||
        selectedFields === undefined,
    },
  ];

  return <FormCreationPageLayout links={links} />;
};
