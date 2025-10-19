import express, { Request, Response } from "express";
import axios from "axios";
import { authenticateUser } from "../middleware/auth";
import { AIRTABLE_PAT } from "../config";
import { filterData } from "../filterFormula";
import { User } from "@supabase/supabase-js";

// Type definitions
interface AirtableField {
  name: string;
  type: string;
}

interface FormConfig {
  type: string;
  selectedFields: Record<string, AirtableField>;
  searchFields?: Record<string, AirtableField>;
}

interface AirtableRecord {
  id?: string;
  fields: Record<string, unknown>;
}

interface BatchOperation<T> {
  (batch: T[]): Promise<unknown[]>;
}

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: User;
  userRole?: string;
}

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateUser);

// Airtable API headers
const headers = {
  Authorization: `Bearer ${AIRTABLE_PAT}`,
  "Content-Type": "application/json",
};

// Helper function to map field IDs to field names
function mapFieldIds(
  formConfig: FormConfig,
  filters: Record<string, unknown>,
): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  for (const fieldId in filters) {
    const field = formConfig.selectedFields[fieldId];
    if (field) {
      mapped[field.name] = filters[fieldId];
    }
  }
  return mapped;
}

// Helper function to handle batch operations (Airtable limit is 10 records per request)
async function batchOperation<T>(
  items: T[],
  batchSize: number,
  operation: BatchOperation<T>,
): Promise<unknown[]> {
  const results: unknown[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const result = await operation(batch);
    results.push(...(Array.isArray(result) ? result : [result]));
  }

  return results;
}

// GET /airtable/bases - List bases
// Returns a list of all bases the Airtable API token can access
router.get("/bases", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const url = "https://api.airtable.com/v0/meta/bases";

    const response = await axios.get(url, { headers });

    res.json({
      data: response.data.bases,
      count: response.data.bases?.length || 0,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching bases:", errorMessage);
    res.status(500).json({
      error: "Failed to fetch bases",
      details: errorMessage,
    });
  }
});

// GET /airtable/bases/{baseId}/tables/ - List tables for base/Get base schema
// Returns a list of all tables in a base
router.get(
  "/bases/:baseId/tables",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { baseId } = req.params;
      const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

      const response = await axios.get(url, { headers });

      res.json({
        data: response.data.tables,
        count: response.data.tables?.length || 0,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching base schema:", errorMessage);
      res.status(500).json({
        error: "Failed to fetch base schema",
        details: errorMessage,
      });
    }
  },
);

// GET /airtable/{baseId}/{tableId}/ - List records
// Returns a list of records in a table
// Supports filtering using `filterByFormula` query parameter
router.get(
  "/:baseId/:tableId",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { baseId, tableId } = req.params;
      const { filterByFormula, maxRecords, pageSize, sort, view } = req.query;

      let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`;

      // Build query parameters
      const params = new URLSearchParams();
      if (filterByFormula) {
        params.append("filterByFormula", filterByFormula as string);
      }
      if (maxRecords) {
        params.append("maxRecords", maxRecords as string);
      }
      if (pageSize) {
        params.append("pageSize", pageSize as string);
      }
      if (sort) {
        params.append("sort", sort as string);
      }
      if (view) {
        params.append("view", view as string);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, { headers });

      res.json({
        data: response.data.records,
        count: response.data.records?.length || 0,
        offset: response.data.offset,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching records:", errorMessage);
      res.status(500).json({
        error: "Failed to fetch records",
        details: errorMessage,
      });
    }
  },
);

// POST /airtable/{baseId}/{tableId}/ - Create records
// Create multiple records (supports more than 10 records per request)
router.post(
  "/:baseId/:tableId",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { baseId, tableId } = req.params;
      const { records } = req.body;

      if (!records || !Array.isArray(records)) {
        return res.status(400).json({
          error: "Invalid request body. Expected 'records' array.",
        });
      }

      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`;

      // Handle batch operations (Airtable allows max 10 records per request)
      const createBatch = async (
        batch: AirtableRecord[],
      ): Promise<unknown[]> => {
        const payload = {
          records: batch.map((record) => ({
            fields: record.fields || record,
          })),
        };

        const response = await axios.post(url, payload, { headers });
        return response.data.records;
      };

      const results = await batchOperation(records, 10, createBatch);

      res.status(201).json({
        data: results,
        count: results.length,
        message: `Successfully created ${results.length} records`,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating records:", errorMessage);
      res.status(500).json({
        error: "Failed to create records",
        details: errorMessage,
      });
    }
  },
);

