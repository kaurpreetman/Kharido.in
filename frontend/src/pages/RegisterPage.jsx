import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { z } from 'zod';
import { useGoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '../context/userSlice';

const registerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = registerSchema.parse(formData);
      setLoading(true);
      setErrors({});

      const res = await axios.post(
        'http://localhost:5000/api/auth/signup',
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      dispatch(setUser(res.data.user));
      toast.success(res.data.message || 'Registered successfully!');
      navigate('/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors = err.errors.reduce((acc, cur) => ({ ...acc, [cur.path[0]]: cur.message }), {});
        setErrors(formErrors);
      } else {
        toast.error(err.response?.data?.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;

        const res = await axios.post(
          'http://localhost:5000/api/auth/google-signup',
          { token: accessToken },
          { withCredentials: true }
        );

        dispatch(setUser(res.data.user));
        toast.success('Logged in with Google!');
        navigate('/');
      } catch (err) {
        console.error('Google login error:', err);
        toast.error(err.response?.data?.message || 'Google login failed');
      }
    },
    onError: () => toast.error('Google Sign-In failed'),
    flow: 'implicit',
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create your account</h2>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {['name', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                name={field}
                placeholder={
                  field === 'confirmPassword'
                    ? 'Confirm Password'
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors[field] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 border-t border-gray-300" />
          <div className="relative text-center">
            <span className="bg-gray-50 px-2 text-gray-500 text-sm">Or</span>
          </div>
        </div>

        <button
          onClick={() => googleLogin()}
          className="w-full py-2 flex items-center justify-center gap-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}
