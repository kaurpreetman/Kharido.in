import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Loader, UserPlus, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../context/userSlice';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const accessToken = tokenResponse.access_token;

        const res = await axios.post(
          'http://localhost:5000/api/auth/google-signup',
          { token: accessToken },
          { withCredentials: true }
        );

        dispatch(setUser(res.data.user));
        toast.success('Logged in with Google!');
        navigate(from);
      } catch (err) {
        console.error('Google login error:', err);
        toast.error(err.response?.data?.message || 'Google login failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error('Google Sign-In failed'),
    flow: 'implicit',
    redirect_uri: 'http://localhost:5713',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = loginSchema.parse({ email, password });
      setErrors({});
      setLoading(true);

      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        data,
        { withCredentials: true }
      );

      dispatch(setUser(response.data.user));
      toast.success(response.data.message || 'Login successful!');
      navigate(from);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(formErrors);
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-md w-full space-y-8">
        <div className="card p-8 backdrop-blur-xl bg-white/80 dark:bg-dark-800/80">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-bounce-subtle" />
              <h2 className="text-3xl font-display font-bold gradient-text">Welcome Back</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue shopping
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="space-y-2">
            
              <div className="relative">
              
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className={`input-field pl-12 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
             
              <div className="relative">
               
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            {/* <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium">
                Forgot password?
              </a>
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center gap-2 py-4"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5" />
                  Signing in...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-dark-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={() => googleLogin()}
            disabled={googleLoading}
            className="w-full mt-6 py-4 flex items-center justify-center gap-3 border-2 border-gray-300 dark:border-dark-600 rounded-xl shadow-lg hover:shadow-xl bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {googleLoading ? 'Signing in with Google...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}