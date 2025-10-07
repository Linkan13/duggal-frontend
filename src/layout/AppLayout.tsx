import { SidebarProvider } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  return (
    <>
      <AppSidebar />
      <AppHeader />
      <div className="page-wrapper">
        <div className="content">
          <Outlet />
        </div>
        <div className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3">
          <p className="mb-0">&copy; Duggal Overseas</p>
          <p>
            Designed &amp; Developed By{" "}
            <a href="javascript:void(0);" className="text-primary">
              Navdeep
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
