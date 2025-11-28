import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { User, Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const BASE_URL = 'http://localhost:8000'; 

const Profile = () => {
  const [profile, setProfile] = useState({ email: '', full_name: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const { setCrumbs } = useBreadcrumb();

  useEffect(() => {
    setCrumbs(['My Profile']); 
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data);
        setName(res.data.full_name || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', { full_name: name });
      alert("Nama berhasil diperbarui!");
      window.location.reload();
    } catch (error) {
      alert("Gagal update nama");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, avatar: res.data.avatar }));
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Gagal upload foto");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <MainLayout><div className="p-10">Loading...</div></MainLayout>;

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-gray-600 hover:text-penabur-blue hover:border-penabur-blue transition-all shadow-sm text-sm font-medium mb-3"
            >
              <ArrowLeft size={16} className="mr-2"/> Kembali ke Dashboard
            </Link>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-50 shadow-inner bg-gray-100">
              {profile.avatar ? (
                <img 
                  src={`${BASE_URL}${profile.avatar}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 bg-penabur-blue text-white p-2 rounded-full cursor-pointer hover:bg-penabur-dark transition-colors shadow-lg">
              {uploading ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16} />}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-xl font-bold text-gray-800">{profile.full_name || 'Belum ada nama'}</h3>
            <p className="text-gray-500 text-sm">{profile.email} • Administrator</p>
          </div>

          <hr className="w-full my-6 border-gray-100"/>

          <form onSubmit={handleUpdateName} className="w-full">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tampilan</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-penabur-blue"
                placeholder="Masukkan Nama Lengkap Anda"
              />
            </div>
            <button className="w-full bg-penabur-blue text-white py-2 rounded-lg font-bold hover:bg-penabur-dark flex justify-center items-center">
              <Save size={18} className="mr-2" /> Simpan Perubahan
            </button>
          </form>

        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;