// pages/Offer/OfferTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import OfferTable from "./OfferList"; // ✅ relative path fix if inside same folder

export default function OfferTableLayout() {
  return (
    <>
      <PageMeta
        title="🎁 Offers | Dashboard"
        description="Manage and view all offers in one place"
      />

      <PageBreadcrumb pageTitle="🎁 Offers" />

      <div className="space-y-6">
        <ComponentCard title="All Offers">
          <OfferTable />
        </ComponentCard>
      </div>
    </>
  );
}
