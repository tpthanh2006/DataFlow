import {
  FormCreationPageLayout,
  type FormCreationSidebarLink,
} from "@/components/formCreation/FormCreation";
import { useSingleRecordCreateStore } from "../stores/SingleRecordCreateStore";

export const SingleRecordCreatePageLayout = () => {
  const name = useSingleRecordCreateStore((state) => state.name);
  const description = useSingleRecordCreateStore((state) => state.description);
  const base = useSingleRecordCreateStore((state) => state.base);
  const targetTable = useSingleRecordCreateStore((state) => state.targetTable);
  const selectedFields = useSingleRecordCreateStore(
    (state) => state.selectedFields,
  );

  const links: FormCreationSidebarLink[] = [
    {
      label: "Form Info",
      route: "/create-form/create-single-record/form-info",
      disabled: false,
    },
    {
      label: "Data Source",
      route: "/create-form/create-single-record/data-source",
      disabled: name === undefined || description === undefined,
    },
    {
      label: "Field Selection",
      route: "/create-form/create-single-record/field-selection",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined,
    },
    {
      label: "Field Configuration",
      route: "/create-form/create-single-record/field-configuration",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined ||
        selectedFields === undefined,
    },
    {
      label: "Preview",
      route: "/create-form/create-single-record/preview",
      disabled:
        name === undefined ||
        description === undefined ||
        base === undefined ||
        targetTable === undefined ||
        selectedFields === undefined,
    },
    {
      label: "Publish",
      route: "/create-form/create-single-record/publish",
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
