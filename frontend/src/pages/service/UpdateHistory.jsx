import React, { useState, useEffect } from 'react';
import { FileClock, Search, History, MapPin, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const UpdateHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const { setCrumbs } = useBreadcrumb();

  useEffect(() => {
    setCrumbs(['Update History']);
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pageSize,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      const res = await api.get('/logs', { params });
      setLogs(res.data.items);
      setTotalItems(res.data.total);
      setTotalPages(Math.ceil(res.data.total / pageSize));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLogs();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, page, pageSize, sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
    setPage(1);
  };

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

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center flex-1">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
                type="text" 
                placeholder="Cari Log berdasarkan Barcode..." 
                className="w-full outline-none text-gray-700"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => handleSort('created_at')}
                className={`flex items-center text-sm font-medium transition-colors ${sortBy === 'created_at' ? 'text-penabur-blue' : 'text-gray-500'}`}
             >
                <ArrowUpDown size={14} className="mr-1"/> Urutkan Tanggal
             </button>
             
             <select 
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-penabur-blue bg-white text-sm"
                value={pageSize} 
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
                <option value="10">10 / Hal</option>
                <option value="25">25 / Hal</option>
                <option value="50">50 / Hal</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
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
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`uppercase px-2 py-0.5 rounded text-[10px] font-bold ${
                                                log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                                log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {log.action}
                                            </span>
                                            <span className="text-sm font-bold text-gray-800">
                                                {log.asset_name || 'Unknown Asset'}
                                            </span>
                                        </div>
                                        
                                        <p className="text-xs text-penabur-blue font-mono mb-1 font-semibold">
                                            {log.asset_barcode}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500 mb-2">
                                            <MapPin size={12} className="mr-1 text-gray-400"/>
                                            <span className="font-medium text-gray-600">
                                                {log.area_name || 'Area -'}
                                            </span>
                                            <span className="mx-1">•</span>
                                            <span className="font-medium text-gray-600">
                                                {log.school_name || 'Sekolah -'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-2">
                                            "{log.details}"
                                        </p>
                                    </div>
                                    
                                    <div className="text-right mt-2 md:mt-0 min-w-[120px]">
                                        <p className="text-xs text-gray-500 font-medium">
                                            {formatDate(log.created_at)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            by <span className="font-semibold text-gray-600">{log.actor}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50 mt-auto">
                <div className="text-xs text-gray-500 font-medium">
                    Halaman <span className="font-bold text-gray-700">{page}</span> dari <span className="font-bold text-gray-700">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default UpdateHistory;