import React, { useState, useRef } from 'react';
import { BarChart2, Upload, CheckCircle2, Loader2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { downloadBlob, downloadSampleCSV } from '../utils/download';
import ExcelFormatCard from '../components/ExcelFormatCard';

const PURCHASE_HEADERS = [
  'Company Name',
  'Invoice Amount',
  'Invoice Date',
  'Distributor Code',
  'Purchase Date'
];

const PurchasePage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileName = selectedFile.name.split('.')[0];
      if (!/^[a-zA-Z0-9_-]+$/.test(fileName)) {
        toast.error('File name should not contain spaces and only special characters allowed are _ and -');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/purchase', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      downloadBlob(response.data, `processed_purchase_${Date.now()}.xlsx`);
      toast.success('Purchase data processed successfully!');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <BarChart2 size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Purchase Orders</h2>
                <p className="text-gray-500">Processing procurement and vendor invoices.</p>
              </div>
            </div>

            <div className="space-y-8">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="purchaseFile"
              />

              <div
                onClick={triggerFileInput}
                className={`cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center min-h-[300px] ${file ? 'bg-emerald-50/50 border-emerald-200' : 'bg-gray-50/50 border-gray-200 hover:border-emerald-400 hover:bg-white'
                  }`}
              >
                {file ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{file.name}</h3>
                    <p className="text-gray-500 mb-8">{(file.size / 1024).toFixed(2)} KB • Ready to upload</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      Cancel selection
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center text-gray-400 mb-6 font-thin">
                      <CreditCard size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select Purchase File</h3>
                    <p className="text-gray-500">XLSX formats supported</p>
                  </>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={loading || !file}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload Purchase</span>
                )}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[350px] shrink-0">
            <ExcelFormatCard
              headers={PURCHASE_HEADERS}
              moduleName="Purchase"
              onDownloadSample={() => downloadSampleCSV(PURCHASE_HEADERS, 'purchase_data_sample')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;
