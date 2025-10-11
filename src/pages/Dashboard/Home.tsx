import { useEffect } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { getAlertMessage } from "@/utils/alertService";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";

export default function Home() {
  useEffect(() => {
    const msg = getAlertMessage();
    if (msg) showMessage(msg, MESSAGE_TYPE.SUCCESS);
  }, []);

  return (
    <>
      <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
        <div className="my-auto mb-2">
          <h2 className="mb-1">Dashboard</h2>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="https://smarthr.co.in/demo/html/template/index.html">
                  <i className="ti ti-smart-home"></i>
                </a>
              </li>
              <li className="breadcrumb-item">Superadmin</li>
              <li className="breadcrumb-item active" aria-current="page">
                Dashboard
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
          <div className="input-icon mb-2 position-relative">
            <span className="input-icon-addon">
              <i className="ti ti-calendar text-gray-9"></i>
            </span>
            {/* <input type="text" className="form-control date-range bookingrange" placeholder="dd/mm/yyyy - dd/mm/yyyy"> */}
          </div>
          <div className="ms-2 head-icons">
            <a
              href="javascript:void(0);"
              className=""
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-original-title="Collapse"
              id="collapse-header"
            >
              <i className="ti ti-chevrons-up"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="welcome-wrap mb-4">
        <div className=" d-flex align-items-center justify-content-between flex-wrap">
          <div className="mb-3">
            <h2 className="mb-1 text-white">Welcome Back, Adrian</h2>
            <p className="text-light">14 New Companies Subscribed Today !!!</p>
          </div>
          <div className="d-flex align-items-center flex-wrap mb-1">
            <a
              href="https://smarthr.co.in/demo/html/template/companies.html"
              className="btn btn-dark btn-md me-2 mb-2"
            >
              Companies
            </a>
            <a
              href="https://smarthr.co.in/demo/html/template/packages.html"
              className="btn btn-light btn-md mb-2"
            >
              All Packages
            </a>
          </div>
        </div>
        <div className="welcome-bg">
          <img
            src="https://smarthr.co.in/demo/html/template/assets/img/bg/welcome-bg-02.svg"
            alt="img"
            className="welcome-bg-01"
          />
          <img
            src="https://smarthr.co.in/demo/html/template/assets/img/bg/welcome-bg-03.svg"
            alt="img"
            className="welcome-bg-02"
          />
          <img
            src="https://smarthr.co.in/demo/html/template/assets/img/bg/welcome-bg-01.svg"
            alt="img"
            className="welcome-bg-03"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <span className="avatar avatar-md bg-dark mb-3">
                  <i className="ti ti-building fs-16"></i>
                </span>
                <span className="badge bg-success fw-normal mb-3">+19.01%</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-1">5468</h2>
                  <p className="fs-13">Total Companies</p>
                </div>
                <div className="company-bar1">5,10,7,5,10,7,5</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <span className="avatar avatar-md bg-dark mb-3">
                  <i className="ti ti-carousel-vertical fs-16"></i>
                </span>
                <span className="badge bg-danger fw-normal mb-3">-12%</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-1">4598</h2>
                  <p className="fs-13">Active Companies</p>
                </div>
                <div className="company-bar2">5,3,7,6,3,10,5</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <span className="avatar avatar-md bg-dark mb-3">
                  <i className="ti ti-chalkboard-off fs-16"></i>
                </span>
                <span className="badge bg-success fw-normal mb-3">+6%</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-1">3698</h2>
                  <p className="fs-13">Total Subscribers</p>
                </div>
                <div className="company-bar3">8,10,10,8,8,10,8</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6 d-flex">
          <div className="card flex-fill">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <span className="avatar avatar-md bg-dark mb-3">
                  <i className="ti ti-businessplan fs-16"></i>
                </span>
                <span className="badge bg-danger fw-normal mb-3">-16%</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-1">$89,878,58</h2>
                  <p className="fs-13">Total Earnings</p>
                </div>
                <div className="company-bar4">5,10,7,5,10,7,5</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xxl-3 col-lg-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
              <h5 className="mb-2">Companies</h5>
              <div className="dropdown mb-2">
                <a
                  href="javascript:void(0);"
                  className="btn btn-white border btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-calendar me-1"></i>This Week
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      This Month
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      This Week
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Today
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <div id="company-chart"></div>
              <p className="f-13 d-inline-flex align-items-center">
                <span className="badge badge-success me-1">+6%</span> 5
                Companies from last month
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
              <h5 className="mb-2">Revenue</h5>
              <div className="dropdown mb-2">
                <a
                  href="javascript:void(0);"
                  className="btn btn-white border btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-calendar me-1"></i>2025
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      2024
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      2025
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      2023
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body pb-0">
              <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="mb-1">
                  <h5 className="mb-1">$45787</h5>
                  <p>
                    <span className="text-success fw-bold">+40%</span> increased
                    from last year
                  </p>
                </div>
                <p className="fs-13 text-gray-9 d-flex align-items-center mb-1">
                  <i className="ti ti-circle-filled me-1 fs-6 text-primary"></i>
                  Revenue
                </p>
              </div>
              <div id="revenue-income"></div>
            </div>
          </div>
        </div>

        <div className="col-xxl-3 col-xl-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
              <h5 className="mb-2">Top Plans</h5>
              <div className="dropdown mb-2">
                <a
                  href="javascript:void(0);"
                  className="btn btn-white border btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-calendar me-1"></i>This Month
                </a>
                <ul className="dropdown-menu  dropdown-menu-end p-3">
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      This Month
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      This Week
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item rounded-1"
                    >
                      Today
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <div id="plan-overview"></div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <p className="f-13 mb-0">
                  <i className="ti ti-circle-filled text-primary me-1"></i>
                  Basic{" "}
                </p>
                <p className="f-13 fw-medium text-gray-9">60%</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <p className="f-13 mb-0">
                  <i className="ti ti-circle-filled text-warning me-1"></i>
                  Premium
                </p>
                <p className="f-13 fw-medium text-gray-9">20%</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-0">
                <p className="f-13 mb-0">
                  <i className="ti ti-circle-filled text-info me-1"></i>
                  Enterprise
                </p>
                <p className="f-13 fw-medium text-gray-9">20%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xxl-4 col-xl-12 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
              <h5 className="mb-2">Recent Transactions</h5>
              <a
                href="https://smarthr.co.in/demo/html/template/purchase-transaction.html"
                className="btn btn-light btn-md mb-2"
              >
                View All
              </a>
            </div>
            <div className="card-body pb-2">
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/company/company-02.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Stellar Dynamics</a>
                    </h6>
                    <p className="fs-13 d-inline-flex align-items-center">
                      <span className="text-info">#12457</span>
                      <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                      14 Jan 2025
                    </p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <h6 className="mb-1">+$245</h6>
                  <p className="fs-13">Basic (Monthly)</p>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/company/company-03.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Quantum Nexus</a>
                    </h6>
                    <p className="fs-13 d-inline-flex align-items-center">
                      <span className="text-info">#65974</span>
                      <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                      14 Jan 2025
                    </p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <h6 className="mb-1">+$395</h6>
                  <p className="fs-13">Enterprise (Yearly)</p>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/company/company-05.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Aurora Technologies</a>
                    </h6>
                    <p className="fs-13 d-inline-flex align-items-center">
                      <span className="text-info">#22457</span>
                      <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                      14 Jan 2025
                    </p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <h6 className="mb-1">+$145</h6>
                  <p className="fs-13">Advanced (Monthly)</p>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/company/company-07.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">TerraFusion Energy</a>
                    </h6>
                    <p className="fs-13 d-inline-flex align-items-center">
                      <span className="text-info">#43412</span>
                      <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                      14 Jan 2025
                    </p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <h6 className="mb-1">+$145</h6>
                  <p className="fs-13">Enterprise (Monthly)</p>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-1">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/company/company-08.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Epicurean Delights</a>
                    </h6>
                    <p className="fs-13 d-inline-flex align-items-center">
                      <span className="text-info">#43567</span>
                      <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                      14 Jan 2025
                    </p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <h6 className="mb-1">+$977</h6>
                  <p className="fs-13">Premium (Yearly)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
              <h5 className="mb-2">Recently Registered</h5>
              <a
                href="https://smarthr.co.in/demo/html/template/purchase-transaction.html"
                className="btn btn-light btn-md mb-2"
              >
                View All
              </a>
            </div>
            <div className="card-body pb-2">
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-11.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Pitch</a>
                    </h6>
                    <p className="fs-13">Basic (Monthly)</p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <p className="fs-13 mb-1">150 Users</p>
                  <h6 className="fs-13 fw-normal">pitch.example.com</h6>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-12.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Initech</a>
                    </h6>
                    <p className="fs-13">Enterprise (Yearly)</p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <p className="fs-13 mb-1">200 Users</p>
                  <h6 className="fs-13 fw-normal">initech.example.com</h6>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-13.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Umbrella Corp</a>
                    </h6>
                    <p className="fs-13">Advanced (Monthly)</p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <p className="fs-13 mb-1">129 Users</p>
                  <h6 className="fs-13 fw-normal">umbcorp.example.com</h6>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-14.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Capital Partners</a>
                    </h6>
                    <p className="fs-13">Enterprise (Monthly)</p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <p className="fs-13 mb-1">103 Users</p>
                  <h6 className="fs-13 fw-normal">capitalpart.example.com</h6>
                </div>
              </div>
              <div className="d-sm-flex justify-content-between flex-wrap mb-1">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href="javscript:void(0);"
                    className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                  >
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-15.svg"
                      className="img-fluid w-auto h-auto"
                      alt="img"
                    />
                  </a>
                  <div className="ms-2 flex-fill">
                    <h6 className="fs-medium text-truncate mb-1">
                      <a href="javscript:void(0);">Massive Dynamic</a>
                    </h6>
                    <p className="fs-13">Premium (Yearly)</p>
                  </div>
                </div>
                <div className="text-sm-end mb-2">
                  <p className="fs-13 mb-1">108 Users</p>
                  <h6 className="fs-13 fw-normal">msdynamic.example.com</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xxl-4 col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
              <h5 className="mb-2">Recent Plan Expired</h5>
              <div className="dropdown mb-2">
                <a
                  href="javascript:void(0);"
                  className="dropdown-toggle btn btn-white border btn-sm d-inline-flex align-items-center fs-13"
                  data-bs-toggle="dropdown"
                >
                  Expired
                </a>
                <div className="dropdown-menu dropdown-menu-end p-3">
                  <ul className="nav d-block">
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item d-block rounded-1"
                        data-bs-toggle="tab"
                        data-bs-target="#expired"
                      >
                        Expired
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item d-block rounded-1"
                        data-bs-toggle="tab"
                        data-bs-target="#request"
                      >
                        Request
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body pb-2">
              <div className="tab-content">
                <div className="tab-pane fade show active" id="expired">
                  <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-16.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Silicon Corp</a>
                        </h6>
                        <p className="fs-13">Expired : 10 Apr 2025</p>
                      </div>
                    </div>
                    <div className="text-sm-end mb-2">
                      <a
                        href="javascript:void(0);"
                        className="link-info text-decoration-underline d-block mb-1"
                      >
                        Send Reminder
                      </a>
                      <p className="fs-13">Basic (Monthly)</p>
                    </div>
                  </div>
                  <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-14.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Hubspot</a>
                        </h6>
                        <p className="fs-13">Expired : 12 Jun 2025</p>
                      </div>
                    </div>
                    <div className="text-sm-end mb-2">
                      <a
                        href="javascript:void(0);"
                        className="link-info text-decoration-underline d-block mb-1"
                      >
                        Send Reminder
                      </a>
                      <p className="fs-13">Enterprise (Yearly)</p>
                    </div>
                  </div>
                  <div className="d-sm-flex justify-content-between flex-wrap mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-18.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Licon Industries</a>
                        </h6>
                        <p className="fs-13">Expired : 16 Jun 2025</p>
                      </div>
                    </div>
                    <div className="text-sm-end mb-2">
                      <a
                        href="javascript:void(0);"
                        className="link-info text-decoration-underline d-block mb-1"
                      >
                        Send Reminder
                      </a>
                      <p className="fs-13">Advanced (Monthly)</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between flex-wrap mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/company/company-07.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">TerraFusion Energy</a>
                        </h6>
                        <p className="fs-13">Expired : 12 May 2025</p>
                      </div>
                    </div>
                    <div className="text-sm-end mb-2">
                      <a
                        href="javascript:void(0);"
                        className="link-info text-decoration-underline d-block mb-1"
                      >
                        Send Reminder
                      </a>
                      <p className="fs-13">Enterprise (Monthly)</p>
                    </div>
                  </div>
                  <div className="d-sm-flex justify-content-between flex-wrap mb-1">
                    <div className="d-flex align-items-center mb-2">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/company/company-08.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Epicurean Delights</a>
                        </h6>
                        <p className="fs-13">Expired : 15 May 2025</p>
                      </div>
                    </div>
                    <div className="text-sm-end mb-2">
                      <a
                        href="javascript:void(0);"
                        className="link-info text-decoration-underline d-block mb-1"
                      >
                        Send Reminder
                      </a>
                      <p className="fs-13">Premium (Yearly)</p>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="request">
                  <div className="d-flex justify-content-between mb-4">
                    <div className="d-flex align-items-center overflow-hidden">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-16.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill overflow-hidden">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Silicon Corp</a>
                        </h6>
                        <p className="fs-13 text-info text-truncate">
                          silicon.example.com
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="link-success text-decoration-underline fs-13 fw-medium me-3"
                      >
                        Approve
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="link-danger text-decoration-underline fs-13 fw-medium"
                      >
                        Reject
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <div className="d-flex align-items-center overflow-hidden">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-14.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill overflow-hidden">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Hubspot</a>
                        </h6>
                        <p className="fs-13 text-info text-truncate">
                          hubspot.example.com
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="link-success text-decoration-underline fs-13 fw-medium me-3"
                      >
                        Approve
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="link-danger text-decoration-underline fs-13 fw-medium"
                      >
                        Reject
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <div className="d-flex align-items-center overflow-hidden">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/icons/company-icon-18.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill overflow-hidden">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Licon Industries</a>
                        </h6>
                        <p className="fs-13 text-info text-truncate">
                          licon.example.com
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="link-success text-decoration-underline fs-13 fw-medium me-3"
                      >
                        Approve
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="link-danger text-decoration-underline fs-13 fw-medium"
                      >
                        Reject
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <div className="d-flex align-items-center overflow-hidden">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/company/company-07.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill overflow-hidden">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">TerraFusion Energy</a>
                        </h6>
                        <p className="fs-13 text-info text-truncate">
                          fusion.example.com
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="link-success text-decoration-underline fs-13 fw-medium me-3"
                      >
                        Approve
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="link-danger text-decoration-underline fs-13 fw-medium"
                      >
                        Reject
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mb-0">
                    <div className="d-flex align-items-center overflow-hidden">
                      <a
                        href="javscript:void(0);"
                        className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
                      >
                        <img
                          src="https://smarthr.co.in/demo/html/template/assets/img/company/company-08.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                      </a>
                      <div className="ms-2 flex-fill overflow-hidden">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">Epicurean Delights</a>
                        </h6>
                        <p className="fs-13 text-info text-truncate">
                          epicuran.example.com
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <a
                        href="javascript:void(0);"
                        className="link-success text-decoration-underline fs-13 fw-medium me-3"
                      >
                        Approve
                      </a>
                      <a
                        href="javascript:void(0);"
                        className="link-danger text-decoration-underline fs-13 fw-medium"
                      >
                        Reject
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PageMeta
        title="Duggal Overseas"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js  CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
