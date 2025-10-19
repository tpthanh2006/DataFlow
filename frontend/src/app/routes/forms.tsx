import { columns } from "@/components/formList/columns";
import { DataTable } from "@/components/ui/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { useForms } from "@/features/formsList/api/getForms";

export const Forms = () => {
  const forms = useForms();

  return (
    // TODO: Try to figure out why this has 2 scrollbars :/
    <div className="w-full overflow-x-scroll">
      <h1 className="h1">Forms</h1>
      {forms.isLoading && (
        <div className="flex flex-col items-center text-muted-foreground gap-2">
          <Skeleton className="h-10 w-full rounded-b-none" />
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
          <div className="mt-4">
            <Spinner />
            <p>Retrieving forms...</p>
          </div>
        </div>
      )}
      {forms.data && <DataTable columns={columns} data={forms.data} />}
    </div>
  );
};
