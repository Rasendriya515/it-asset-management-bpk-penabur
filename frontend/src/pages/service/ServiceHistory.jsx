import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Wrench, Pencil, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const ServiceHistory = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState('service_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const { setCrumbs } = useBreadcrumb();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        size: pageSize,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      const res = await api.get('/services', { params });
      setServices(res.data.items);
      setTotalItems(res.data.total);
      setTotalPages(Math.ceil(res.data.total / pageSize));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCrumbs(['Service History']);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices();
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

  return (
    <MainLayout>
      <div className="space-y-6">
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

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center flex-1">
            <Search className="text-gray-400 mr-2" size={20} />
            <input 
              type="text" 
              placeholder="Cari No Tiket atau SN/Barcode..." 
              className="w-full outline-none text-gray-700"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto pb-4">
            <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-700 text-center uppercase font-bold text-xs">
                <tr>
                  <th className="p-4 border-b w-10 text-center">No</th>
                  
                  <th className="p-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('ticket_no')}>
                    <div className="flex items-center justify-center gap-1">
                      No Tiket <ArrowUpDown size={12} className="text-gray-400"/>
                    </div>
                  </th>
                  
                  <th className="p-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('service_date')}>
                    <div className="flex items-center justify-center gap-1">
                      Tanggal <ArrowUpDown size={12} className="text-gray-400"/>
                    </div>
                  </th>

                  <th className="p-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('asset_name')}>
                    <div className="flex items-center justify-center gap-1">
                      Nama Aset <ArrowUpDown size={12} className="text-gray-400"/>
                    </div>
                  </th>

                  <th className="p-4 border-b">SN / Barcode</th>
                  <th className="p-4 border-b">Thn Prod</th>
                  <th className="p-4 border-b">Lokasi / Unit</th>
                  <th className="p-4 border-b">Owner</th>
                  <th className="p-4 border-b">Kondisi</th>
                  
                  <th className="p-4 border-b cursor-pointer hover:bg-gray-100" onClick={() => handleSort('vendor')}>
                    <div className="flex items-center justify-center gap-1">
                      Vendor <ArrowUpDown size={12} className="text-gray-400"/>
                    </div>
                  </th>

                  <th className="p-4 border-b text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                    <div className="flex items-center justify-center gap-1">
                      Status <ArrowUpDown size={12} className="text-gray-400"/>
                    </div>
                  </th>
                  
                  <th className="p-4 border-b text-center sticky right-0 bg-gray-50 shadow-l">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="12" className="p-6 text-center text-gray-500">Loading...</td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan="12" className="p-6 text-center text-gray-500">Belum ada data service.</td></tr>
                ) : (
                  services.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-blue-50 group">
                      <td className="p-4 text-center text-gray-500">{(page - 1) * pageSize + idx + 1}</td>
                      
                      <td className="p-4 font-bold text-penabur-blue">{item.ticket_no || '-'}</td>
                      
                      <td className="p-4 text-gray-600">
                        {item.service_date || '-'}
                      </td>
                      
                      <td className="p-4 font-medium text-gray-800">
                        {item.asset_name || '-'}
                      </td>
                      
                      <td className="p-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                            {item.sn_or_barcode}
                        </span>
                      </td>

                      <td className="p-4 text-gray-600 text-center">
                        {item.production_year || '-'}
                      </td>
                      
                      <td className="p-4 text-gray-600">
                        {item.unit_name || '-'}
                      </td>
                      
                      <td className="p-4 text-gray-600">
                        {item.owner || '-'}
                      </td>
                      
                      <td className="p-4 text-red-600 font-medium max-w-xs truncate" title={item.issue_description}>
                        {item.issue_description}
                      </td>
                      
                      <td className="p-4 text-gray-600">
                        {item.vendor}
                      </td>
                      
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          (item.status.includes('Clear') || item.status.includes('Selesai')) ? 'bg-green-100 text-green-700 border-green-200' :
                          (item.status.includes('Progress') || item.status.includes('Sedang')) ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          item.status.includes('GARANSI') ? 'bg-purple-100 text-purple-700 border-purple-200' :
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                          {item.status}
                      </span>
                      </td>

                      <td className="p-3 text-center sticky right-0 bg-white group-hover:bg-blue-50 shadow-l border-l border-gray-100 transition-colors">
                        <Link to={`/service-history/edit/${item.id}`}>
                            <button 
                                className="bg-yellow-50 text-yellow-700 hover:bg-yellow-500 hover:text-white border border-yellow-200 px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center text-xs font-bold"
                                title="Edit Service"
                            >
                                <Pencil size={14} className="mr-1.5" /> Edit
                            </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
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

export default ServiceHistory;