// PUT /airtable/{baseId}/{tableId}/ - Update records
// Update multiple records (supports more than 10 records per request)
router.put(
  "/:baseId/:tableId",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { baseId, tableId } = req.params;
      const { records } = req.body;

      if (!records || !Array.isArray(records)) {
        return res.status(400).json({
          error:
            "Invalid request body. Expected 'records' array with id and fields.",
        });
      }

      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`;

      // Handle batch operations (Airtable allows max 10 records per request)
      const updateBatch = async (
        batch: AirtableRecord[],
      ): Promise<unknown[]> => {
        const payload = {
          records: batch.map((record) => ({
            id: record.id,
            fields: record.fields,
          })),
        };

        const response = await axios.patch(url, payload, { headers });
        return response.data.records;
      };

      const results = await batchOperation(records, 10, updateBatch);

      res.json({
        data: results,
        count: results.length,
        message: `Successfully updated ${results.length} records`,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating records:", errorMessage);
      res.status(500).json({
        error: "Failed to update records",
        details: errorMessage,
      });
    }
  },
);

// Additional utility endpoints

// POST /airtable/{baseId}/{tableId}/filtered - Fetch records with complex filtering
// This endpoint allows for more complex filtering based on form configurations
router.post(
  "/:baseId/:tableId/filtered",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { baseId, tableId } = req.params;
      const { filters, formConfig } = req.body;

      if (!formConfig) {
        return res.status(400).json({
          error: "Form configuration is required for filtered requests",
        });
      }

      // Map filters using form configuration
      let mappedFilters: Record<string, unknown> = {};

      if (formConfig.type === "update" && formConfig.searchFields) {
        // Handle update form filtering
        for (const fieldId in filters) {
          if (formConfig.searchFields[fieldId]) {
            const field = formConfig.searchFields[fieldId];
            mappedFilters[field.name] = filters[fieldId];
          }
        }
      } else {
        // Handle regular form filtering
        mappedFilters = mapFieldIds(formConfig, filters);
      }

      const formula = filterData(mappedFilters);
      let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`;

      if (formula) {
        url += `?filterByFormula=${encodeURIComponent(formula)}`;
      }

      const response = await axios.get(url, { headers });

      res.json({
        data: response.data.records,
        count: response.data.records?.length || 0,
        filter: formula,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching filtered records:", errorMessage);
      res.status(500).json({
        error: "Failed to fetch filtered records",
        details: errorMessage,
      });
    }
  },
);

// DELETE /airtable/{baseId}/{tableId}/ - Delete records
// Delete multiple records
router.delete(
  "/:baseId/:tableId",
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { baseId, tableId } = req.params;
      const { recordIds } = req.body;

      if (!recordIds || !Array.isArray(recordIds)) {
        return res.status(400).json({
          error: "Invalid request body. Expected 'recordIds' array.",
        });
      }

      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableId)}`;

      // Handle batch operations (Airtable allows max 10 records per request)
      const deleteBatch = async (batch: string[]): Promise<unknown[]> => {
        const deleteUrl = `${url}?${batch.map((id) => `records[]=${id}`).join("&")}`;
        const response = await axios.delete(deleteUrl, { headers });
        return response.data.records;
      };

      const results = await batchOperation(recordIds, 10, deleteBatch);

      res.json({
        data: results,
        count: results.length,
        message: `Successfully deleted ${results.length} records`,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting records:", errorMessage);
      res.status(500).json({
        error: "Failed to delete records",
        details: errorMessage,
      });
    }
  },
);

export default router;
