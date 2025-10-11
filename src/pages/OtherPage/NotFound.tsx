import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Duggal Overseas"
        description="This is React.js 404 Dashboard page for TailAdmin - React.js CSS Admin Dashboard Template"
      />
      <div className="bg-linear-gradiant">
        <div className="main-wrapper">
          <div className="container">
            <div className="vh-100 d-flex align-items-center">
              <div className="row justify-content-center align-items-center w-100">
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                  <div>
                    <div className="mb-5 text-center">
                      <img
                        className="img-fluid"
                        alt="SmartHR logo"
                        src="/images/logo-sidebar.png"
                      />
                    </div>
                    <div className="text-center">
                      <h1 className="mb-3">😅 Oops, something went wrong</h1>
                      <p className="fs-16">
                        Error 404 Page not found. Sorry, the page you are
                        looking for doesn’t exist or has been moved.
                      </p>
                      <div className="d-flex justify-content-center">
                        <Link
                          to="/dashboard"
                          className="btn btn-primary d-flex align-items-center"
                        >
                          😊 Back to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7 d-flex justify-content-end align-items-center">
                  <div className="error-images">
                    <img
                      className="img-fluid"
                      alt="404 error illustration"
                      src="/images/error-404.svg"
                    />
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
