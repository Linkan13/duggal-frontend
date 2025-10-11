// pages/Lead/LeadTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import LeadTable from "./LeadList";

export default function LeadTableLayout() {
  return (
    <>
      <PageMeta
        title="📚 Leades | Dashboard"
        description="Manage and view all course Leades in one place"
      />

      <PageBreadcrumb pageTitle="📚 Leades" />

      <div className="space-y-6">
        <ComponentCard title="All Leades">
          <LeadTable />
        </ComponentCard>
      </div>
    </>
  );
}
