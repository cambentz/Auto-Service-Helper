import { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setFormData({ email: "", password: "", confirmPassword: "", name: "" });
  };

  const switchToReset = () => {
    setMode("reset");
    setError(null);
    setFormData({ email: "", password: "", confirmPassword: "", name: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStrongPassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongRegex.test(password);
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
    return score;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
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

    const endpoint =
      mode === "login"
        ? "/api/auth/login"
        : mode === "register"
        ? "/api/auth/register"
        : "/api/auth/forgot-password";

    try {
      const res = await axios.post(endpoint, formData, { withCredentials: true });
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
  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-green-600"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {mode === "login"
            ? "Login to GestureGarage"
            : mode === "register"
            ? "Create a New Account"
            : "Reset Your Password"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <InputField
              label="Name"
              id="name"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

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

          {mode !== "reset" && (
            <div className="relative">
              <InputField
                className="placeholder-gray-500 pr-10"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

          {mode === "register" && (
            <>
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
                <p className="text-[11px] text-gray-500 mt-1">
                  Password must be at least 8 characters long and include at least one uppercase letter,
                  one lowercase letter, one number, and one special character.
                </p>
              </div>

              <div className="relative">
                <InputField
                  className="pr-10"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
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

          {mode === "login" && (
            <button
              type="button"
              onClick={switchToReset}
              className="text-blue-500 hover:underline text-sm inline-block mt-2"
            >
              Forgot Password?
            </button>
          )}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

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