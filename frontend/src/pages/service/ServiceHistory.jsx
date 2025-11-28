import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Wrench, Calendar, Tag } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const ServiceHistory = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { setCrumbs } = useBreadcrumb();

  useEffect(() => {
    setCrumbs(['Service History']);
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services', { params: { search: search || undefined } });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Wrench className="text-penabur-blue mr-2" /> Riwayat Service
            </h2>
            <p className="text-gray-500 text-lg mt-1">Logbook perbaikan aset IT.</p>
          </div>
          <Link to="/service-history/add">
            <button className="bg-penabur-blue text-white px-4 py-2 rounded-lg hover:bg-penabur-dark flex items-center shadow-md">
              <Plus size={18} className="mr-2" /> Input Service Baru
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Search className="text-gray-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Cari No Tiket atau SN/Barcode..." 
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
              <tr>
                <th className="p-4 border-b">No</th>
                <th className="p-4 border-b">Tiket / Tanggal</th>
                <th className="p-4 border-b">Aset / SN</th>
                <th className="p-4 border-b">Lokasi / Owner</th>
                <th className="p-4 border-b">Kondisi (Issue)</th>
                <th className="p-4 border-b">Vendor</th>
                <th className="p-4 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-6 text-center text-gray-500">Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan="7" className="p-6 text-center text-gray-500">Belum ada data service.</td></tr>
              ) : (
                services.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-blue-50">
                    <td className="p-4 text-gray-500">{idx + 1}</td>
                    <td className="p-4">
                      <div className="font-bold text-penabur-blue">{item.ticket_no || '-'}</div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Calendar size={10} className="mr-1"/> {item.service_date || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{item.asset_name || 'No Name'}</div>
                      <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1 py-0.5 rounded inline-block mt-1">
                        {item.sn_or_barcode}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>{item.unit_name || '-'}</div>
                      <div className="text-xs text-gray-400">{item.owner}</div>
                    </td>
                    <td className="p-4 font-medium text-red-600 max-w-xs truncate" title={item.issue_description}>
                      {item.issue_description}
                    </td>
                    <td className="p-4 text-gray-600">{item.vendor}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Clear' ? 'bg-green-100 text-green-700' :
                        item.status === 'Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServiceHistory;