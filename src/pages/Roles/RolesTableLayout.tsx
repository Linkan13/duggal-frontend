// pages/Roles/RolesTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RolesTable from "./RolesList";

export default function RolesTableLayout() {
  return (
    <>
      <PageMeta
        title="📚 Roleses | Dashboard"
        description="Manage and view all course Roleses in one place"
      />

      <PageBreadcrumb pageTitle="📚 Roleses" />

      <div className="space-y-6">
        <ComponentCard title="All Roleses">
          <RolesTable />
        </ComponentCard>
      </div>
    </>
  );
}
