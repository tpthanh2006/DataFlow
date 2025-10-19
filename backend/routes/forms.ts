import express, { Request, Response } from "express";
import {
  authenticateUser,
  requireAdmin,
  requireStaffOrAdmin,
} from "../middleware/auth";

import { supabase } from "../lib/supabase";
import { PostgrestError, QueryError, User } from "@supabase/supabase-js";

import type { Form as FormSchemaType } from "../../shared/schema/schema"; // Use this for inputs (e.g. the request made from the frontend)
import { Database } from "../lib/supabaseTypes";
import {
  BaseFormRow,
  postTypeSpecificForm,
  putTypeSpecificForm,
  transformBaseFormRecordToForm,
  transformFormsViewRecordToForm,
  transformRecordToForm,
  validateFormConfigInput,
} from "../lib/formsUtils";

// Extend Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: User;
  userRole?: string;
}

const router = express.Router();

// Test route to verify forms router is working
router.get("/test", (req: Request, res: Response) => {
  res.json({
    message: "Forms router is working",
    timestamp: new Date().toISOString(),
  });
});

// Test route for form access (no auth required for testing)
router.post("/:formId/access-test", (req: Request, res: Response) => {
  console.log("🧪 Test route hit for form:", req.params.formId);
  console.log("🧪 Full URL:", req.url);
  console.log("🧪 Method:", req.method);
  res.json({
    message: "Form access test route working",
    formId: req.params.formId,
  });
});

// Test route to check form_access table structure
router.get("/test-form-access-table", async (req: Request, res: Response) => {
  try {
    console.log("🧪 Testing form_access table...");

    // Check if table exists by trying to select from it
    const { data, error } = await supabase
      .from("form_access")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Error accessing form_access table:", error);
      return res.status(500).json({
        error: "Cannot access form_access table",
        details: error.message,
      });
    }

    console.log("✅ form_access table accessible");
    res.json({
      message: "form_access table is accessible",
      sampleData: data,
      tableExists: true,
    });
  } catch (error) {
    console.error("❌ Error testing form_access table:", error);
    res.status(500).json({
      error: "Error testing form_access table",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Debug route to see all registered routes
router.get("/debug-routes", (req: Request, res: Response) => {
  const routes: Array<{ path: string; methods: string[] }> = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods || {});
      routes.push({
        path: middleware.route.path,
        methods: methods,
      });
    }
  });
  res.json({ routes });
});

