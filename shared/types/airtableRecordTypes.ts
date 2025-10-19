export type AirtableRecord = {
  id: string;
  createdTime: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any>;
};
