import React, { useState, useEffect } from 'react';
import { FileClock, Search, History } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const UpdateHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { setCrumbs } = useBreadcrumb();

  useEffect(() => {
    setCrumbs(['Update History']); 
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.get('/logs', { params: { search: search || undefined } });
        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [search]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FileClock className="text-penabur-blue mr-2" /> Update History
                </h2>
                <p className="text-gray-500 text-lg mt-1">Audit Log otomatis sistem.</p>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <Search className="text-gray-400 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Cari Log berdasarkan Barcode..." 
            className="w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
                <div className="p-8 text-center text-gray-500">Memuat Log...</div>
            ) : logs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Belum ada aktivitas tercatat.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 flex items-start space-x-4 transition-colors">
                            <div className={`p-2 rounded-full mt-1 flex-shrink-0 ${
                                log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                                log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-600'
                            }`}>
                                <History size={20} />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">
                                            <span className={`uppercase mr-2 px-2 py-0.5 rounded text-[10px] ${
                                                log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                                log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {log.action}
                                            </span>
                                            {log.asset_name || 'Unknown Asset'}
                                        </p>
                                        <p className="text-xs text-penabur-blue font-mono mt-1">
                                            {log.asset_barcode}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {log.details}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-medium">
                                            {formatDate(log.created_at)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            by {log.actor}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </MainLayout>
  );
};

export default UpdateHistory;