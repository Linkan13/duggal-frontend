import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

import {
  CalenderIcon,
  GridIcon,
  ListIcon,
  InfoIcon,
  PlugInIcon,
  DollarLineIcon,
  UserCircleIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Leads", path: "/lead-dashboard" },
      { name: "Attendance", path: "/attendance-dashboard" },
      { name: "Payments", path: "/payment-dashboard" },
    ],
  },
  { icon: <CalenderIcon />, name: "Calendar", path: "/calendar" },
  { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },
  { icon: <UserCircleIcon />, name: "Settings", path: "/profile" },
  {
    name: "Students",
    icon: <ListIcon />,
    subItems: [
      { name: "Student List", path: "/student" },
      { name: "Create Student", path: "/student/create" },
    ],
  },
  {
    name: "Leads",
    icon: <ListIcon />, // changed from BoxCubeIcon
    subItems: [
      { name: "Leads List", path: "/leads" },
      { name: "Create Lead", path: "/leads/create" },
    ],
  },
  {
    name: "Staff",
    icon: <UserCircleIcon />, // changed from BoxCubeIcon
    subItems: [
      { name: "Staff List", path: "/staff" },
      { name: "Create Staff", path: "/staff/create" },
    ],
  },
  {
    name: "Rooms",
    icon: <CalenderIcon />, // changed from BoxCubeIcon
    subItems: [
      { name: "Rooms List", path: "/rooms" },
      { name: "Create Room", path: "/rooms/create" },
    ],
  },
  {
    name: "Batches",
    icon: <PlugInIcon />,
    subItems: [
      { name: "Batches List", path: "/batches" },
      { name: "Create Batch", path: "/batches/create" },
    ],
  },
  {
    name: "Offers",
    icon: <DollarLineIcon />,
    subItems: [
      { name: "Offers List", path: "/offers" },
      { name: "Create Offer", path: "/offers/create" },
    ],
  },
  {
    name: "Courses",
    icon: <InfoIcon />,
    subItems: [
      { name: "Courses List", path: "/course" },
      { name: "Create Course", path: "/course/create" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { openSubmenu, toggleSubmenu } = useSidebar();

  const isActive = (path?: string) => path === location.pathname;

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <a href="#" className="logo logo-normal">
          <img
            src="/images/logo-main.png"
            alt="Logo"
            className="img-fluid mx-auto d-block"
          />
        </a>
      </div>

      <div className="sidebar-inner slimscroll overflow-auto">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul>
            <li className="menu-title">
              <span>MAIN MENU</span>
            </li>
            <li>
              <ul>
                {navItems.map((item) => {
                  const hasSub = !!item.subItems;
                  const isSubActive =
                    hasSub &&
                    (openSubmenu === item.name ||
                      item.subItems?.some((sub) => isActive(sub.path)));

                  return (
                    <li key={item.name} className={hasSub ? "submenu" : ""}>
                      {hasSub ? (
                        <a
                          href="#"
                          className={
                            isSubActive
                              ? "active subdrop d-flex align-items-center"
                              : "d-flex align-items-center"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSubmenu(item.name);
                          }}
                        >
                          <span className="me-2">{item.icon}</span>
                          <span>{item.name}</span>
                          <span className="menu-arrow ms-auto"></span>
                        </a>
                      ) : (
                        <Link
                          to={item.path!}
                          className={
                            isActive(item.path)
                              ? "active d-flex align-items-center"
                              : "d-flex align-items-center"
                          }
                        >
                          <span className="me-2">{item.icon}</span>
                          <span>{item.name}</span>
                        </Link>
                      )}

                      {hasSub && (
                        <ul style={{ display: isSubActive ? "block" : "none" }} className="bg-white">
                          {item.subItems!.map((sub) => (
                            <li key={sub.name}>
                              <Link
                                to={sub.path!}
                                className={isActive(sub.path) ? "active" : ""}
                              >
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
