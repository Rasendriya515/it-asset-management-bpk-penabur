import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Server, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const MobileAssetList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); 
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await api.get('/assets', { 
            params: { 
              search: search || undefined,
              page: page,
              size: pageSize,
              sort_by: 'created_at', 
              sort_order: 'desc'
            } 
        });
        setAssets(res.data.items || []);
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
  }, [search, page, pageSize]);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
      <div className="w-full max-w-md bg-gray-50 min-h-screen shadow-2xl relative flex flex-col">
        <div className="bg-penabur-blue p-6 pb-8 rounded-b-[2rem] shadow-md z-10">
           <button onClick={() => navigate('/user/home')} className="text-white mb-4 flex items-center">
              <ArrowLeft className="mr-2" /> Kembali
           </button>
           <h1 className="text-2xl font-bold text-white">Daftar Aset</h1>
           <p className="text-blue-200 text-xs">Cari aset di seluruh database</p>
           <div className="mt-6">
              <div className="bg-white p-3 rounded-xl shadow-lg flex items-center border border-gray-100">
                  <Search className="text-gray-400 mr-3" size={20} />
                  <input 
                      type="text" 
                      placeholder="Cari SN / Barcode / Nama..." 
                      className="w-full outline-none text-gray-700 placeholder-gray-400 font-medium"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
              </div>
           </div>
        </div>
        
        <div className="px-6 pt-6 pb-20 flex-1 overflow-y-auto">
           {loading ? (
               <div className="flex flex-col items-center justify-center mt-10 text-penabur-blue">
                   <Loader2 className="animate-spin mb-2" size={32}/>
                   <span className="text-xs font-medium text-gray-400">Memuat data...</span>
               </div>
           ) : assets.length === 0 ? (
               <div className="text-center text-gray-400 mt-10 text-sm">Tidak ada aset ditemukan.</div>
           ) : (
               <div className="space-y-3">
                   {assets.map((asset) => (
                       <Link 
                         key={asset.id} 
                         to={`/user/asset/${asset.id}`}
                         className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-98 transition-transform cursor-pointer block"
                       >
                           <div className="bg-blue-50 p-3 rounded-lg text-penabur-blue flex-shrink-0">
                               <Server size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                               <h3 className="font-bold text-gray-800 truncate text-sm">{asset.brand} {asset.model_series}</h3>
                               <p className="text-xs text-gray-500 font-mono truncate mb-1">{asset.barcode}</p>
                               <div className="flex justify-between items-center">
                                   <div className={`text-[10px] px-2 py-0.5 rounded font-bold inline-block ${
                                       asset.status?.toLowerCase().includes('berfungsi') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                   }`}>
                                       {asset.status}
                                   </div>
                                   <span className="text-[10px] text-gray-400">
                                      {asset.school?.name ? asset.school.name.substring(0, 15) + '...' : '-'}
                                   </span>
                               </div>
                           </div>
                       </Link>
                   ))}
               </div>
           )}
        </div>

        <div className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
            <button 
                disabled={page === 1 || loading}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-all text-penabur-blue border border-gray-200"
            >
                <ChevronLeft size={24} />
            </button>
            
            <span className="text-xs font-bold text-gray-600">
                Hal {page} / {totalPages || 1}
            </span>

            <button 
                disabled={page >= totalPages || loading}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-all text-penabur-blue border border-gray-200"
            >
                <ChevronRight size={24} />
            </button>
        </div>

      </div>
    </div>
  );
};

export default MobileAssetList;