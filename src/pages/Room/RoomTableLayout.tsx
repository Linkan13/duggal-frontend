// pages/Room/RoomTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RoomTable from "./RoomList"; // ✅ adjust path to your RoomList component

export default function RoomTableLayout() {
  return (
    <>
      <PageMeta
        title="🏠 Rooms | Dashboard"
        description="Manage and view all rooms in one place"
      />

      <PageBreadcrumb pageTitle="🏠 Rooms" />

      <div className="space-y-6">
        <ComponentCard title="All Rooms">
          <RoomTable />
        </ComponentCard>
      </div>
    </>
  );
}
