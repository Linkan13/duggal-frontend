import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAlertMessage } from "@/utils/alertService";

interface User {
  firstname: string;
  email: string;
  avatar: string;
}

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        firstname: "Kevin Larry",
        email: "warren@example.com",
        avatar: "/react/template/src/assets/img/profiles/avatar-12.jpg",
      });
    }
  }, []);

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAlertMessage("Logged out successfully!");
    navigate("/signin");
  };

  return (
    <div className="d-flex align-items-center">
      <div className="dropdown profile-dropdown">
        <div className="dropdown-menu shadow-none">
          <div className="card mb-0">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-lg me-2 avatar-rounded">
                  <img
                    alt="img"
                    src={
                      user?.avatar ||
                      "/react/template/src/assets/img/profiles/avatar-12.jpg"
                    }
                  />
                </span>
                <div>
                  <h5 className="mb-0">{user?.firstname}Kevin Larry </h5>
                  <p className="fs-12 fw-medium mb-0">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <a
                className="dropdown-item d-inline-flex align-items-center p-0 py-2"
                href="/react/template/knowledgebase"
                data-discover="true"
              >
                <i className="ti ti-question-mark me-1"></i>
                Knowledge Base
              </a>
            </div>
            <div className="card-footer">
              <a
                className="dropdown-item d-inline-flex align-items-center p-0 py-2"
                href="/react/template/login"
                data-discover="true"
                onClick={handleSignOut}
              >
                <i className="ti ti-login me-2"></i>
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
