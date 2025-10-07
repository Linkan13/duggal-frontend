import { useEffect, useRef } from "react";
import UserDropdown from "../components/header/UserDropdown";
import {
  ArrowBarToLeft,
  Search,
  LayoutGrid,
  UserCircle,
  HeartHandshake,
  Timeline,
  Building,
  UserCheck,
  Activity,
} from "tabler-icons-react";

const AppHeader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="header">
      <div className="main-header">
        <div className="header-user">
          <div className="nav user-menu nav-list">
            <div className="me-auto d-flex align-items-center" id="header-search">
              <a
                id="toggle_btn"
                className="btn btn-menubar me-1"
                href="/react/template/contact-details"
                data-discover="true"
              >
                <ArrowBarToLeft size={20} />
              </a>
              <div className="input-group input-group-flat d-inline-flex me-1">
                <span className="input-icon-addon">
                  <Search size={16} />
                </span>
                <input
                  className="form-control"
                  placeholder="Search in HRMS"
                  type="text"
                  ref={inputRef}
                />
              </div>
              <div className="dropdown crm-dropdown">
                <a
                  className="btn btn-menubar me-1 show"
                  data-bs-toggle="dropdown"
                  href="/react/template/contact-details"
                  data-discover="true"
                  aria-expanded="true"
                >
                  <LayoutGrid size={20} />
                </a>
                <div
                  className="dropdown-menu dropdown-lg dropdown-menu-start"
                  style={{
                    position: "absolute",
                    inset: "0px auto auto 0px",
                    margin: "0px",
                    transform: "translate(0px, 32px)",
                  }}
                  data-popper-placement="bottom-start"
                >
                  <div className="card mb-0 border-0 shadow-none">
                    <div className="card-header">
                      <h4>CRM</h4>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-sm-6">
                          <a
                            className="d-flex align-items-center justify-content-between p-2 crm-link mb-3"
                            href="/react/template/contact-list"
                            data-discover="true"
                          >
                            <span className="d-flex align-items-center me-3">
                              <UserCircle size={16} className="text-default me-2" />
                              Contacts
                            </span>
                            <i className="ti ti-arrow-right"></i>
                          </a>
                          <a
                            className="d-flex align-items-center justify-content-between p-2 crm-link mb-3"
                            href="/react/template/deals-grid"
                            data-discover="true"
                          >
                            <span className="d-flex align-items-center me-3">
                              <HeartHandshake size={16} className="text-default me-2" />
                              Deals
                            </span>
                            <i className="ti ti-arrow-right"></i>
                          </a>
                          <a
                            className="d-flex align-items-center justify-content-between p-2 crm-link mb-3"
                            href="/react/template/pipeline"
                            data-discover="true"
                          >
                            <span className="d-flex align-items-center me-3">
                              <Timeline size={16} className="text-default me-2" />
                              Pipeline
                            </span>
                            <i className="ti ti-arrow-right"></i>
                          </a>
                        </div>
                        <div className="col-sm-6">
                          <a
                            className="d-flex align-items-center justify-content-between p-2 crm-link mb-3"
                            href="/react/template/companies-grid"
                            data-discover="true"
                          >
                            <span className="d-flex align-items-center me-3">
                              <Building size={16} className="text-default me-2" />
                              Companies
                            </span>
                            <i className="ti ti-arrow-right"></i>
                          </a>
                          <a
                            className="d-flex align-items-center justify-content-between p-2 crm-link mb-3"
                            href="/react/template/leads-grid"
                            data-discover="true"
                          >
                            <span className="d-flex align-items-center me-3">
                              <UserCheck size={16} className="text-default me-2" />
                              Leads
                            </span>
                            <i className="ti ti-arrow-right"></i>
                          </a>
                          <a
                            className="d-flex align-items-center justify-content-between p-2 crm-link mb-3"
                            href="/react/template/activity"
                            data-discover="true"
                          >
                            <span className="d-flex align-items-center me-3">
                              <Activity size={16} className="text-default me-2" />
                              Activities
                            </span>
                            <i className="ti ti-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="dropdown profile-dropdown">
                <a
                  className="dropdown-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  href="/react/template/contact-details"
                  data-discover="true"
                  aria-expanded="false"
                >
                  <span className="avatar avatar-sm online">
                    <img
                      className="img-fluid rounded-circle"
                      alt="Img"
                      src="/react/template/src/assets/img/profiles/avatar-12.jpg"
                    />
                  </span>
                </a>
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
