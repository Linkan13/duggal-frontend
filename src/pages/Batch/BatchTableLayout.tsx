// pages/Batch/BatchTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BatchTable from "./BatchList"; // keep relative to Batch folder

export default function BatchTableLayout() {
  return (
    <>
      <PageMeta
        title="📚 Batches | Dashboard"
        description="Manage and view all course batches in one place"
      />

      <PageBreadcrumb pageTitle="📚 Batches" />

      <div className="space-y-6">
        <ComponentCard title="All Batches">
          <BatchTable />
        </ComponentCard>
      </div>
    </>
  );
}
