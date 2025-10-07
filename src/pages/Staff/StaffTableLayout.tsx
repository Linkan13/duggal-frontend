// pages/Staff/StaffTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StaffTable from "./StaffList"; // keep relative to Staff folder

export default function StaffTableLayout() {
  return (
    <>
      <PageMeta
        title="📚 Staff | Dashboard"
        description="Manage and view all course Staff in one place"
      />

      <PageBreadcrumb pageTitle="📚 Staff List" />

      <div className="space-y-6">
        <ComponentCard title="Staff List">
          <StaffTable />
        </ComponentCard>
      </div>
    </>
  );
}
