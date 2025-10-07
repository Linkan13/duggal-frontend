import { useEffect } from "react";
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
          <h2 className="mb-1">Payment Report</h2>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="https://smarthr.co.in/demo/html/template/index.html">
                  <i className="ti ti-smart-home"></i>
                </a>
              </li>
              <li className="breadcrumb-item">HR</li>
              <li className="breadcrumb-item active" aria-current="page">
                Payment Report
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
          <div className="mb-2">
            <div className="dropdown">
              <a
                href="javascript:void(0);"
                className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i className="ti ti-file-export me-1"></i>Export
              </a>
              <ul className="dropdown-menu  dropdown-menu-end p-3">
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item rounded-1"
                  >
                    <i className="ti ti-file-type-pdf me-1"></i>Export as PDF
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item rounded-1"
                  >
                    <i className="ti ti-file-type-xls me-1"></i>Export as Excel{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="head-icons ms-2">
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
      <div className="row">
        <div className="col-xl-6 d-flex">
          <div className="row flex-fill">
            <div className="col-lg-6 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body ">
                  <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-2">
                    <div className="d-flex align-items-center flex-column overflow-hidden">
                      <div>
                        <div>
                          <span className="fs-14 fw-normal text-truncate mb-1">
                            Total Payments
                          </span>
                          <h5>$45,221,45</h5>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <a
                        href="#"
                        className="avatar avatar-md br-5 payment-report-icon  bg-transparent-primary border border-primary"
                      >
                        <span className="text-primary">
                          <i className="ti ti-currency-dollar"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className="fs-12 fw-normal d-flex align-items-center text-truncate">
                      <span className="text-success fs-12 d-flex align-items-center me-1">
                        <i className="ti ti-arrow-wave-right-up me-1"></i>
                        +20.01%
                      </span>
                      from last week
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body ">
                  <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-2">
                    <div className="d-flex align-items-center flex-column overflow-hidden">
                      <div>
                        <div>
                          <span className="fs-14 fw-normal text-truncate mb-1">
                            Pending Payments
                          </span>
                          <h5>$45,221,45</h5>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <a
                        href="#"
                        className="avatar avatar-md br-5 payment-report-icon  bg-transparent-skyblue border border-skyblue"
                      >
                        <span className="text-skyblue">
                          <i className="ti ti-currency-dollar"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className="fs-12 fw-normal d-flex align-items-center text-truncate">
                      <span className="text-success fs-12 d-flex align-items-center me-1">
                        <i className="ti ti-arrow-wave-right-up me-1"></i>
                        +20.01%
                      </span>{" "}
                      from last week
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body ">
                  <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-2">
                    <div className="d-flex align-items-center flex-column overflow-hidden">
                      <div>
                        <div>
                          <span className="fs-14 fw-normal text-truncate mb-1">
                            Failed Payments
                          </span>
                          <h5>$10,470</h5>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <a
                        href="#"
                        className="avatar avatar-md br-5 payment-report-icon  bg-transparent-danger border border-danger"
                      >
                        <span className="text-danger">
                          <i className="ti ti-currency-dollar"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className="fs-12 fw-normal d-flex align-items-center text-truncate">
                      <span className="text-danger fs-12 d-flex align-items-center me-1">
                        <i className="ti ti-arrow-wave-right-up me-1"></i>
                        +20.01%
                      </span>{" "}
                      from last week
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body ">
                  <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-2">
                    <div className="d-flex align-items-center flex-column overflow-hidden">
                      <div>
                        <div>
                          <span className="fs-14 fw-normal text-truncate mb-1">
                            Payment Success Rate
                          </span>
                          <h5>90%</h5>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <a
                        href="#"
                        className="avatar avatar-md br-5 payment-report-icon  bg-pink-transparent border border-pink"
                      >
                        <span className="text-pink">
                          <i className="ti ti-currency-dollar"></i>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-2">
                    <p className="fs-12 fw-normal d-flex align-items-center text-truncate">
                      <span className="text-success fs-12 d-flex align-items-center me-1">
                        <i className="ti ti-arrow-wave-right-up me-1"></i>
                        +20.01%
                      </span>{" "}
                      from last week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header border-0">
              <div className="d-flex flex-wrap row-gap-2 justify-content-between align-items-center">
                <div className="d-flex align-items-center ">
                  <span className="me-2">
                    <i className="ti ti-chart-donut text-danger"></i>
                  </span>
                  <h5>Payments By Payment Methods </h5>
                </div>
                <div className="dropdown">
                  <a
                    href="javascript:void(0);"
                    className="dropdown-toggle btn btn-sm fs-12 btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    This Year
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-2">
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
                        2023
                      </a>
                    </li>
                    <li>
                      <a
                        href="javascript:void(0);"
                        className="dropdown-item rounded-1"
                      >
                        2022
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body d-flex align-items-center justify-content-between pt-0">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="position-relative payment-total">
                    <div className="payment-total-content ">
                      <span className="display-3 fs-24 fw-bold text-skyblue">
                        +14%
                      </span>
                      <p className="fs-16 fw-normal">vs last year</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row gy-4">
                    <div className="col-md-6">
                      <h6 className="fs-16 text-gray-5 fw-normal side-badge mb-1">
                        Paypal
                      </h6>
                      <h5 className="fs-20 fw-bold">$54,071 </h5>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fs-16 text-gray-5 fw-normal side-badge-pink mb-1">
                        {" "}
                        Debit Card
                      </h6>
                      <h5 className="fs-20 fw-bold">$54,071 </h5>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fs-16 text-gray-5 fw-normal side-badge-purple mb-1">
                        {" "}
                        Bank Transfer
                      </h6>
                      <h5 className="fs-20 fw-bold">$32,210 </h5>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fs-16 text-gray-5 fw-normal side-badge-warning mb-1">
                        {" "}
                        Credit Card
                      </h6>
                      <h5 className="fs-20 fw-bold">$32,210 </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
