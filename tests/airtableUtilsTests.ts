import axios from "axios";
import {
  fetchTableData,
  fetchBase,
  fetchTableFromBase,
  writeSingleRecordToTable,
  writeMultiRecordsToTable,
  updateSingleRecordInTable,
  updateMultiRecordsInTable,
} from "../backend/airtableUtils";
import { FormConfig } from "../shared/types/formTypes";
import { vi, describe, expect, it, beforeEach } from "vitest";

vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  patch: jest.Mock;
};

const dummyFormConfig: FormConfig = {
  id: "form1",
  name: "Test Form",
  type: "create",
  dataSource: { baseName: "TestBase", tableName: "TestTable" },
  selectedFields: {
    field1: {
      id: "field1",
      name: "Field One",
      dataType: "text",
      isRequired: false,
      isEditable: true,
    },
    field2: {
      id: "field2",
      name: "Field Two",
      dataType: "text",
      isRequired: false,
      isEditable: true,
    },
  },
  fieldOrder: ["field1", "field2"],
  createdAt: "",
  updatedAt: "",
};

describe("airtableUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchTableData calls axios.get with correct URL and returns records", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { records: [{ id: "rec1" }] },
    });

    const records = await fetchTableData(
      "base123",
      "TableName",
      {},
      dummyFormConfig,
    );
    expect(records).toEqual([{ id: "rec1" }]);
    expect(mockedAxios.get).toHaveBeenCalled();
  });

  it("fetchBase fetches metadata for a base", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { tables: ["TableA", "TableB"] },
    });
    const tables = await fetchBase("base123");
    expect(tables).toEqual(["TableA", "TableB"]);
  });

  it("fetchTableFromBase fetches records for given base and table", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { records: [{ id: "rec1" }] },
    });
    const records = await fetchTableFromBase("base123", dummyFormConfig);
    expect(records).toEqual([{ id: "rec1" }]);
  });

  it("writeSingleRecordToTable posts one record and returns response", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "rec123", fields: { name: "Test" } },
    });
    const response = await writeSingleRecordToTable("base123", "TestTable", {
      name: "Test",
    });
    expect(response.id).toBe("rec123");
  });

  it("writeMultiRecordsToTable posts multiple records", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { records: [{ id: "rec1" }, { id: "rec2" }] },
    });
    const response = await writeMultiRecordsToTable("base123", "TestTable", [
      { name: "A" },
      { name: "B" },
    ]);
    expect(response.length).toBe(2);
  });

  it("updateSingleRecordInTable updates a single record", async () => {
    mockedAxios.patch.mockResolvedValueOnce({
      data: { id: "rec1", fields: { name: "Updated" } },
    });
    const response = await updateSingleRecordInTable(
      "base123",
      "TestTable",
      "rec1",
      { name: "Updated" },
    );
    expect(response.fields.name).toBe("Updated");
  });

  it("updateMultiRecordsInTable updates multiple records", async () => {
    mockedAxios.patch.mockResolvedValueOnce({
      data: { records: [{ id: "rec1" }, { id: "rec2" }] },
    });
    const updates = [
      { id: "rec1", fields: { name: "One" } },
      { id: "rec2", fields: { name: "Two" } },
    ];
    const response = await updateMultiRecordsInTable(
      "base123",
      "TestTable",
      updates,
    );
    expect(response.length).toBe(2);
  });
});
