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
						<h2 className="mb-1">Attendance Admin</h2>
						<nav>
							<ol className="breadcrumb mb-0">
								<li className="breadcrumb-item">
									<a href="https://smarthr.co.in/demo/html/template/index.html"><i className="ti ti-smart-home"></i></a>
								</li>
								<li className="breadcrumb-item">
									Employee
								</li>
								<li className="breadcrumb-item active" aria-current="page">Attendance Admin</li>
							</ol>
						</nav>
					</div>
					<div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
						<div className="me-2 mb-2">
							<div className="d-flex align-items-center border bg-white rounded p-1 me-2 icon-list">
								<a href="https://smarthr.co.in/demo/html/template/attendance-employee.html" className="btn btn-icon btn-sm  me-1"><i className="ti ti-brand-days-counter"></i></a>
								<a href="https://smarthr.co.in/demo/html/template/attendance-admin.html" className="btn btn-icon btn-sm active bg-primary text-white"><i className="ti ti-calendar-event"></i></a>
							</div>
						</div>
						<div className="me-2 mb-2">
							<div className="dropdown">
								<a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
									<i className="ti ti-file-export me-1"></i>Export
								</a>
								<ul className="dropdown-menu  dropdown-menu-end p-3">
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1"><i className="ti ti-file-type-pdf me-1"></i>Export as PDF</a>
									</li>
									<li>
										<a href="javascript:void(0);" className="dropdown-item rounded-1"><i className="ti ti-file-type-xls me-1"></i>Export as Excel </a>
									</li>
								</ul>
							</div>
						</div>
						<div className="mb-2">
							<a href="#" className="btn btn-primary d-flex align-items-center" data-bs-target="#attendance_report" data-bs-toggle="modal"><i className="ti ti-file-analytics me-2"></i>Report</a>
						</div>
						<div className="ms-2 head-icons">
							<a href="javascript:void(0);" className="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
								<i className="ti ti-chevrons-up"></i>
							</a>
						</div>
					</div>
				</div>
        <div className="card border-0">
					<div className="card-body">
						<div className="row align-items-center mb-4">
							<div className="col-md-5">
								<div className="mb-3 mb-md-0">
									<h4 className="mb-1">Attendance Details Today</h4>
									<p>Data from the 800+ total no of employees</p>
								</div>
							</div>
							<div className="col-md-7">
								<div className="d-flex align-items-center justify-content-md-end">
									<h6>Total Absenties today</h6>
									<div className="avatar-list-stacked avatar-group-sm ms-4">
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="https://smarthr.co.in/demo/html/template/assets/img/profiles/avatar-02.jpg" alt="img"/>
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="https://smarthr.co.in/demo/html/template/assets/img/profiles/avatar-03.jpg" alt="img"/>
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="https://smarthr.co.in/demo/html/template/assets/img/profiles/avatar-05.jpg" alt="img"/>
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="https://smarthr.co.in/demo/html/template/assets/img/profiles/avatar-06.jpg" alt="img"/>
										</span>
										<span className="avatar avatar-rounded">
											<img className="border border-white" src="https://smarthr.co.in/demo/html/template/assets/img/profiles/avatar-07.jpg" alt="img"/>
										</span>
										<a className="avatar bg-primary avatar-rounded text-fixed-white fs-12" href="javascript:void(0);">
											+1
										</a>
									</div>
								</div>
							</div>
						</div>
						<div className="border rounded">
							<div className="row gx-0">
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Present</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>250</h5>
											<span className="badge badge-success d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												+1%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Late Login</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>45</h5>
											<span className="badge badge-danger d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												-1%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Uninformed</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>15</h5>
											<span className="badge badge-danger d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												-12%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4 border-end">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Permisson</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>03</h5>
											<span className="badge badge-success d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												+1%
											</span>
										</div>
									</div>
								</div>
								<div className="col-md col-sm-4">
									<div className="p-3">
										<span className="fw-medium mb-1 d-block">Absent</span>
										<div className="d-flex align-items-center justify-content-between">
											<h5>12</h5>
											<span className="badge badge-danger d-inline-flex align-items-center">
												<i className="ti ti-arrow-wave-right-down me-1"></i>
												-19%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div></>
  );
}
