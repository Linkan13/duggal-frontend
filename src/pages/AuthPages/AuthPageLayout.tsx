import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-fuild">
      <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100">
        <div className="row">
          {/* Left illustration section */}
          <div className="col-lg-5">
            <div className="login-background position-relative d-lg-flex align-items-center justify-content-center d-none flex-wrap vh-100">
              <div className="bg-overlay-img">
                <img
                  src="https://smarthr.co.in/demo/html/template/assets/img/bg/bg-01.png"
                  className="bg-1"
                  alt="Img"
                />
                <img
                  src="https://smarthr.co.in/demo/html/template/assets/img/bg/bg-02.png"
                  className="bg-2"
                  alt="Img"
                />
                <img
                  src="https://smarthr.co.in/demo/html/template/assets/img/bg/bg-03.png"
                  className="bg-3"
                  alt="Img"
                />
              </div>
              <div className="authentication-card w-100">
                <div className="authen-overlay-item border w-100">
                  <h1 className="text-white display-1">
                    Empowering people <br /> through seamless HR <br />{" "}
                    management.
                  </h1>
                  <div className="my-4 mx-auto authen-overlay-img">
                    <img
                      src="https://smarthr.co.in/demo/html/template/assets/img/bg/authentication-bg-01.png"
                      alt="Img"
                    />
                  </div>
                  <p className="text-white fs-20 fw-semibold text-center">
                    Efficiently manage your workforce, streamline <br />{" "}
                    operations effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form section */}
          <div className="col-lg-7 col-md-12 col-sm-12">
            <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap">
              <div className="col-md-7 mx-auto vh-100"> {children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
