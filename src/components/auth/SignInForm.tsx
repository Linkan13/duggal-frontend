import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest, TLogin } from "@/client/endpoints/auth";
import { getAlertMessage, setAlertMessage } from "@/utils/alertService";
import { Mail, Eye, EyeOff } from "tabler-icons-react";
import { toast } from "react-toastify";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [form, setForm] = useState<TLogin>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessageLocal] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  useEffect(() => {
    const msg = getAlertMessage();
    if (msg) {
      setAlertMessageLocal(msg);
      setAlertType("success");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessageLocal(null);
    setLoading(true);

    try {
      const response = await loginRequest(form);

      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
      }

      let userName = "User";
      if (response.data.user) {
        userName = response.data.user.firstName || response.data.user.username;
        localStorage.setItem("userName", userName);
      }

      // ✅ Show toast
      toast.success(`Welcome, ${userName}!`);

      setAlertMessage("Login successful!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;

      setAlertMessageLocal(errorMsg || "Login failed");
      setAlertType("error");

      toast.error(errorMsg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vh-100">
      <div className="vh-100 d-flex flex-column justify-content-between p-4 pb-0">
        <div className="mx-auto mb-5 text-center">
          <img
            src="/images/logo-sidebar.png"
            alt="Logo"
            className="img-fluid mx-auto d-block"
          />
        </div>

        <div>
          <div className="text-center mb-3">
            <h2 className="mb-2">Sign In</h2>
            <p className="mb-0">Please enter your details to sign in</p>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control border-end-0"
                placeholder="info@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
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
                className="pass-input form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          {/* Remember me + Forgot password */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                id="remember_me"
              />
              <label htmlFor="remember_me" className="form-check-label">
                Remember Me
              </label>
            </div>
            <Link to="/reset-password" className="link-danger">
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <div className="mb-3">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          {/* Create account */}
          <div className="text-center">
            <h6 className="fw-normal text-dark mb-0">
              Don’t have an account?
              <Link to="/signup" className="hover-a">
                &nbsp;Create Account
              </Link>
            </h6>
          </div>
        </div>

        <div className="mt-5 pb-4 text-center">
          <p className="mb-0 text-gray-9">&copy; Duggal Overseas</p>
        </div>
      </div>
    </form>
  );
}
