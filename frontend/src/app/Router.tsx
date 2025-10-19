import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { Login } from "@/app/routes/login";
import { Dashboard } from "@/app/routes/dashboard";
import { StaticAdmin } from "@/app/routes/static-admin";
import { Layout } from "@/components/Layout";
import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { Resources } from "./routes/resources";
import { Forms } from "./routes/forms";
import { SingleRecordCreateStoreProvider } from "@/features/singleRecordCreate/stores/SingleRecordCreateStore";
import { SingleRecordCreatePageLayout } from "@/features/singleRecordCreate/components/SingleRecordCreatePageLayout";
import { SingleRecordCreateFormInfo } from "@/features/singleRecordCreate/components/SingleRecordCreateFormInfo";
import { SingleRecordCreateDataSource } from "@/features/singleRecordCreate/components/SingleRecordCreateDataSource";
import { SingleRecordCreateFieldSelection } from "@/features/singleRecordCreate/components/SingleRecordCreateFieldSelection";
import { SingleRecordCreateFieldConfiguration } from "@/features/singleRecordCreate/components/SingleRecordCreateFieldConfiguration";
import { SingleRecordEditStoreProvider } from "@/features/singleRecordEdit/stores/SingleRecordEditStore";
import { SingleRecordEditFormInfo } from "@/features/singleRecordEdit/components/SingleRecordEditFormInfo";
import { SingleRecordEditDataSource } from "@/features/singleRecordEdit/components/SingleRecordEditDataSource";
import { SingleRecordEditFieldSelection } from "@/features/singleRecordEdit/components/SingleRecordEditFieldSelection";
import { SingleRecordEditFieldConfiguration } from "@/features/singleRecordEdit/components/SingleRecordEditFieldConfiguration";
import { SingleRecordEditPageLayout } from "@/features/singleRecordEdit/components/SingleRecordEditPageLayout";
import { SingleRecordCreatePreview } from "@/features/singleRecordCreate/components/SingleRecordCreatePreview";
import { SingleRecordCreatePublish } from "@/features/singleRecordCreate/components/SingleRecordCreatePublish";
import { SingleRecordEditFormFilters } from "@/features/singleRecordEdit/components/SingleRecordEditFormFilters";
import { SingleRecordEditPublish } from "@/features/singleRecordEdit/components/SingleRecordEditPublish";
import { StaffUserGroups } from "@/components/test/StaffUserGroups";
//import { SingleRecordSearchBuilder } from "@/features/singleRecordEdit/components/SingleRecordSearchBuilder";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/staff-user-groups" element={<StaffUserGroups />} />
          </Route>
          {/* TODO: Protect /create-form/ with a protectedroute */}
          <Route path="/create-form/">
            <Route
              path="/create-form/create-single-record"
              element={
                <SingleRecordCreateStoreProvider>
                  <SingleRecordCreatePageLayout />
                </SingleRecordCreateStoreProvider>
              }
            >
              <Route
                path="/create-form/create-single-record/form-info"
                element={<SingleRecordCreateFormInfo />}
              />
              <Route
                path="/create-form/create-single-record/data-source"
                element={<SingleRecordCreateDataSource />}
              />
              <Route
                path="/create-form/create-single-record/field-selection"
                element={<SingleRecordCreateFieldSelection />}
              />
              <Route
                path="/create-form/create-single-record/field-configuration"
                element={<SingleRecordCreateFieldConfiguration />}
              />
              <Route
                path="/create-form/create-single-record/preview"
                element={<SingleRecordCreatePreview />}
              />
              <Route
                path="/create-form/create-single-record/publish"
                element={<SingleRecordCreatePublish />}
              />
            </Route>
            <Route
              path="/create-form/edit-single-record"
              element={
                <SingleRecordEditStoreProvider>
                  <SingleRecordEditPageLayout />
                </SingleRecordEditStoreProvider>
              }
            >
              <Route
                path="/create-form/edit-single-record/form-info"
                element={<SingleRecordEditFormInfo />}
              />
              <Route
                path="/create-form/edit-single-record/data-source"
                element={<SingleRecordEditDataSource />}
              />
              <Route
                path="/create-form/edit-single-record/field-selection"
                element={<SingleRecordEditFieldSelection />}
              />
              <Route
                path="/create-form/edit-single-record/field-configuration"
                element={<SingleRecordEditFieldConfiguration />}
              />
              <Route
                path="/create-form/edit-single-record/form-filters"
                element={<SingleRecordEditFormFilters />}
              />
              <Route
                path="/create-form/edit-single-record/preview"
                element={<p>preview</p>}
              />
              <Route
                path="/create-form/edit-single-record/publish"
                element={<SingleRecordEditPublish />}
              />
            </Route>
          </Route>
        </Route>
        <Route
          path="/static-admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StaticAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
