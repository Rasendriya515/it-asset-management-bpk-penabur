import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MainLayout from '../../components/layout/MainLayout';

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="font-medium text-gray-800 text-sm text-right">{value || '-'}</span>
  </div>
);

const ScanResult = () => {
  const { barcode } = useParams();
  const navigate = useNavigate();
  
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const safeBarcode = decodeURIComponent(barcode);
        console.log("Fetching asset for barcode:", safeBarcode);

        const response = await api.get(`/assets/barcode/${safeBarcode}`);
        setAsset(response.data);
        setError(null);
      } catch (err) {
        console.error("Error detail:", err);

        if (err.response) {
            if (err.response.status === 404) {
                setError(`Aset dengan barcode "${barcode}" tidak ditemukan.`);
            } else if (err.response.status === 401) {
                setError("Sesi kadaluarsa. Silakan login ulang.");
            } else {
                setError(`Terjadi kesalahan server (${err.response.status}).`);
            }
        } else {
            setError("Gagal terhubung ke server. Cek koneksi internet/wifi.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (barcode) {
      fetchAsset();
    } else {
        setError("Barcode tidak valid.");
        setLoading(false);
    }
  }, [barcode]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Mencari data aset...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-red-700 mb-2">Gagal Memuat Aset</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={() => navigate('/user/scan')}
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                    >
                        Scan Ulang
                    </button>
                    <button 
                        onClick={() => navigate('/user/dashboard')}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Ke Dashboard
                    </button>
                </div>
            </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 pb-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-bold text-gray-800">
                    {asset.brand} {asset.model_series}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    asset.status === 'Berfungsi' ? 'bg-green-100 text-green-700' : 
                    asset.status === 'Rusak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {asset.status}
                </span>
            </div>
            <p className="text-gray-500 text-sm">{asset.category_name || asset.category_code}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Informasi Aset</h3>
            
            <DetailRow label="Barcode" value={asset.barcode} />
            <DetailRow label="Serial Number" value={asset.serial_number} />
            <DetailRow label="Lokasi" value={asset.room} />
            <DetailRow label="Penempatan" value={asset.placement} />
            <DetailRow label="Processor" value={asset.processor} />
            <DetailRow label="RAM / Storage" value={`${asset.ram || '-'} / ${asset.storage || '-'}`} />
            <DetailRow label="Pengguna" value={asset.assigned_to} />
        </div>
        <div className="mt-6 text-center">
             <button 
                onClick={() => navigate('/user/scan')}
                className="text-blue-600 font-medium hover:underline"
            >
                ← Scan Aset Lain
            </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ScanResult;