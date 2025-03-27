import { useState, useEffect } from "react";
import api from "../utils/api";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { useLocation } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { isStrongPassword, getPasswordStrength, strengthColors, strengthLabels } from "../utils/password";

const Auth = () => {
  const location = useLocation();
  const [mode, setMode] = useState(() => location.state?.mode || "login");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Toggle between login and register modes
  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setFormData({ email: "", password: "" });
    setConfirmPassword("");
    setName("");
  };

  // Switch to password reset mode
  const switchToReset = () => {
    setMode("reset");
    setError(null);
    setFormData({ email: "", password: "" });
    setConfirmPassword("");
    setName("");
  };

  // Sync state with route location
  useEffect(() => {
    if (location.state?.mode && mode !== location.state.mode) {
      setMode(location.state.mode);
    }
  }, [location]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    else if (name === "confirmPassword") setConfirmPassword(value);
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords if registering
    if (mode === "register") {
      if (formData.password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      if (!isStrongPassword(formData.password)) {
        setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        setLoading(false);
        return;
      }
    }

    // Choose endpoint based on mode
    const endpoint =
    mode === "login"
      ? "/api/auth/login"
      : mode === "register"
        ? "/api/auth/register"
        : "/api/auth/forgot-password";

  const payload =
    mode === "login"
      ? { email: formData.email, password: formData.password }
      : mode === "register"
        ? { ...formData, name, confirmPassword }
        : { email: formData.email };

  try {
    const res = await api.post(endpoint, payload);
    console.log("Auth Success:", res.data);
    if (mode === "reset") {
      setMode("login");
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        {/* Heading */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {mode === "login"
            ? "Login to GestureGarage"
            : mode === "register"
              ? "Create a New Account"
              : "Reset Your Password"}
        </h2>

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {/* Name input for registration */}
          {mode === "register" && (
            <InputField
              label="Name"
              id="name"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={handleChange}
              required
            />
          )}


          {/* Email input */}
          <InputField
            className="placeholder-gray-500"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password input with toggle */}
          {mode !== "reset" && (
            <div className="relative">
              <InputField
                className="placeholder-gray-500 pr-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {/* Password strength & confirmation for registration */}
          {mode === "register" && (
            <>
              {/* Password strength bar */}
              <div className="mb-3">
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className={`h-full rounded ${strengthColors[passwordStrength - 1] || ""}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  {formData.password && strengthLabels[passwordStrength - 1]}
                </p>
                <ul className="text-[11px] text-gray-500 mt-1">
                  <li>• At least 8 characters</li>
                  <li>• Includes a number</li>
                  <li>• Includes a special character (!@#$%)</li>
                </ul>
              </div>

              {/* Confirm password field */}
              <div className="relative">
                <InputField
                  className="pr-10"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </>
          )}

          {/* Forgot password link */}
          {mode === "login" && (
            <button
            type="button"
            onClick={switchToReset}
            className="text-blue-500 hover:underline text-sm inline-block mt-2"
          >
            Forgot Password?
          </button>
        )}

          {/* Error message */}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          {/* Submit button or loading spinner */}
          <div className="mt-6">
            {loading ? (
              <Loader message="Processing..." />
            ) : (
              <Button type="submit" className="w-full">
                {mode === "login"
                  ? "Login"
                  : mode === "register"
                    ? "Register"
                    : "Send Reset Link"}
              </Button>
            )}
          </div>
        </form>

        {/* Mode toggle link */}
        {mode !== "reset" && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 text-blue-600 hover:underline"
              >
                {mode === "login" ? "Register here" : "Login here"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;