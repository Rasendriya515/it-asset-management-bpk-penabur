import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import bpkLogo from "../../assets/images/logo-bpk.png";

const ScanResult = () => {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await api.get(`/assets/${id}`);
        setAsset(response.data);
      } catch (err) {
        console.error(err);
        setError("Aset tidak ditemukan atau terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };
    fetchAsset();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-lg">Memuat Data Realtime...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;
  const assetName = asset.brand ? `${asset.brand} ${asset.model_series || ''}` : "Unnamed Asset";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex flex-col items-center">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md overflow-hidden border border-blue-500">
        <div className="bg-blue-900 p-6 flex flex-col items-center text-white">
          <img src={bpkLogo} alt="Logo" className="h-16 mb-3 p-1" />
          <h1 className="text-xl font-bold tracking-wide">INFORMASI ASET</h1>
          <span className="text-xs opacity-80 mt-1">Realtime Verification System</span>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{assetName}</h2>
            <p className="text-md text-gray-600">{asset.category_code || "-"}</p>
          </div>

          <div className="space-y-3 text-sm">
             <InfoRow label="Status" value={asset.status} isStatus />
             <InfoRow label="Barcode IT" value={asset.barcode} />
             <InfoRow label="Serial Number" value={asset.serial_number || "-"} />
             <InfoRow label="Sekolah" value={asset.school?.name || "-"} />
             <InfoRow label="Lokasi/Ruang" value={asset.room ? `${asset.room} (Lt. ${asset.floor})` : "-"} />
             <InfoRow label="Brand" value={asset.brand || "-"} />
             <InfoRow label="Model" value={asset.model_series || "-"} />
             <InfoRow label="Pengguna" value={asset.assigned_to || "-"} />
             <InfoRow label="Terakhir Update" value={asset.updated_at ? new Date(asset.updated_at).toLocaleDateString() : "-"} />
          </div>
        </div>

        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          &copy; IT Asset Management BPK Penabur
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, isStatus }) => (
  <div className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
    <span className="text-gray-500 font-medium">{label}</span>
    {isStatus ? (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        value === 'Berfungsi' ? 'bg-green-100 text-green-700' : 
        value === 'Rusak' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
      }`}>
        {value}
      </span>
    ) : (
      <span className="text-gray-800 font-semibold max-w-[60%] text-right">{value}</span>
    )}
  </div>
);

export default ScanResult;