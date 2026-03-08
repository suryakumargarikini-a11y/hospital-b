import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginSchema } from '../utils/validationSchemas';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Login to MediBook
        </h2>

        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await loginWithGoogle(credentialResponse.credential);
                toast.success('Google Login successful!');
                navigate('/dashboard');
              } catch (err) {
                toast.error(err.response?.data?.message || err.message || 'Google Auth Failed');
              }
            }}
            onError={() => {
              toast.error('Google Login Failed');
            }}
          />
        </div>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 bg-white">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
                }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
                }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;