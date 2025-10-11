import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest, TRegister } from "@/client/endpoints/auth";
import { showMessage, MESSAGE_TYPE } from "@/utils/notify";
import { Mail, Eye, EyeOff, User, Lock } from "tabler-icons-react";

export default function SignUpFormAdmin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Empty form — no prefilled values
  const [form, setForm] = useState<Partial<TRegister>>({});
  const [adminKey, setAdminKey] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage(null);

    if (
      !form.firstName ||
      !form.lastName ||
      !form.username ||
      !form.email ||
      !form.password
    ) {
      setAlertMessage("All fields are required");
      setAlertType("error");
      return;
    }

    // ✅ Password match
    if (form.password !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setAlertType("error");
      return;
    }

    // ✅ Local admin key validation only
    const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "Duggal@2025";
    if (adminKey !== ADMIN_SECRET) {
      setAlertMessage("Invalid Admin Access Key");
      setAlertType("error");
      return;
    }

    setLoading(true);
    try {
      // ✅ Send only clean payload
      await registerRequest(form as TRegister);
      showMessage("Admin created successfully!", MESSAGE_TYPE.SUCCESS);
      setAlertMessage("Admin created successfully! Redirecting...");
      setAlertType("success");

      setTimeout(() => navigate("/signin"), 1500);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Registration failed";
      setAlertMessage(errorMsg ?? "Registration failed");
      setAlertType("error");
      showMessage(errorMsg ?? "Registration failed", MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vh-100">
      <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
        {/* Logo */}
        <div className="mx-auto mb-5 text-center">
          <img
            src="/images/logo-sidebar.png"
            alt="Logo"
            className="img-fluid mx-auto d-block"
          />
        </div>

        <div>
          {/* Title */}
          <div className="text-center mb-3">
            <h2 className="mb-2">Admin Registration</h2>
            <p className="mb-0">Enter details to create admin account</p>
          </div>

          {/* First & Last Name */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={form.firstName ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value.trim() })
                  }
                  required
                  className="form-control"
                />
                <span className="input-group-text border-start-0">
                  <User size={20} />
                </span>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value.trim() })
                  }
                  required
                  className="form-control"
                />
                <span className="input-group-text border-start-0">
                  <User size={20} />
                </span>
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={form.username ?? ""}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value.trim() })
                }
                required
                className="form-control"
              />
              <span className="input-group-text border-start-0">
                <User size={20} />
              </span>
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <input
                type="email"
                placeholder="info@gmail.com"
                value={form.email ?? ""}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value.trim() })
                }
                required
                className="form-control"
              />
              <span className="input-group-text border-start-0">
                <Mail size={20} />
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="pass-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password ?? ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="pass-input form-control"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password cursor-pointer"
              >
                <span className="input-group-text">
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </span>
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="pass-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pass-input form-control"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password cursor-pointer"
              >
                <span className="input-group-text">
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </span>
              </span>
            </div>
          </div>

          {/* Admin Access Key (local only) */}
          <div className="mb-3">
            <label className="form-label">Admin Access Key</label>
            <div className="input-group">
              <input
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
                className="form-control"
              />
              <span className="input-group-text border-start-0">
                <Lock size={20} />
              </span>
            </div>
          </div>

          {/* Alerts */}
          {alertMessage && (
            <div
              className={`alert ${
                alertType === "success"
                  ? "alert-success text-center"
                  : "alert-danger text-center"
              }`}
              role="alert"
            >
              {alertMessage}
            </div>
          )}

          {/* Submit */}
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Creating Admin..." : "Create Admin Account"}
            </button>
          </div>

          {/* Already have account */}
          <div className="text-center">
            <h6 className="fw-normal text-dark mb-0">
              Already have an account?
              <Link to="/signin" className="hover-a">
                &nbsp;Sign In
              </Link>
            </h6>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pb-4 text-center">
          <p className="mb-0 text-gray-9">&copy; Duggal Overseas</p>
        </div>
      </div>
    </form>
  );
}
