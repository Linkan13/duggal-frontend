// pages/Course/CourseTableLayout.tsx

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CourseTable from "./CourseList"; // adjust if file is elsewhere

export default function CourseTableLayout() {
  return (
    <>
      <PageMeta
        title="📘 Courses | Dashboard"
        description="Manage and view all courses in one place"
      />

      <PageBreadcrumb pageTitle="📘 Courses" />

      <div className="space-y-6">
        <ComponentCard title="All Courses">
          <CourseTable />
        </ComponentCard>
      </div>
    </>
  );
}