// POST /forms/:formId/access - Update form access permissions (moved before auth middleware for testing)
router.post(
  "/:formId/access",
  authenticateUser,
  requireStaffOrAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId } = req.params;
      const { groups } = req.body;

      console.log(`📝 Updating access for form ${formId}:`, groups);
      console.log(`📝 Form ID type:`, typeof formId, formId);
      console.log(`📝 Parsed form ID:`, parseInt(formId));
      console.log(`📝 Request body:`, req.body);
      console.log(`📝 Groups type:`, typeof groups, Array.isArray(groups));

      // Validate input
      if (!groups || !Array.isArray(groups)) {
        console.log("❌ Validation failed: groups is not an array");
        return res.status(400).json({
          error: "Invalid input: groups must be an array",
        });
      }

      // Transform groups data to match the database schema
      const userGroupsWithAccess = groups.map(
        (group: {
          group_name: string;
          group_description: string;
          user_emails: string[];
          hasAccess?: boolean;
        }) => ({
          group_name: group.group_name,
          group_description: group.group_description,
          user_emails: group.user_emails,
          hasAccess: group.hasAccess || true,
        }),
      );

      // Upsert the form access record
      const upsertData = {
        form_id: parseInt(formId),
        user_groups_with_access: userGroupsWithAccess,
        created_at: new Date().toISOString(),
      };

      console.log("💾 Upserting to form_access table:", upsertData);
      console.log("💾 Upsert data type:", typeof upsertData);
      console.log(
        "💾 Form ID in upsert:",
        typeof upsertData.form_id,
        upsertData.form_id,
      );

      // Check if form_access table exists
      const { error: tableError } = await supabase
        .from("form_access")
        .select("*")
        .limit(1);

      if (tableError) {
        console.error("❌ Error checking form_access table:", tableError);
        return res.status(500).json({
          error: "Database table error",
          details: tableError.message,
        });
      }

      console.log("✅ form_access table exists, proceeding with upsert");

      const { data, error } = await supabase
        .from("form_access")
        .upsert(upsertData, {
          onConflict: "form_id",
        })
        .select();

      if (error) {
        console.error("❌ Error saving form access:", error);
        console.error("❌ Error details:", JSON.stringify(error, null, 2));
        return res.status(500).json({
          error: "Failed to save form access",
          details: error.message,
        });
      }

      console.log("✅ Form access saved successfully:", data);
      res.json({
        success: true,
        message: "Form access updated successfully",
        data: data[0],
      });
    } catch (error) {
      console.error("❌ Error in form access endpoint:", error);
      console.error(
        "❌ Error stack:",
        error instanceof Error ? error.stack : "No stack trace",
      );
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// GET /forms/:formId/access - Get form access permissions (moved before auth middleware for testing)
router.get(
  "/:formId/access",
  authenticateUser,
  requireStaffOrAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId } = req.params;

      console.log(`📖 Getting access for form ${formId}`);

      const { data, error } = await supabase
        .from("form_access")
        .select("*")
        .eq("form_id", parseInt(formId))
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows found - return empty access
          return res.json({
            success: true,
            data: {
              form_id: parseInt(formId),
              user_groups_with_access: [],
              created_at: null,
            },
          });
        }
        console.error("❌ Error fetching form access:", error);
        return res.status(500).json({
          error: "Failed to fetch form access",
          details: error.message,
        });
      }

      console.log("✅ Form access fetched successfully:", data);
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("❌ Error in get form access endpoint:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Apply authentication to all routes
router.use(authenticateUser);

// GET /forms/ - List forms
// Admins should be able to retrieve *all* forms
// Staff should only be able to retrieve forms assigned to them
// TODO: This might need to be more considerate of different form types
router.get(
  "/",
  requireStaffOrAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const userRole = req.userRole;

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      let query = supabase.from("forms").select("*");

      // If user is not admin, filter by assignments
      if (userRole !== "admin") {
        // For staff, only show forms assigned to them
        query = supabase
          .from("forms")
          .select("*")
          .contains("assigned_user_ids", [user.id]);
      }

      const {
        data,
        error,
      }: {
        data: Database["public"]["Views"]["forms"]["Row"][] | null;
        error: QueryError | null;
      } = await query;

      if (error) {
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      }

      // Transform data from Supabase into the Form type from shared/
      const formattedData = data?.map((record) => {
        const form = transformFormsViewRecordToForm(record);
        return {
          ...form,
        };
      });

      res.json({ data: formattedData, count: data?.length || 0 });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// GET /forms/{formId}/ - Get form
// Admins should be able to retrieve *any* form
// Staff should only be able to retrieve forms assigned to them
router.get(
  "/:formId",
  requireStaffOrAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId } = req.params;
      const user = req.user;
      const userRole = req.userRole;

      if (!user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // TODO: in the future, might also need to get information specific to that form type
      let query = supabase.from("forms").select("*").eq("id", formId);

      // If user is not admin, check if form is assigned to them
      if (userRole !== "admin") {
        query = supabase
          .from("forms")
          .select("*")
          .contains("assigned_user_ids", [user.id]);
      }

      const {
        data,
        error,
      }: {
        data: Database["public"]["Views"]["forms"]["Row"] | null;
        error: QueryError | null;
      } = await query.single();

      if (error) {
        if (error.code === "PGRST116") {
          return res
            .status(404)
            .json({ error: "Form not found or access denied" });
        }
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      }

      if (data === null) {
        return res
          .status(404)
          .json({ error: "Form not found or access denied" });
      }

      // // # FORM DATA
      // Get base form attributes from base_form in Supabase
      // Get type specific form attributes from the proper table in Supabase
      // Transform the data into Form type

      const form = transformFormsViewRecordToForm(data);

      res.json({ ...form });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
// */

// POST /forms/ - Create form
// Only admins should be able to create forms
// TODO: This should be more considerate of different form types
router.post(
  "/",
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const formConfig = req.body as FormSchemaType;

      // Validate input
      validateFormConfigInput(formConfig);

      // # BASE FORM DATA
      // Post the base form attributes to base_form in Supabase
      // No matter what, insert the base form into the table:
      // Don't include ID or updatedAt so that it gets autogenerated by the database itself
      const newBaseForm: Database["public"]["Tables"]["base_form"]["Insert"] = {
        type: formConfig.type,
        name: formConfig.name,
        description: formConfig.description || null,
        base: JSON.stringify(formConfig.base),
        target_table: JSON.stringify(formConfig.targetTable),
        selected_fields: JSON.stringify(formConfig.selectedFields),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(), // We don't care about previous updatedAt date, we just know that we've updated the form *now* so we can update it
      };

      const {
        data,
        error,
      }: {
        data: BaseFormRow | null;
        error: PostgrestError | null;
      } = await supabase
        .from("base_form")
        .insert(newBaseForm)
        .select()
        .single();

      if (error) {
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      } else if (!data) {
        console.error("invalid form data");
        return res.status(500).json({ error: "Internal server error" });
      }

      // # TYPE SPECIFIC FORM DATA
      // Post type specific form attributes to the proper table in Supabase
      const { data: typeSpecificData, error: typeSpecificError } =
        await postTypeSpecificForm(formConfig, data);

      if (typeSpecificError) {
        return res
          .status(500)
          .json({ error: `Database error: ${typeSpecificError.message}` });
      } else if (typeSpecificData === null) {
        console.error("invalid type specific data");
        return res.status(500).json({ error: "Internal server error" });
      }

      // # RETURN DATA
      // Transform the data into Form type for usage on the client side
      const form = transformRecordToForm(data, typeSpecificData);

      res.status(201).json({ ...form });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
);

// PUT /forms/{formId}/ - Edit form
// Update an existing Form object in our database
// TODO: This should be more considerate of different form types
router.put(
  "/:formId",
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId } = req.params;
      const updatedConfig = req.body as FormSchemaType;

      // Validate input
      validateFormConfigInput(updatedConfig);

      // # BASE FORM DATA
      // Update the base form attributes in the base_form table in Supabase
      // For every form we have to update the base form
      const newBaseForm: Database["public"]["Tables"]["base_form"]["Update"] = {
        name: updatedConfig.name,
        description: updatedConfig.description,
        base: JSON.stringify(updatedConfig.base),
        target_table: JSON.stringify(updatedConfig.targetTable),
        selected_fields: JSON.stringify(updatedConfig.selectedFields),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("base_form")
        .update(newBaseForm)
        .eq("id", formId)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Form not found" });
        }
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      }

      // # TYPE SPECIFIC FORM DATA
      // Update the type specific form attributes in the proper table in Supabase
      const { data: typeSpecificData, error: typeSpecificError } =
        await putTypeSpecificForm(updatedConfig, formId);

      if (typeSpecificError) {
        return res
          .status(500)
          .json({ error: `Database error: ${typeSpecificError.message}` });
      } else if (typeSpecificData === null) {
        console.error("invalid type specific data");
        return res.status(500).json({ error: "Internal server error" });
      }

      // # RETURN DATA
      // Transform the data before returning it
      const form = transformRecordToForm(data, typeSpecificData);

      res.status(200).json({ ...form });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
);

// DELETE /forms/{formId}/ - Delete form
// Delete an existing Form object in our database
// Returns only the base form data
router.delete(
  "/:formId",
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId } = req.params;

      // First, delete any form assignments
      await supabase.from("form_assignment").delete().eq("form_id", formId);

      // Then delete the form
      // Our tables our defined with DELETE ON CASCASE, so this *should* delete form assignments
      // and type specific entries related to the base form
      // TODO: Test this
      const {
        data,
        error,
      }: {
        data: BaseFormRow | null;
        error: PostgrestError | null;
      } = await supabase
        .from("base_form")
        .delete()
        .eq("id", formId)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Form not found" });
        }
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      } else if (!data) {
        return res.status(500).json({ error: "Internal server error" });
      }

      const form = transformBaseFormRecordToForm(data);

      res.json({ data: form, message: "Form deleted successfully" });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// POST /forms/{formId}/assignments/ - Create form assignment
