import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Loader2, Eye, Building2, MapPin, Pencil, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import api from '../../services/api';
import logoBpk from '../../assets/images/logo-bpk.png';

const DesktopAssetList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await api.get('/assets', { 
            params: { 
              search: search || undefined,
              page: page,
              size: pageSize,
              sort_by: sortBy,
              sort_order: sortOrder
            } 
        });
        setAssets(res.data.items || []);
        setTotalItems(res.data.total || 0);
        setTotalPages(Math.ceil((res.data.total || 0) / pageSize));
      } catch (error) {
        console.error(error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchAssets(), 500);
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

  const getStatusColor = (statusRaw) => {
    const status = statusRaw?.toLowerCase() || '';
    if (status.includes('berfungsi') || status.includes('baik') || status.includes('ok')) return 'bg-green-100 text-green-700 border border-green-200';
    if (status.includes('rusak') || status.includes('bad')) return 'bg-red-100 text-red-700 border border-red-200';
    if (status.includes('perbaikan') || status.includes('service')) return 'bg-orange-100 text-orange-700 border border-orange-200';
    if (status.includes('terkendala') || status.includes('warn')) return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-penabur-blue border-b border-blue-800 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
            <div className="bg-white/10 p-1 rounded-lg backdrop-blur-sm"><img src={logoBpk} alt="Logo" className="h-10 w-auto" /></div>
            <h1 className="font-bold text-white text-xl leading-none">Daftar Aset</h1>
        </div>
        <button onClick={() => navigate('/user/home')} className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors flex items-center text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" /> Kembali
        </button>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Cari Serial Number, Barcode, atau Nama..." 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
            </div>
            
            <div className="flex items-center gap-4">
                <div className="text-gray-500 font-medium text-sm bg-white px-4 py-2.5 rounded-lg shadow-sm border border-gray-100">
                    Total: <span className="text-penabur-blue font-bold">{totalItems}</span>
                </div>
                <select 
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm outline-none"
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                    <option value="10">10 / Hal</option>
                    <option value="25">25 / Hal</option>
                    <option value="50">50 / Hal</option>
                    <option value="100">100 / Hal</option>
                </select>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
            <div className="overflow-x-auto flex-1">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 text-center uppercase font-bold text-xs sticky top-0 z-10">
                        <tr>
                            <th className="p-4 border-b w-10 text-center">No</th>
                            
                            <th className="p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('asset_name')}>
                                <div className="flex items-center gap-1">Nama Aset <ArrowUpDown size={14} className={sortBy === 'asset_name' ? 'text-blue-600' : 'text-gray-400'}/></div>
                            </th>
                            
                            <th className="p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('barcode')}>
                                <div className="flex items-center gap-1">Barcode IT <ArrowUpDown size={14} className={sortBy === 'barcode' ? 'text-blue-600' : 'text-gray-400'}/></div>
                            </th>
                            
                            <th className="p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('serial_number')}>
                                <div className="flex items-center gap-1">Serial Number <ArrowUpDown size={14} className={sortBy === 'serial_number' ? 'text-blue-600' : 'text-gray-400'}/></div>
                            </th>
                            
                            <th className="p-4 border-b">Sekolah</th>
                            <th className="p-4 border-b">Area</th>
                            <th className="p-4 border-b">Lokasi</th>
                            
                            <th className="p-4 border-b text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                                <div className="flex items-center justify-center gap-1">Status <ArrowUpDown size={14} className={sortBy === 'status' ? 'text-blue-600' : 'text-gray-400'}/></div>
                            </th>
                            
                            <th className="p-4 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="9" className="p-20 text-center"><Loader2 className="animate-spin inline mr-2 text-penabur-blue" size={32}/> <p className="mt-2 text-gray-500">Memuat data...</p></td></tr>
                        ) : assets.length === 0 ? (
                            <tr><td colSpan="9" className="p-20 text-center text-gray-500">Tidak ada data ditemukan.</td></tr>
                        ) : (
                            assets.map((asset, idx) => (
                                <tr key={asset.id} className="hover:bg-blue-50 transition-colors group">
                                    <td className="p-4 text-center text-gray-400">{(page - 1) * pageSize + idx + 1}</td>
                                    <td className="p-4 font-bold text-gray-800">{asset.brand} {asset.model_series}</td>
                                    <td className="p-4 font-mono text-penabur-blue">{asset.barcode}</td>
                                    <td className="p-4 text-gray-600">{asset.serial_number}</td>
                                    
                                    <td className="p-4 text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={14} className="text-gray-400"/>
                                            <span className="font-medium">{asset.school?.name || '-'}</span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase text-gray-500">
                                            {asset.school?.area?.name || '-'}
                                        </span>
                                    </td>

                                    <td className="p-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-gray-400"/>
                                            <span>{asset.room} (Lt. {asset.floor})</span>
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => navigate(`/user/asset/${asset.id}`)}
                                                className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            
                                            {role === 'operator' && (
                                                <button 
                                                    onClick={() => navigate(`/school/${asset.school_id}/asset/${asset.id}/edit`)}
                                                    className="bg-yellow-50 text-yellow-600 p-2 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors"
                                                    title="Edit Aset"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    Halaman <span className="font-bold text-gray-800">{page}</span> dari <span className="font-bold text-gray-800">{totalPages}</span>
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1 || loading}
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        disabled={page >= totalPages || loading}
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default DesktopAssetList;