import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

const ScanQR = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {

    const readerElement = document.getElementById("reader");
    if (readerElement) {
        readerElement.innerHTML = "";
    }

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;
    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        handleScanSuccess(decodedText);
      },
      (errorMessage) => {
      }
    ).then(() => {
        setIsScanning(true);
        setErrorMsg('');
    }).catch((err) => {
        setIsScanning(false);
        // Cek jenis error
        if (typeof err === 'string' && err.includes('Permission')) {
            setErrorMsg("Izin kamera ditolak. Mohon izinkan akses kamera di browser.");
        } else {
            console.log("Camera Start Warning:", err);
        }
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((err) => console.warn("Stop failed", err));
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleScanSuccess = (decodedText) => {
    if (scannerRef.current) {
        // Stop scanning dulu sebelum pindah halaman
        scannerRef.current.stop().then(() => {
            scannerRef.current.clear();
            
            // Logika Redirect
            if (decodedText.includes('/scan-asset/')) {
                const parts = decodedText.split('/scan-asset/');
                const barcode = parts[1];
                navigate(`/scan-result/${barcode}`);
            } else {
                navigate(`/scan-result/${decodedText}`);
            }
        }).catch(err => console.error("Stop failed on success", err));
    }
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Scan QR Aset</h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
            <div className="relative bg-black rounded-lg overflow-hidden min-h-[300px]">
                {/* ID ini penting untuk library kamera */}
                <div id="reader" className="w-full h-full"></div>
                {!isScanning && !errorMsg && (
                    <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                        <p>Memuat Kamera...</p>
                    </div>
                )}
            </div>
            {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center border border-red-200">
                    ⚠️ {errorMsg}
                </div>
            )}
            
            <div className="mt-4 text-center text-sm text-gray-500">
                <p>Arahkan kamera laptop/HP ke QR Code.</p>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ScanQR;