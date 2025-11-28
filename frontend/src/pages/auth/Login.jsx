import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email); 
      formData.append('password', password);

      const response = await api.post('/auth/login', formData);
      
      const { access_token, role } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);

      alert(`Login Berhasil! Selamat datang, ${role}`);
      navigate('/dashboard');
      
    } catch (err) {
      console.error(err);
      setError('Email atau Password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-penabur-light px-4">
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-penabur-blue">
        
        <div className="bg-penabur-blue p-8 text-center">
          <div className="mx-auto bg-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck className="text-penabur-blue w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">IT Asset Management</h2>
          <p className="text-penabur-gold text-sm mt-1 font-medium">BPK PENABUR</p>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Sign In</h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-penabur-blue focus:border-transparent outline-none transition"
                placeholder="admin@bpkpenabur.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-penabur-blue focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-penabur-blue text-white py-2.5 rounded-lg font-semibold hover:bg-penabur-dark transition duration-300 shadow-md flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-400">
            &copy; 2025 IT Division BPK PENABUR
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;