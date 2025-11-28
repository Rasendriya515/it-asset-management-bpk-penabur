import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight, Building2 } from 'lucide-react'; // Hapus 'School' jika tidak dipakai
import MainLayout from '../../components/layout/MainLayout';
import api from '../../services/api';
import { useBreadcrumb } from '../../context/BreadcrumbContext';

const AreaDetail = () => {
  const { id } = useParams();
  const [schools, setSchools] = useState([]);
  const [areaInfo, setAreaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Panggil Hook Breadcrumb
  const { setCrumbs } = useBreadcrumb();

  // --- USE EFFECT GABUNGAN (LEBIH EFISIEN) ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Ambil Info Area
        const areaRes = await api.get(`/areas/${id}`);
        setAreaInfo(areaRes.data);
        
        // LAPOR KE BREADCRUMB (PENTING!)
        setCrumbs([areaRes.data.name]); 

        // 2. Ambil Daftar Sekolah
        const schoolRes = await api.get(`/areas/${id}/schools`);
        setSchools(schoolRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <MapPin className="text-penabur-blue mr-3" />
              Area {areaInfo ? areaInfo.name : 'Loading...'}
            </h2>
            <p className="text-gray-500 text-lg mt-1">
              Daftar Sekolah & Unit Kerja di wilayah ini
            </p>
          </div>
          <div className="bg-blue-50 text-penabur-blue px-4 py-2 rounded-lg font-bold text-xl">
            {schools.length} <span className="text-sm font-normal text-gray-600">Sekolah</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-penabur-blue"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Link 
                key={school.id} 
                to={`/school/${school.id}`}
                className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-penabur-blue transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 group-hover:bg-blue-100"></div>

                <div className="relative z-10">
                  <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-penabur-blue mb-4 group-hover:bg-penabur-blue group-hover:text-white transition-colors">
                    <Building2 size={24} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-penabur-blue transition-colors line-clamp-2 h-14">
                    {school.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-400 mt-4 group-hover:text-penabur-dark font-medium">
                    Lihat Aset <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AreaDetail;