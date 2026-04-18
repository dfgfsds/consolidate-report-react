import React, { useState, useRef } from 'react';
import { ShoppingCart, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { downloadBlob, downloadSampleCSV } from '../utils/download';
import ExcelFormatCard from '../components/ExcelFormatCard';
import { validateFile } from '../utils/fileValidation';

const SALES_HEADERS = [
  'Company Name',
  'Bill Date',
  'Customer Code',
  'Bill Amount Before GST',
  'GST Amount'
];

const SalesPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setValidating(true);
    try {
      const result = await validateFile(selectedFile, 'sales', SALES_HEADERS);
      if (!result.isValid) {
        toast.error(result.error);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setFile(null);
        return;
      }
      setFile(selectedFile);
      toast.success('File validated successfully');
    } catch (error) {
      toast.error('Error validating file');
    } finally {
      setValidating(false);
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
      const response = await api.post('/sales', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      downloadBlob(response.data, `processed_sales_${Date.now()}.xlsx`);
      toast.success('Sales data processed successfully!');
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <ShoppingCart size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sales Transactions</h2>
                <p className="text-gray-500">Upload sales data for processing and reconciliation.</p>
              </div>
            </div>

            <div className="space-y-8">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="salesFile"
              />

              <div
                onClick={triggerFileInput}
                className={`cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center min-h-[300px] ${file ? 'bg-indigo-50/50 border-indigo-200' : 'bg-gray-50/50 border-gray-200 hover:border-indigo-400 hover:bg-white'
                  }`}
              >
                {file ? (
                  <>
                    <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{file.name}</h3>
                    <p className="text-gray-500 mb-8">{(file.size / 1024).toFixed(2)} KB • Ready to process</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center text-gray-400 mb-6 font-thin">
                      <Upload size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select Sales File</h3>
                    <p className="text-gray-500">XLSX, CSV supported</p>
                  </>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                disabled={loading || validating || !file}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3"
              >
                {loading || validating ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>{validating ? 'Validating...' : 'Processing...'}</span>
                  </>
                ) : (
                  <span>Upload Sales</span>
                )}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[350px] shrink-0">
            <ExcelFormatCard
              headers={SALES_HEADERS}
              moduleName="Sales"
              onDownloadSample={() => downloadSampleCSV(SALES_HEADERS, 'sales_data_sample')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