// Create a new form assignment between a form and user
router.post(
  "/:formId/assignments",
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      // Check if form exists
      const { data: formExists } = await supabase
        .from("base_form")
        .select("id")
        .eq("id", formId)
        .single();

      if (!formExists) {
        return res.status(404).json({ error: "Form not found" });
      }

      // Check if assignment already exists
      const { data: existingAssignment } = await supabase
        .from("form_assignment")
        .select("form_id, user_id")
        .eq("form_id", formId)
        .eq("user_id", userId)
        .single();

      if (existingAssignment) {
        return res.status(409).json({ error: "Assignment already exists" });
      }

      // Create the assignment
      const { data, error } = await supabase
        .from("form_assignment")
        .insert([
          {
            form_id: formId,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      }

      res
        .status(201)
        .json({ data, message: "Form assignment created successfully" });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// DELETE /forms/{formId}/assignments/{userId}/ - Delete form assignment
// Delete an existing form assignment between a form and user
router.delete(
  "/:formId/assignments/:userId",
  requireAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { formId, userId } = req.params;

      const { data, error } = await supabase
        .from("form_assignment")
        .delete()
        .eq("form_id", formId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Assignment not found" });
        }
        return res
          .status(500)
          .json({ error: `Database error: ${error.message}` });
      }

      res.json({ data, message: "Form assignment deleted successfully" });
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
