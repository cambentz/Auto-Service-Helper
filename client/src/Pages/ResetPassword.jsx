import { useState } from 'react';
import api from '../utils/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { isStrongPassword, getPasswordStrength, strengthColors, strengthLabels } from '../utils/password';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });
      setMessage(res.data.message || 'Password reset successfully.');
      setPassword('');
      setConfirm('');
      setTimeout(() => navigate('/auth', { state: { mode: 'login' } }), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#1A3D61] mb-6">Reset Your Password</h2>

        {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <InputField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <InputField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              name="confirm"
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password strength bar */}
          {password && (
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className={`h-full rounded transition-all ${strengthColors[strength - 1]}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              ></div>
              <p className="text-xs mt-1 text-gray-600">
                {strengthLabels[strength - 1]}
              </p>
            </div>
          )}

          {/* Password guidance */}
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• At least 8 characters</li>
            <li>• Includes a number</li>
            <li>• Includes a special character (!@#$%)</li>
          </ul>

          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
