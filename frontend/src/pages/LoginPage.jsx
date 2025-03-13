import React, { useState,useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Loader, UserPlus } from 'lucide-react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export function LoginPage() {
  const { login } = useContext(ShopContext); 
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const responseGoogle = async (response) => {
    try {
      if (response.error) {
        toast.error('Google Sign-In failed');
        return;
      }

      // send response.code to backend and receive token
      toast.success('Google Sign-In successful');
    } catch (error) {
      toast.error('An error occurred during Google Sign-In');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (response) => {
      setGoogleLoading(true);
      responseGoogle(response);
    },
    onError: (response) => {
      setGoogleLoading(false);
      responseGoogle(response);
    },
    flow: 'auth-code',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = loginSchema.parse({ email, password });
      setErrors({});
      setLoading(true);

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: data.email,
        password: data.password,
      });
      console.log(response);
      login(response.data.user,response.data.accessToken); // 🔥 update context
      toast.success(response.data.message || 'Login successful!');
      window.location.href = from;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">Or</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="group relative w-full flex items-center justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        >
          <img
            src="/assets/image8-2.webp"
            alt="Google logo"
            className="h-5 w-5 mr-2"
          />
          {googleLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
